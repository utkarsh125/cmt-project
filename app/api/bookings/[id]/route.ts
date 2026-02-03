import { NextResponse } from 'next/server';
import { idParamSchema } from '@/lib/validations/booking.schema';
import { validateData } from '@/lib/middleware/validation';
import { prisma } from '@/lib/prisma';
import { sendServiceCompletionEmail } from '@/lib/email/resend';

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

        const booking = await prisma.booking.findUnique({
            where: { id },
            include: {
                service: true,
                vehicle: true,
                payment: true,
            },
        });

        if (!booking) {
            return NextResponse.json(
                { message: 'Booking not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { booking },
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

        // Check if booking exists
        const existingBooking = await prisma.booking.findUnique({
            where: { id },
            include: {
                service: true,
            },
        });

        if (!existingBooking) {
            return NextResponse.json(
                { message: 'Booking not found' },
                { status: 404 }
            );
        }

        // Prevent status changes on cancelled bookings
        if (existingBooking.status === 'CANCELLED') {
            return NextResponse.json(
                { message: 'Cannot modify a cancelled booking' },
                { status: 400 }
            );
        }

        // Check if we're marking as completed
        const isMarkingComplete = body.status === 'COMPLETED' && existingBooking.status !== 'COMPLETED';

        // Update booking with provided data
        const updatedBooking = await prisma.booking.update({
            where: { id },
            data: {
                ...(body.status && { status: body.status }),
                ...(body.rating && { rating: body.rating }),
            },
            include: {
                service: true,
            },
        });

        // Send completion email if marking as completed
        if (isMarkingComplete) {
            try {
                await sendServiceCompletionEmail({
                    customerName: existingBooking.customerName,
                    customerEmail: existingBooking.customerEmail,
                    bookingId: existingBooking.id,
                    serviceName: existingBooking.service?.name || 'Car Service',
                    carBrand: existingBooking.carMake,
                    carModel: existingBooking.carModel,
                    completedDate: new Date().toISOString(),
                    rewardPoints: existingBooking.rewardPoints,
                });
                console.log('Completion email sent to:', existingBooking.customerEmail);
            } catch (emailError) {
                console.error('Failed to send completion email:', emailError);
            }
        }

        return NextResponse.json(
            {
                message: isMarkingComplete
                    ? 'Service marked as completed. Customer notified via email.'
                    : 'Booking updated successfully',
                booking: updatedBooking
            },
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
