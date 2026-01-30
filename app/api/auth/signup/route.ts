import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";


export async function POST(req: NextRequest) {

    try {


        const body = await req.json();
        const { username, password, name, role } = body;

        //basic validation
        if (!username || !password || !name) {
            return NextResponse.json({
                message: "Username, password and name are required."
            }, {
                status: 400
            })
        }

        //check if user already exists in the db
        const existingUser = await prisma.user.findUnique({
            where: {
                username: username,
            }
        })

        if (existingUser) { //true
            return NextResponse.json({
                message: "User already exists."
            }, {
                status: 409
            })
        }

        //hash pass
        const hashedPassword = await bcrypt.hash(password, 10); //salt * 10

        const newUser = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                name,
                role: role || "CUSTOMER", //default niggas to "CUSTOMER"
            }
        });

        return NextResponse.json({
            message: "User created successfully",
            user: {
                id: newUser.id,
                username: newUser.username,
                password: newUser.password,
                role: newUser.role
            },
        }, {
            status: 201
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "Internal server error"
        }, {
            status: 500
        })
    }
}