# the docker file uses a multi-stage build approach
# 1. deps: install dependencies
# 2. builder: build the application
# 3. runner: run the application

#--------------------------------------------------------------------------------

# Stage 1 (deps)
FROM node:20-alpine AS deps

# FROM starts a new build stage
# node:20-alpine is Node version 20 on Alpine Linux (minimal linux distro)
# AS deps tags this stage as 'deps' for later references


RUN apk add --no-cache libc6-compat openssl
# RUN executes a command in the container
# apk is the package manager like yay/pacman
# add --no-cache to eliminate package caching (smaller image size)
# libc6-compat is a compatibility layer for running Linux binaries on Alpine
# openssl is required for Next.js

#NOTE: Prisma reqiuries OpenSSL to work properly, and some npm pacakges require libc6-compat


WORKDIR /app 
COPY package*.json ./
# WORKDIR sets the working directory for the container (equivalent to cd /app)
# All subsequent commands will be run in this directory
# COPY copies files from the host to the container
# Why copy only package.json and package-lock.json?
# - docker uses layer caching, if these files do not change, docker can reuse the next step's cache to make builds faster

COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts
# COPY Prisma schema and config files BEFORE npm ci (newer version of prisma being used here)


RUN npm ci 
# npm ci = npm "clean install", just like npm install but it's faster and more reliable
# deletes the node_modules folder to ensure clean state
# why not npm install? "clean install" is deterministic, it will always install the exact same dependencies
# this ensures that the dependencies are consistent across different environments

#--------------------------------------------------------------------------------

# Stage 2 (builder)

FROM node:20-alpine AS builder
# Start a new stage (previous stage is gone as files were not copied)
# Why a new stage? - separation of concerns is easier, separations installation of deps from building the app

RUN apk add --no-cache libc6-compat openssl
# each stage is independent, so we need to install dependencies again


WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
# COPY --from=deps copies files from the 'deps' stage
# /app/node_modules is the source directory in the 'deps' stage
# ./node_modules is the destination directory in the 'builder' stage
# Why do this? - to reuse the node_modules from the 'deps' stage to save time by using docker's caching

COPY . .
# COPY everything from project directory to /app in the container
# First (.) -> source (host)
# Second (.) -> destination (container)
#What gets copied? - everything except .dockerignore mentioned files

RUN npx prisma generate
# npx prisma generate = generate Prisma client
# This stage is critical - Prisma CLient is the code you use to query the DB. 
# without this, the app won't work. 
# this reads prisma/schema.prisma and generates TypeScript types and query functions


ENV NEXT_TELEMETRY_DISABLED=1
#ENV sets an environment variable
#Disables Next.js telemetry (analytics collection)
# Why disable it? - Privacy and slightly faster builds


RUN npm run build
# npm run build = build the app
# for nextjs this runs next build
# compiles ts code, optimizes it, generates static files (pages)

#------------------------------------------------------------------------------

# Stage 3 (runner)

FROM node:20-alpine AS runner
# FINAL stage - this becomes production image
# Previous stages (deps, builder) are discarded - only what we explicitly copy remains
# Why a third stage? - The builder stage has source code, build tools, etc.
# We only need the built output for production. This keeps the final image minimal 


RUN apk add --no-cache openssl 
# Install only OpenSSL (not libc6-compat this time)
# Why only OpenSSL? - Prisma needs it to connect to databases
# We don't need libc6-compat at runtime, only during npm install


WORKDIR /app
ENV NODE_ENV=production
# Set environment variable NODE_ENV to "production"
# Why this matters?
# - Node.js and Next.js behave differently in production
# - More optimizations, less verbose logging
# - Some packages check this to enable production mode

ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
# addgroup creates a system group named "nodejs" with group ID 1001
# adduser creates a system user named "nextjs" with user ID 1001
# --system flag means it's a system group (not a regular user group)
# why do this? - security, isolation, and resource management

COPY --from=builder /app/public ./public
# COPY the public folder from builder stage

COPY --from=builder /app/package.json ./package.json
# COPY the package.json from builder stage
# Why? - the standalone build might reference package.json for version info or scripts

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# COPY the standalone build from builder stage
# --chown=nextjs:nodejs changes ownership of the files to the nextjs user
# .next/standalone contains minimal files needed to run nextjs 

COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# COPY optimized static assets (JavaScript bundles, CSS, etc.)
# Why separate from standalone? - Next.js needs the static folder at .next/static specifically for client-side code

COPY --from=builder /app/prisma ./prisma
# COPY Prisma schema and migrations
# Why? - Needed for running migrations (prisma migrate deploy) in production
# This includes schema.prisma and the migrations/ folder

COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
# COPY Prisma Client files from builder stage
# .prisma contains the generated Prisma Client (the actual code that queries database)
# @prisma contains Prisma runtime engines (binary files that communicate with database)
# Why these specific folders? - These are needed at runtime to query database
# Without these: You will get "PrismaClient is unable to be run in the browser" or "Cannot find module @prisma/client" errors


USER nextjs
# Switch to the non-root user we created earlier
# What happens now? - All subsequent commands and the application run as "nextjs" user, not root
# This is the security payoff - even if exploited, attacker only has nextjs user privileges


EXPOSE 3000
# Documents that the container listens on port 3000
# Does NOT actually publish the port - that's done with -p flag when running docker run

ENV PORT=3000
# Set environment variable telling Next.js which port to use
# Next.js reads this to know what port to listen on


ENV HOSTNAME="0.0.0.0"
# Tell Next.js to listen on all network interfaces
# Why "0.0.0.0" instead of "localhost"?
# - "localhost" is only accessible from inside the container
# - "0.0.0.0" makes the app accessible from outside the container
# - Required for docker networking to work, without this, one can't access the app from the browser.***


CMD ["node", "server.js"]
#CMD is the default command to run when container starts
# ["node", "server.js"] runs node.js and server.js (from the standalone build
#Why not RUN instead of CMD?
# RUN executes during build (creates image layers)
# CMD executes during runtime (runs the app)
# Only 1 CMD per Dockerfile
