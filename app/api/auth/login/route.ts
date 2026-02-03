import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({
                message: "Email and Password are required",
            }, {
                status: 400
            })
        }

        // Find the user by email
        const user = await prisma.user.findUnique({
            where: {
                email
            },
        });

        if (!user) {
            return NextResponse.json({
                message: "Invalid email or password",
            }, {
                status: 401
            })
        }

        // Password verification
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return NextResponse.json({
                message: "Invalid email or password",
            }, {
                status: 401
            })
        }

        // JWT token generation
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not defined");
            return NextResponse.json({
                message: "Internal server error",
            }, {
                status: 500
            })
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d',
            }
        );

        // Return the token and user info (without password)
        return NextResponse.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            }
        }, {
            status: 200
        })

    } catch (error) {
        console.error("Error signing in: ", error);
        return NextResponse.json({
            message: "Internal server error",

        }, {
            status: 500
        })
    }
}