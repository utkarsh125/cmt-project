'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getUser } from '@/lib/auth-utils';
import { CreditCard, DeviceMobile, Bank, Money, Star, Lock, Info, CheckCircle } from '@phosphor-icons/react';

interface Booking {
    id: number;
    customerName: string;
    carMake: string;
    carModel: string;
    appointmentDate: string;
    status: string;
    isGuest: boolean;
    service: { name: string; price: number };
    payment?: { status: string; amount: number; method: string };
}

export default function PaymentPage({ params }: { params: Promise<{ bookingId: string }> }) {
    const resolvedParams = use(params);
    const bookingId = resolvedParams.bookingId;

    const router = useRouter();
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('CARD');
    const [processing, setProcessing] = useState(false);
    const [isGuest, setIsGuest] = useState(false);

    // Card details (fake)
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');

    // UPI ID (fake)
    const [upiId, setUpiId] = useState('');

    // Bank selection (fake)
    const [bank, setBank] = useState('');

    useEffect(() => {
        const user = getUser();
        setIsGuest(!user);
        fetchBookingDetails();
    }, [bookingId]);

    const fetchBookingDetails = async () => {
        try {
            const response = await fetch(`/api/bookings/${bookingId}`);
            const data = await response.json();

            if (response.ok && data.booking) {
                setBooking(data.booking);
            } else {
                // Fallback mock data if booking not found
                setBooking({
                    id: parseInt(bookingId),
                    customerName: 'Customer',
                    carMake: 'Vehicle',
                    carModel: 'Model',
                    appointmentDate: new Date().toISOString(),
                    status: 'PENDING',
                    isGuest: !getUser(),
                    service: { name: 'Car Service', price: 5000 },
                });
            }
        } catch (error) {
            console.error('Error fetching booking:', error);
            // Fallback mock data on error
            setBooking({
                id: parseInt(bookingId),
                customerName: 'Customer',
                carMake: 'Vehicle',
                carModel: 'Model',
                appointmentDate: new Date().toISOString(),
                status: 'PENDING',
                isGuest: !getUser(),
                service: { name: 'Car Service', price: 5000 },
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        // Simulate payment processing delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        try {
            const response = await fetch('/api/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingId: parseInt(bookingId),
                    amount: booking?.service.price || 5000,
                    method: paymentMethod,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                if (paymentMethod === 'CASH') {
                    toast.success('Booking confirmed! Pay when technician arrives.');
                } else {
                    toast.success('Payment successful!');
                    if (data.rewardPoints > 0) {
                        toast.success(`You earned ${data.rewardPoints} reward points!`);
                    }
                }
                setTimeout(() => {
                    router.push('/booking-success');
                }, 1500);
            } else {
                toast.error(data.message || 'Payment failed');
                setProcessing(false);
            }
        } catch (error) {
            console.error('Payment error:', error);
            toast.error('Something went wrong');
            setProcessing(false);
        }
    };

    const paymentMethods = [
        { value: 'CARD', label: 'Credit/Debit Card', icon: <CreditCard size={20} /> },
        { value: 'UPI', label: 'UPI', icon: <DeviceMobile size={20} /> },
        { value: 'NET_BANKING', label: 'Net Banking', icon: <Bank size={20} /> },
        { value: 'CASH', label: 'Cash on Service', icon: <Money size={20} /> },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <p className="text-gray-600">Loading payment details...</p>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <p className="text-red-600">Booking not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-black mb-8">Complete Payment</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Booking Summary */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-black mb-4">Booking Summary</h2>
                        <div className="space-y-3 text-gray-700">
                            <div>
                                <p className="text-sm text-gray-500">Service</p>
                                <p className="font-medium">{booking.service.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Vehicle</p>
                                <p className="font-medium">{booking.carMake} {booking.carModel}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Date</p>
                                <p className="font-medium">
                                    {new Date(booking.appointmentDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="pt-4 border-t">
                                <p className="text-sm text-gray-500">Total Amount</p>
                                <p className="text-2xl font-bold text-green-600">
                                    ₹{booking.service.price.toLocaleString()}
                                </p>
                            </div>
                            {!isGuest && (
                                <div className="bg-green-50 p-3 rounded text-sm text-green-800 flex items-center gap-2">
                                    <Star size={18} weight="fill" className="text-yellow-500" />
                                    Earn 100 reward points with prepaid booking!
                                </div>
                            )}
                            {isGuest && (
                                <div className="bg-blue-50 p-3 rounded text-sm text-blue-800 flex items-center gap-2">
                                    <Info size={18} />
                                    <span><a href="/login" className="underline">Sign in</a> to earn reward points!</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-black mb-4">Payment Method</h2>

                        <form onSubmit={handlePayment} className="space-y-6">
                            <div>
                                <label className="block font-medium mb-3 text-black">Select Method:</label>
                                <div className="space-y-2">
                                    {paymentMethods.map((method) => (
                                        <label
                                            key={method.value}
                                            className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50"
                                        >
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value={method.value}
                                                checked={paymentMethod === method.value}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="mr-3"
                                            />
                                            <span className="text-black flex items-center gap-2">
                                                {method.icon}
                                                {method.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {paymentMethod === 'CARD' && (
                                <div className="space-y-4 border-t pt-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-black">Card Number</label>
                                        <input
                                            type="text"
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(e.target.value)}
                                            placeholder="1234 5678 9012 3456"
                                            className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 text-black"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-black">Card Holder Name</label>
                                        <input
                                            type="text"
                                            value={cardName}
                                            onChange={(e) => setCardName(e.target.value)}
                                            placeholder="John Doe"
                                            className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 text-black"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-black">Expiry</label>
                                            <input
                                                type="text"
                                                value={expiryDate}
                                                onChange={(e) => setExpiryDate(e.target.value)}
                                                placeholder="MM/YY"
                                                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 text-black"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-black">CVV</label>
                                            <input
                                                type="text"
                                                value={cvv}
                                                onChange={(e) => setCvv(e.target.value)}
                                                placeholder="123"
                                                maxLength={3}
                                                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 text-black"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {paymentMethod === 'UPI' && (
                                <div className="border-t pt-4">
                                    <label className="block text-sm font-medium mb-1 text-black">UPI ID</label>
                                    <input
                                        type="text"
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                        placeholder="username@upi"
                                        className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 text-black"
                                        required
                                    />
                                </div>
                            )}

                            {paymentMethod === 'NET_BANKING' && (
                                <div className="border-t pt-4">
                                    <label className="block text-sm font-medium mb-1 text-black">Select Bank</label>
                                    <select
                                        value={bank}
                                        onChange={(e) => setBank(e.target.value)}
                                        className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 text-black"
                                        required
                                    >
                                        <option value="">--Select Bank--</option>
                                        <option value="SBI">State Bank of India</option>
                                        <option value="HDFC">HDFC Bank</option>
                                        <option value="ICICI">ICICI Bank</option>
                                        <option value="AXIS">Axis Bank</option>
                                    </select>
                                </div>
                            )}

                            {paymentMethod === 'CASH' && (
                                <div className="border-t pt-4 bg-yellow-50 p-4 rounded flex items-start gap-3">
                                    <Info size={20} className="text-yellow-700 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-yellow-800">
                                            You can pay in cash when our technician arrives for the service.
                                        </p>
                                        <p className="text-xs text-yellow-600 mt-1">
                                            Note: No reward points for cash payments.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 font-semibold flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    'Processing...'
                                ) : paymentMethod === 'CASH' ? (
                                    <>
                                        <CheckCircle size={20} />
                                        Confirm Booking
                                    </>
                                ) : (
                                    `Pay ₹${booking.service.price.toLocaleString()}`
                                )}
                            </button>

                            <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
                                <Lock size={12} />
                                This is a demo payment. No real transaction will occur.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
