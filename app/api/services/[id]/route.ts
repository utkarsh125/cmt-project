import { NextResponse } from 'next/server';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // TODO: Implement get service by ID logic
        return NextResponse.json(
            { message: 'Get service endpoint', serviceId: id },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching service:', error);
        return NextResponse.json(
            { message: 'Failed to fetch service' },
            { status: 500 }
        );
    }
}
