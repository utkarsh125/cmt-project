import { NextResponse } from 'next/server';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { rating } = body;

        // TODO: Implement rating logic with Prisma
        // For now, return success
        return NextResponse.json(
            { message: 'Rating submitted successfully', bookingId: id, rating },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error submitting rating:', error);
        return NextResponse.json(
            { message: 'Failed to submit rating' },
            { status: 500 }
        );
    }
}
