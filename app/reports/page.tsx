import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ReportsTable from '@/components/ReportsTable';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ReportsPage(
  props: {
    searchParams?: Promise<{ status?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const status = searchParams?.status;

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  const payload = verifyToken(token) as any;
  if (!payload || payload.role !== 'admin') {
    redirect('/login'); // Or a 403 page
  }

  const where: any = {};
  if (status) where.status = status;

  // We need to fetch 'user' for ReportsTable display
  const bookings = await prisma.booking.findMany({
    where,
    include: {
      user: {
        select: { email: true }
      },
      service: {
        select: { name: true }
      }
    },
    orderBy: { date: 'desc' },
  });

  // Flatten logic or conform to ReportsTable interface
  const formattedBookings = bookings.map(b => ({
    id: b.id,
    date: b.date.toISOString(),
    status: b.status,
    user: { email: b.user.email },
    service: { name: b.service.name }
  }));

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Reports</h1>
      <ReportsTable bookings={formattedBookings} />
    </div>
  );
}
