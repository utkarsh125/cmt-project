import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { paymentCreateSchema } from '@/lib/validations/payment.schema';
import { validateData } from '@/lib/middleware/validation';
import { sendBookingInvoice } from '@/lib/email/resend';

// POST /api/payments - Create a payment
export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Validate request body
        const validation = validateData(paymentCreateSchema, body);
        if (!validation.success) {
            return validation.error;
        }

        const { bookingId, amount, method } = validation.data;

        // Check if payment already exists for this booking
        const existingPayment = await prisma.payment.findUnique({
            where: { bookingId },
        });

        if (existingPayment) {
            return NextResponse.json(
                { message: 'Payment already exists for this booking' },
                { status: 400 }
            );
        }

        // Generate transaction ID (empty for cash payments)
        const transactionId = method === 'CASH'
            ? null
            : `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`.toUpperCase();

        // Cash on service = PENDING, others = COMPLETED
        const paymentStatus = method === 'CASH' ? 'PENDING' : 'COMPLETED';

        // Create payment
        const payment = await prisma.payment.create({
            data: {
                bookingId,
                amount,
                method,
                transactionId,
                status: paymentStatus,
            },
        });

        // Update booking status to CONFIRMED
        await prisma.booking.update({
            where: { id: bookingId },
            data: { status: 'CONFIRMED' },
        });

        // Get booking with service details for email
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                user: true,
                service: true,
            },
        });

        let rewardPoints = 0;

        // Only give reward points for prepaid (non-cash) payments
        if (booking && booking.userId && !booking.isGuest && method !== 'CASH') {
            rewardPoints = 100; // Fixed reward per booking

            // Update booking with reward points
            await prisma.booking.update({
                where: { id: bookingId },
                data: { rewardPoints },
            });

            // Update user's total reward points
            await prisma.user.update({
                where: { id: booking.userId },
                data: {
                    rewardPoints: {
                        increment: rewardPoints,
                    },
                },
            });
        }

        // Send email invoice (only if prepaid)
        if (booking && method !== 'CASH' && transactionId) {
            try {
                await sendBookingInvoice({
                    customerName: booking.customerName,
                    customerEmail: booking.customerEmail,
                    bookingId: booking.id,
                    serviceName: booking.service?.name || 'Car Service',
                    carBrand: booking.carMake,
                    carModel: booking.carModel,
                    fuelType: booking.fuelType,
                    appointmentDate: booking.appointmentDate.toISOString(),
                    address: booking.address,
                    amount,
                    transactionId,
                    rewardPoints,
                });
                console.log('Invoice email sent to:', booking.customerEmail);
            } catch (emailError) {
                console.error('Failed to send invoice email:', emailError);
            }
        }

        return NextResponse.json(
            {
                message: method === 'CASH'
                    ? 'Booking confirmed! Pay when technician arrives.'
                    : 'Payment successful',
                payment,
                rewardPoints,
                paymentStatus,
                emailSent: method !== 'CASH',
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error processing payment:', error);
        return NextResponse.json(
            { message: 'Payment failed' },
            { status: 500 }
        );
    }
}
