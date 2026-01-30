import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  // Admin only - filter Logic
  const token = getTokenFromRequest(req);
  const user = token ? (verifyToken(token) as any) : null;

  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  const where: any = {};
  if (status) where.status = status;

  const bookings = await prisma.booking.findMany({
    where,
    include: { user: true, service: true },
    orderBy: { date: 'desc' },
  });

  return NextResponse.json(bookings);
}

export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req);
  const user = token ? (verifyToken(token) as any) : null;

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { serviceSlug, date } = await req.json();
    const bookingDate = new Date(date);

    if (bookingDate < new Date()) {
      return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
    }

    const service = await prisma.service.findUnique({ where: { slug: serviceSlug } });
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        serviceId: service.id,
        date: bookingDate,
        status: 'pending',
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Booking failed' }, { status: 500 });
  }
}
