import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const services = await prisma.service.findMany();
  return NextResponse.json(services);
}

export async function POST(req: Request) {
  // In a real app, verify admin role here
  try {
    const data = await req.json();
    const service = await prisma.service.create({ data });
    return NextResponse.json(service, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
