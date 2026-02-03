'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, getAuthToken, logout } from '@/lib/auth-utils';
import { toast } from 'sonner';
import { CalendarCheck, Star, CurrencyInr, Clock, CheckCircle, XCircle, Spinner, Car, Trash } from '@phosphor-icons/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface Booking {
    id: number;
    customerName: string;
    carMake: string;
    carModel: string;
    appointmentDate: string;
    status: string;
    rewardPoints: number;
    service: { name: string; price: number };
    payment?: { status: string; amount: number; method: string };
    vehicle?: { make: string; model: string };
}

export default function BookingHistoryPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [totalRewards, setTotalRewards] = useState(0);
    const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
    const [filter, setFilter] = useState<string>('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userData = getUser();
        if (!userData) {
            router.push('/login');
            return;
        }
        setUser(userData);
        fetchBookingHistory();
    }, [router]);

    const fetchBookingHistory = async () => {
        try {
            const token = getAuthToken();
            const response = await fetch('/api/bookings/history', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();

            if (response.ok) {
                setBookings(data.bookings || []);
                setTotalRewards(data.totalRewards || 0);
                setStats(data.stats || { total: 0, pending: 0, completed: 0 });
            } else {
                toast.error('Failed to load booking history');
            }
        } catch (error) {
            console.error('Error fetching history:', error);
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        router.push('/');
    };

    const [cancellingId, setCancellingId] = useState<number | null>(null);

    const handleCancelBooking = async (bookingId: number) => {
        if (!confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        setCancellingId(bookingId);
        try {
            const token = getAuthToken();
            const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                fetchBookingHistory(); // Refresh the list
            } else {
                toast.error(data.message || 'Failed to cancel booking');
            }
        } catch (error) {
            console.error('Error cancelling booking:', error);
            toast.error('Something went wrong');
        } finally {
            setCancellingId(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'CONFIRMED':
                return 'bg-blue-100 text-blue-800';
            case 'IN_PROGRESS':
                return 'bg-purple-100 text-purple-800';
            case 'COMPLETED':
                return 'bg-green-100 text-green-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <Clock size={14} />;
            case 'CONFIRMED':
                return <CalendarCheck size={14} />;
            case 'IN_PROGRESS':
                return <Spinner size={14} />;
            case 'COMPLETED':
                return <CheckCircle size={14} />;
            case 'CANCELLED':
                return <XCircle size={14} />;
            default:
                return null;
        }
    };

    const filteredBookings = bookings.filter((booking) => {
        if (filter === 'all') return true;
        return booking.status.toLowerCase() === filter.toLowerCase();
    });

    if (!user) return null;

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar user={user} onLogout={handleLogout} isLoggedIn={true} />

            <main className="container mx-auto py-16 px-6 flex-grow">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <CalendarCheck size={32} weight="duotone" className="text-blue-600" />
                            <h2 className="text-3xl font-bold text-black">Booking History</h2>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Total Reward Points</p>
                            <p className="text-2xl font-bold text-green-600 flex items-center justify-end gap-1">
                                <Star size={24} weight="fill" className="text-yellow-500" />
                                {totalRewards}
                            </p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600">Total Bookings</p>
                            <p className="text-2xl font-bold text-black">{stats.total}</p>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600">Pending</p>
                            <p className="text-2xl font-bold text-black">{stats.pending}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600">Completed</p>
                            <p className="text-2xl font-bold text-black">{stats.completed}</p>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 mb-6 border-b flex-wrap">
                        {['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 font-medium capitalize transition-colors ${filter === status
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {status.replace('_', ' ')}
                            </button>
                        ))}
                    </div>

                    {/* Bookings List */}
                    {loading ? (
                        <p className="text-center text-gray-600">Loading history...</p>
                    ) : filteredBookings.length === 0 ? (
                        <div className="text-center py-12">
                            <CalendarCheck size={64} weight="duotone" className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-600 mb-4">No bookings found.</p>
                            <a
                                href="/booking"
                                className="text-blue-600 hover:underline font-medium"
                            >
                                Book your first service
                            </a>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredBookings.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="border border-gray-300 rounded-lg p-6 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-start gap-3">
                                            <Car size={24} weight="duotone" className="text-blue-600 mt-1" />
                                            <div>
                                                <h3 className="text-xl font-semibold text-black">
                                                    {booking.service.name}
                                                </h3>
                                                <p className="text-gray-600">
                                                    {booking.carMake} {booking.carModel}
                                                </p>
                                            </div>
                                        </div>
                                        <span
                                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                                booking.status
                                            )}`}
                                        >
                                            {getStatusIcon(booking.status)}
                                            {booking.status.replace('_', ' ')}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-500">Date</p>
                                            <p className="font-medium text-black">
                                                {new Date(booking.appointmentDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Amount</p>
                                            <p className="font-medium text-black flex items-center gap-1">
                                                <CurrencyInr size={14} />
                                                {booking.service.price.toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Payment</p>
                                            <p className="font-medium text-black">
                                                {booking.payment?.status || 'Pending'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Points Earned</p>
                                            <p className="font-medium text-green-600 flex items-center gap-1">
                                                +{booking.rewardPoints}
                                                <Star size={14} weight="fill" className="text-yellow-500" />
                                            </p>
                                        </div>
                                    </div>

                                    {/* Cancel Button for pending/confirmed bookings */}
                                    {['PENDING', 'CONFIRMED'].includes(booking.status) && (
                                        <div className="mt-4 pt-4 border-t flex justify-end">
                                            <button
                                                onClick={() => handleCancelBooking(booking.id)}
                                                disabled={cancellingId === booking.id}
                                                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                                            >
                                                <Trash size={16} />
                                                {cancellingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
