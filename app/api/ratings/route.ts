import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req);
  const user = token ? (verifyToken(token) as any) : null;

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { bookingId, score, comment } = await req.json();

    const rating = await prisma.rating.create({
      data: {
        bookingId,
        score,
        comment,
      },
    });

    return NextResponse.json(rating, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Rating failed' }, { status: 500 });
  }
}
