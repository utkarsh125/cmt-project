import { NextResponse } from 'next/server';
import { idParamSchema, bookingUpdateSchema } from '@/lib/validations/booking.schema';
import { validateData } from '@/lib/middleware/validation';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idString } = await params;

        // Validate ID parameter
        const validation = validateData(idParamSchema, { id: idString });
        if (!validation.success) {
            return validation.error;
        }

        const { id } = validation.data;

        // TODO: Implement get booking by ID logic
        return NextResponse.json(
            { message: 'Get booking endpoint', bookingId: id },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching booking:', error);
        return NextResponse.json(
            { message: 'Failed to fetch booking' },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idString } = await params;

        // Validate ID parameter
        const idValidation = validateData(idParamSchema, { id: idString });
        if (!idValidation.success) {
            return idValidation.error;
        }

        const { id } = idValidation.data;

        const body = await req.json();

        // Validate request body
        const bodyValidation = validateData(bookingUpdateSchema, body);
        if (!bodyValidation.success) {
            return bodyValidation.error;
        }

        // TODO: Implement update booking logic
        return NextResponse.json(
            { message: 'Update booking endpoint', bookingId: id, data: bodyValidation.data },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating booking:', error);
        return NextResponse.json(
            { message: 'Failed to update booking' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idString } = await params;

        // Validate ID parameter
        const validation = validateData(idParamSchema, { id: idString });
        if (!validation.success) {
            return validation.error;
        }

        const { id } = validation.data;

        // TODO: Implement delete booking logic
        return NextResponse.json(
            { message: 'Delete booking endpoint', bookingId: id },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting booking:', error);
        return NextResponse.json(
            { message: 'Failed to delete booking' },
            { status: 500 }
        );
    }
}
