import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { idParamSchema } from '@/lib/validations/booking.schema';
import { validateData } from '@/lib/middleware/validation';
import { sendCancellationEmail } from '@/lib/email/resend';
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

// POST /api/bookings/[id]/cancel - Cancel a booking
export async function POST(
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

        // Get the booking with payment info
        const booking = await prisma.booking.findUnique({
            where: { id },
            include: {
                service: true,
                payment: true,
                user: true,
            },
        });

        if (!booking) {
            return NextResponse.json(
                { message: 'Booking not found' },
                { status: 404 }
            );
        }

        // Check if booking can be cancelled (only PENDING or CONFIRMED)
        if (!['PENDING', 'CONFIRMED'].includes(booking.status)) {
            return NextResponse.json(
                { message: 'This booking cannot be cancelled' },
                { status: 400 }
            );
        }

        // Optionally verify user owns this booking
        const userId = getUserIdFromRequest(req);
        if (booking.userId && userId && booking.userId !== userId) {
            return NextResponse.json(
                { message: 'Unauthorized to cancel this booking' },
                { status: 403 }
            );
        }

        // Determine if refund is needed (prepaid and completed payment)
        const wasPrepaid = booking.payment &&
            booking.payment.status === 'COMPLETED' &&
            booking.payment.method !== 'CASH';
        const refundAmount = wasPrepaid ? booking.payment?.amount : undefined;

        // Update booking status to CANCELLED
        await prisma.booking.update({
            where: { id },
            data: { status: 'CANCELLED' },
        });

        // If prepaid, mark payment for refund
        if (booking.payment && wasPrepaid) {
            await prisma.payment.update({
                where: { id: booking.payment.id },
                data: { status: 'REFUND_PENDING' },
            });
        }

        // Send cancellation email
        try {
            await sendCancellationEmail({
                customerName: booking.customerName,
                customerEmail: booking.customerEmail,
                bookingId: booking.id,
                serviceName: booking.service?.name || 'Car Service',
                carBrand: booking.carMake,
                carModel: booking.carModel,
                appointmentDate: booking.appointmentDate.toISOString(),
                wasPrepaid: !!wasPrepaid,
                refundAmount,
            });
            console.log('Cancellation email sent to:', booking.customerEmail);
        } catch (emailError) {
            console.error('Failed to send cancellation email:', emailError);
        }

        return NextResponse.json(
            {
                message: wasPrepaid
                    ? 'Booking cancelled. Refund will be processed within 1-2 weeks.'
                    : 'Booking cancelled successfully',
                refundAmount: wasPrepaid ? refundAmount : null,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error cancelling booking:', error);
        return NextResponse.json(
            { message: 'Failed to cancel booking' },
            { status: 500 }
        );
    }
}
