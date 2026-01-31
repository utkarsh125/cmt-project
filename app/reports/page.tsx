'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, isAdmin, logout } from '@/lib/auth-utils';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface Booking {
    id: number;
    customerName: string;
    service: {
        name: string;
    };
    appointmentDate: string;
    status: string;
}

export default function ReportsPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userData = getUser();
        if (!userData) {
            router.push('/login');
            return;
        }

        if (!isAdmin()) {
            toast.error('Access denied. Admin only.');
            router.push('/services');
            return;
        }

        setUser(userData);
        fetchBookings();
    }, [router]);

    const fetchBookings = async () => {
        try {
            const response = await fetch('/api/bookings');
            const data = await response.json();

            if (response.ok) {
                setBookings(data.bookings || []);
            } else {
                toast.error('Failed to load bookings');
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        router.push('/');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar user={user} onLogout={handleLogout} isLoggedIn={true} />

            {/* Main Content */}
            <main className="container mx-auto py-16 px-6 flex-grow">
                <h2 className="text-3xl font-bold mb-8 text-black">Service Booking Reports</h2>

                {loading ? (
                    <div className="text-center py-8 text-black">Loading...</div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-8 text-black">No bookings found</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-blue-400 text-white">
                                    <th className="border border-blue-600 px-4 py-3 text-left">C.Id</th>
                                    <th className="border border-blue-600 px-4 py-3 text-left">Customer Name</th>
                                    <th className="border border-blue-600 px-4 py-3 text-left">Service Name</th>
                                    <th className="border border-blue-600 px-4 py-3 text-left">Service Date</th>
                                    <th className="border border-blue-600 px-4 py-3 text-left">Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((booking, index) => (
                                    <tr key={booking.id} className={index % 2 === 0 ? 'bg-blue-100' : 'bg-blue-200'}>
                                        <td className="border border-blue-300 px-4 py-3 text-black">C{String(booking.id).padStart(3, '0')}</td>
                                        <td className="border border-blue-300 px-4 py-3 text-black">{booking.customerName}</td>
                                        <td className="border border-blue-300 px-4 py-3 text-black">{booking.service.name}</td>
                                        <td className="border border-blue-300 px-4 py-3 text-black">
                                            {new Date(booking.appointmentDate).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="border border-blue-300 px-4 py-3 text-black">
                                            {booking.service.name.includes('Preventive') ? '5000' :
                                                booking.service.name.includes('Body') ? '7000' : '4500'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
