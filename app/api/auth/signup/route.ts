import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, password, role } = body;

        // Basic validation
        if (!name || !email || !password) {
            return NextResponse.json({
                message: "Name, email and password are required."
            }, {
                status: 400
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({
                message: "Please enter a valid email address."
            }, {
                status: 400
            });
        }

        // Validate password length
        if (password.length < 8) {
            return NextResponse.json({
                message: "Password must be at least 8 characters."
            }, {
                status: 400
            });
        }

        // Check if user already exists in the db (by email or username)
        const existingUserByEmail = await prisma.user.findUnique({
            where: { email: email }
        });

        const existingUserByUsername = await prisma.user.findUnique({
            where: { username: email }
        });

        if (existingUserByEmail || existingUserByUsername) {
            return NextResponse.json({
                message: "An account with this email already exists."
            }, {
                status: 409
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username: email, // Use email as username for compatibility
                email,
                password: hashedPassword,
                name,
                role: role || "CUSTOMER",
            }
        });

        return NextResponse.json({
            message: "Account created successfully! Please login.",
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role
            },
        }, {
            status: 201
        });
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json({
            message: "Internal server error"
        }, {
            status: 500
        });
    }
}