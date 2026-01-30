import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const bookings = await prisma.booking.findMany({
            include: {
                service: true,
                user: true,
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
        } = body;

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
                userId: 1, // TODO: Get from session/auth
                status: 'PENDING',
            },
            include: {
                service: true,
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
