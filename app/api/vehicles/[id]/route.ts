import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { vehicleUpdateSchema } from '@/lib/validations/vehicle.schema';
import { idParamSchema } from '@/lib/validations/booking.schema';
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

// PUT /api/vehicles/[id] - Update a vehicle
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userId = getUserIdFromRequest(req);
        if (!userId) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id: idString } = await params;

        // Validate ID parameter
        const idValidation = validateData(idParamSchema, { id: idString });
        if (!idValidation.success) {
            return idValidation.error;
        }

        const { id } = idValidation.data;

        // Verify user owns this vehicle
        const existingVehicle = await prisma.vehicle.findFirst({
            where: { id, userId },
        });

        if (!existingVehicle) {
            return NextResponse.json(
                { message: 'Vehicle not found' },
                { status: 404 }
            );
        }

        const body = await req.json();

        // Validate request body
        const bodyValidation = validateData(vehicleUpdateSchema, body);
        if (!bodyValidation.success) {
            return bodyValidation.error;
        }

        const vehicle = await prisma.vehicle.update({
            where: { id },
            data: bodyValidation.data,
        });

        return NextResponse.json(
            { message: 'Vehicle updated successfully', vehicle },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating vehicle:', error);
        return NextResponse.json(
            { message: 'Failed to update vehicle' },
            { status: 500 }
        );
    }
}

// DELETE /api/vehicles/[id] - Delete a vehicle
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userId = getUserIdFromRequest(req);
        if (!userId) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id: idString } = await params;

        // Validate ID parameter
        const validation = validateData(idParamSchema, { id: idString });
        if (!validation.success) {
            return validation.error;
        }

        const { id } = validation.data;

        // Verify user owns this vehicle
        const existingVehicle = await prisma.vehicle.findFirst({
            where: { id, userId },
        });

        if (!existingVehicle) {
            return NextResponse.json(
                { message: 'Vehicle not found' },
                { status: 404 }
            );
        }

        await prisma.vehicle.delete({
            where: { id },
        });

        return NextResponse.json(
            { message: 'Vehicle deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        return NextResponse.json(
            { message: 'Failed to delete vehicle' },
            { status: 500 }
        );
    }
}
