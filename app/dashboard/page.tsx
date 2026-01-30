import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  const payload = verifyToken(token) as any;
  if (!payload) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    include: {
      bookings: {
        include: { service: true },
        orderBy: { date: 'desc' },
      },
    },
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>

      <h2 className="text-2xl font-bold mb-6">My Bookings</h2>
      {user.bookings.length === 0 ? (
        <p className="text-gray-600">You have no bookings yet.</p>
      ) : (
        <div className="grid gap-6">
          {user.bookings.map((booking) => (
            <div key={booking.id} className="border p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center bg-white shadow-sm">
              <div>
                <h3 className="font-bold text-lg">{booking.service.name}</h3>
                <p className="text-gray-600">
                  {new Date(booking.date).toLocaleDateString()} at{' '}
                  {new Date(booking.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-bold ${
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                  'bg-gray-100 text-gray-700'
                }`}>
                  {booking.status.toUpperCase()}
                </span>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="text-blue-600 font-bold">${Number(booking.service.price).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
