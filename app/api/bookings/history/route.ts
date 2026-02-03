import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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

// GET /api/bookings/history - Get booking history for logged-in user
export async function GET(req: Request) {
    try {
        const userId = getUserIdFromRequest(req);

        if (!userId) {
            return NextResponse.json(
                {
                    message: 'Please login to view booking history',
                    bookings: [],
                    totalRewards: 0,
                    stats: { total: 0, pending: 0, completed: 0 },
                },
                { status: 200 }
            );
        }

        const bookings = await prisma.booking.findMany({
            where: { userId },
            include: {
                service: true,
                vehicle: true,
                payment: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Calculate total reward points
        const totalRewards = bookings.reduce((sum, booking) => sum + booking.rewardPoints, 0);

        return NextResponse.json(
            {
                bookings,
                totalRewards,
                stats: {
                    total: bookings.length,
                    pending: bookings.filter(b => b.status === 'PENDING' || b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS').length,
                    completed: bookings.filter(b => b.status === 'COMPLETED').length,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching booking history:', error);
        return NextResponse.json(
            { message: 'Failed to fetch booking history' },
            { status: 500 }
        );
    }
}
