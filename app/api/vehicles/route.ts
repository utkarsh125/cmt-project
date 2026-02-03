import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { vehicleCreateSchema } from '@/lib/validations/vehicle.schema';
import { validateData } from '@/lib/middleware/validation';
import jwt from 'jsonwebtoken';

// Helper to get user ID from Authorization header
function getUserIdFromRequest(req: Request): number | null {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.substring(7);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
        return decoded.userId;
    } catch {
        return null;
    }
}

// GET /api/vehicles - Get all vehicles for logged-in user
export async function GET(req: Request) {
    try {
        const userId = getUserIdFromRequest(req);

        if (!userId) {
            return NextResponse.json(
                { message: 'Unauthorized', vehicles: [] },
                { status: 200 } // Return empty array instead of 401 for better UX
            );
        }

        const vehicles = await prisma.vehicle.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ vehicles }, { status: 200 });
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        return NextResponse.json(
            { message: 'Failed to fetch vehicles', vehicles: [] },
            { status: 500 }
        );
    }
}

// POST /api/vehicles - Add a new vehicle
export async function POST(req: Request) {
    try {
        const userId = getUserIdFromRequest(req);

        if (!userId) {
            return NextResponse.json(
                { message: 'Please login to save vehicles' },
                { status: 401 }
            );
        }

        const body = await req.json();

        // Validate request body
        const validation = validateData(vehicleCreateSchema, body);
        if (!validation.success) {
            return validation.error;
        }

        const vehicle = await prisma.vehicle.create({
            data: {
                ...validation.data,
                userId,
            },
        });

        return NextResponse.json(
            { message: 'Vehicle added successfully', vehicle },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating vehicle:', error);
        return NextResponse.json(
            { message: 'Failed to add vehicle' },
            { status: 500 }
        );
    }
}
