import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { bookingCreateSchema } from '@/lib/validations/booking.schema';
import { validateData } from '@/lib/middleware/validation';

export async function GET() {
    try {
        const bookings = await prisma.booking.findMany({
            include: {
                service: true,
                user: true,
                payment: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({ bookings }, { status: 200 });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return NextResponse.json(
            { message: 'Failed to fetch bookings' },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Validate request body with Zod
        const validation = validateData(bookingCreateSchema, body);
        if (!validation.success) {
            return validation.error;
        }

        const {
            customerName,
            customerEmail,
            customerPhone,
            serviceName,
            carMake,
            carModel,
            fuelType,
            appointmentDate,
            address,
        } = validation.data;

        // Get vehicleId and userId from body (optional)
        const { vehicleId, userId } = body;

        // Determine if this is a guest booking
        const isGuest = !userId;

        // Find or create service
        let service = await prisma.service.findFirst({
            where: { name: serviceName },
        });

        if (!service) {
            service = await prisma.service.create({
                data: {
                    name: serviceName,
                    description: `${serviceName} for your vehicle`,
                    price: serviceName.includes('Preventive')
                        ? 5000
                        : serviceName.includes('Body')
                            ? 7000
                            : 4500,
                },
            });
        }

        // Create booking
        const booking = await prisma.booking.create({
            data: {
                customerName,
                customerEmail,
                customerPhone,
                carMake,
                carModel,
                fuelType,
                appointmentDate: new Date(appointmentDate),
                address,
                serviceId: service.id,
                userId: userId || null,
                vehicleId: vehicleId || null,
                isGuest,
                status: 'PENDING',
            },
            include: {
                service: true,
                vehicle: true,
            },
        });

        return NextResponse.json(
            { message: 'Booking created successfully', booking },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating booking:', error);
        return NextResponse.json(
            { message: 'Failed to create booking' },
            { status: 500 }
        );
    }
}
