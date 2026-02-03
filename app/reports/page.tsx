'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, isAdmin, logout } from '@/lib/auth-utils';
import { toast } from 'sonner';
import { ChartBar, Clock, CheckCircle, Spinner, XCircle, CurrencyInr, Users } from '@phosphor-icons/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface Booking {
    id: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    carMake: string;
    carModel: string;
    service: {
        name: string;
        price: number;
    };
    appointmentDate: string;
    address: string;
    status: string;
    isGuest: boolean;
    payment?: {
        amount: number;
        method: string;
        status: string;
    };
}

const STATUS_OPTIONS = [
    { value: 'PENDING', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'CONFIRMED', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
    { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-purple-100 text-purple-800' },
    { value: 'COMPLETED', label: 'Completed', color: 'bg-green-100 text-green-800' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
];

export default function ReportsPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        confirmed: 0,
        inProgress: 0,
        completed: 0,
        cancelled: 0,
        revenue: 0,
    });

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
                const bookingList = data.bookings || [];
                setBookings(bookingList);
                calculateStats(bookingList);
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

    const calculateStats = (bookingList: Booking[]) => {
        const stats = {
            total: bookingList.length,
            pending: bookingList.filter(b => b.status === 'PENDING').length,
            confirmed: bookingList.filter(b => b.status === 'CONFIRMED').length,
            inProgress: bookingList.filter(b => b.status === 'IN_PROGRESS').length,
            completed: bookingList.filter(b => b.status === 'COMPLETED').length,
            cancelled: bookingList.filter(b => b.status === 'CANCELLED').length,
            revenue: bookingList
                .filter(b => b.payment?.status === 'COMPLETED')
                .reduce((sum, b) => sum + (b.payment?.amount || 0), 0),
        };
        setStats(stats);
    };

    const updateBookingStatus = async (bookingId: number, newStatus: string) => {
        setUpdatingId(bookingId);
        try {
            const response = await fetch(`/api/bookings/${bookingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                toast.success(`Booking marked as ${newStatus.toLowerCase()}`);
                fetchBookings();
            } else {
                toast.error('Failed to update booking status');
            }
        } catch (error) {
            console.error('Error updating booking:', error);
            toast.error('Failed to update booking');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        router.push('/');
    };

    const getStatusBadge = (status: string) => {
        const option = STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${option.color}`}>
                {option.label}
            </span>
        );
    };

    const filteredBookings = filterStatus === 'all'
        ? bookings
        : bookings.filter(b => b.status === filterStatus);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar user={user} onLogout={handleLogout} isLoggedIn={true} />

            <main className="container mx-auto py-8 px-6 flex-grow">
                <h2 className="text-3xl font-bold mb-6 text-black">Admin Dashboard</h2>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-lg shadow text-center">
                        <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                        <p className="text-sm text-gray-500">Total</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg shadow text-center">
                        <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                        <p className="text-sm text-yellow-600">Pending</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg shadow text-center">
                        <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
                        <p className="text-sm text-blue-600">Confirmed</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg shadow text-center">
                        <p className="text-2xl font-bold text-purple-600">{stats.inProgress}</p>
                        <p className="text-sm text-purple-600">In Progress</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg shadow text-center">
                        <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                        <p className="text-sm text-green-600">Completed</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg shadow text-center">
                        <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
                        <p className="text-sm text-red-600">Cancelled</p>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-lg shadow text-center">
                        <p className="text-2xl font-bold text-emerald-600">₹{stats.revenue.toLocaleString()}</p>
                        <p className="text-sm text-emerald-600">Revenue</p>
                    </div>
                </div>

                {/* Filter */}
                <div className="mb-6">
                    <label className="text-black font-medium mr-3">Filter by Status:</label>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border rounded-lg text-black"
                    >
                        <option value="all">All Bookings</option>
                        {STATUS_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>

                {/* Bookings Table */}
                {loading ? (
                    <div className="text-center py-8 text-black">Loading...</div>
                ) : filteredBookings.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No bookings found</div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-800 text-white">
                                    <th className="px-4 py-3 text-left">ID</th>
                                    <th className="px-4 py-3 text-left">Customer</th>
                                    <th className="px-4 py-3 text-left">Vehicle</th>
                                    <th className="px-4 py-3 text-left">Service</th>
                                    <th className="px-4 py-3 text-left">Date</th>
                                    <th className="px-4 py-3 text-left">Payment</th>
                                    <th className="px-4 py-3 text-left">Status</th>
                                    <th className="px-4 py-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-black">
                                            #{booking.id}
                                            {booking.isGuest && (
                                                <span className="ml-1 text-xs bg-gray-200 px-1 rounded">Guest</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-black font-medium">{booking.customerName}</div>
                                            <div className="text-xs text-gray-500">{booking.customerEmail}</div>
                                            <div className="text-xs text-gray-500">{booking.customerPhone}</div>
                                        </td>
                                        <td className="px-4 py-3 text-black">
                                            {booking.carMake} {booking.carModel}
                                        </td>
                                        <td className="px-4 py-3 text-black">{booking.service?.name}</td>
                                        <td className="px-4 py-3 text-black">
                                            {new Date(booking.appointmentDate).toLocaleDateString('en-IN', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-4 py-3">
                                            {booking.payment ? (
                                                <div>
                                                    <div className="text-green-600 font-medium">
                                                        ₹{booking.payment.amount.toLocaleString()}
                                                    </div>
                                                    <div className="text-xs text-gray-500">{booking.payment.method}</div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">Unpaid</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">{getStatusBadge(booking.status)}</td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={booking.status}
                                                onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                                                disabled={updatingId === booking.id}
                                                className="px-2 py-1 text-sm border rounded text-black disabled:bg-gray-100"
                                            >
                                                {STATUS_OPTIONS.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
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
