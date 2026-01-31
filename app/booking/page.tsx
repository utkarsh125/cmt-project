'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getUser, logout } from '@/lib/auth-utils';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function BookingForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [user, setUser] = useState<any>(null);

    // Form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneCode, setPhoneCode] = useState('code');
    const [phone, setPhone] = useState('');
    const [service, setService] = useState('');
    const [carMake, setCarMake] = useState('');
    const [carModel, setCarModel] = useState('');
    const [fuelType, setFuelType] = useState('Petrol');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        const userData = getUser();
        if (!userData) {
            router.push('/login');
            return;
        }
        setUser(userData);
        // Don't pre-fill name, let user type it

        // Pre-select service based on URL parameter
        const serviceParam = searchParams.get('service');
        if (serviceParam) {
            if (serviceParam === 'preventive-maintenance') {
                setService('Preventive Maintenance Service');
            } else if (serviceParam === 'body-repair') {
                setService('Body Repair Service');
            } else if (serviceParam === 'car-care') {
                setService('Car Care Service');
            }
        }
    }, [router, searchParams]);

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        router.push('/');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all fields
        if (!name || !email || !phone || !service || !carMake || !carModel || !appointmentDate || !address) {
            toast.error('Please fill in all fields');
            return;
        }

        // Validate appointment date (no past dates)
        const selectedDate = new Date(appointmentDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            toast.error('Please select a future date for your appointment');
            return;
        }

        // Submit booking
        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerName: name,
                    customerEmail: email,
                    customerPhone: `${phoneCode !== 'code' ? phoneCode : ''}${phone}`,
                    serviceName: service,
                    carMake,
                    carModel,
                    fuelType,
                    appointmentDate,
                    address,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Booking submitted successfully!');
                router.push('/booking-success');
            } else {
                toast.error(data.message || 'Failed to submit booking');
            }
        } catch (error) {
            console.error('Booking error:', error);
            toast.error('Something went wrong. Please try again.');
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar user={user} onLogout={handleLogout} isLoggedIn={true} />

            {/* Main Content */}
            <main className="container mx-auto py-16 px-6 flex-grow">
                <h2 className="text-3xl font-bold mb-8 text-center text-black">Book Your Service</h2>

                <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
                    <div>
                        <label htmlFor="name" className="block font-medium mb-2 text-black">Name:</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 text-black"
                            placeholder="John Daub"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block font-medium mb-2 text-black">Email Id:</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 text-black"
                            placeholder="john@yahoo.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block font-medium mb-2 text-black">Phone Number:</label>
                        <div className="flex gap-2">
                            <select
                                value={phoneCode}
                                onChange={(e) => setPhoneCode(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="code">code</option>
                                <option value="+1">+1</option>
                                <option value="+91">+91</option>
                                <option value="+44">+44</option>
                            </select>
                            <input
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 text-black"
                                placeholder="9823322332"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="service" className="block font-medium mb-2 text-black">Select Service:</label>
                        <select
                            id="service"
                            value={service}
                            onChange={(e) => setService(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">--Select--</option>
                            <option value="Preventive Maintenance Service">Preventive Maintenance Service</option>
                            <option value="Body Repair Service">Body Repair Service</option>
                            <option value="Car Care Service">Car Care Service</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="carMake" className="block font-medium mb-2 text-black">Car Make:</label>
                        <input
                            id="carMake"
                            type="text"
                            value={carMake}
                            onChange={(e) => setCarMake(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 text-black"
                            placeholder="Suzuki, Toyota..."
                        />
                    </div>

                    <div>
                        <label htmlFor="carModel" className="block font-medium mb-2 text-black">Car Model:</label>
                        <input
                            id="carModel"
                            type="text"
                            value={carModel}
                            onChange={(e) => setCarModel(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 text-black"
                            placeholder="Alto, Innova..."
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-2 text-black">Fuel Type:</label>
                        <div className="flex gap-4">
                            <label className="flex items-center text-black">
                                <input
                                    type="radio"
                                    name="fuelType"
                                    value="Petrol"
                                    checked={fuelType === 'Petrol'}
                                    onChange={(e) => setFuelType(e.target.value)}
                                    className="mr-2"
                                />
                                Petrol
                            </label>
                            <label className="flex items-center text-black">
                                <input
                                    type="radio"
                                    name="fuelType"
                                    value="Diesel"
                                    checked={fuelType === 'Diesel'}
                                    onChange={(e) => setFuelType(e.target.value)}
                                    className="mr-2"
                                />
                                Diesel
                            </label>
                            <label className="flex items-center text-black">
                                <input
                                    type="radio"
                                    name="fuelType"
                                    value="LPG"
                                    checked={fuelType === 'LPG'}
                                    onChange={(e) => setFuelType(e.target.value)}
                                    className="mr-2"
                                />
                                LPG
                            </label>
                            <label className="flex items-center text-black">
                                <input
                                    type="radio"
                                    name="fuelType"
                                    value="Others"
                                    checked={fuelType === 'Others'}
                                    onChange={(e) => setFuelType(e.target.value)}
                                    className="mr-2"
                                />
                                Others
                            </label>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="appointmentDate" className="block font-medium mb-2 text-black">Appointment Date:</label>
                        <input
                            id="appointmentDate"
                            type="date"
                            value={appointmentDate}
                            onChange={(e) => setAppointmentDate(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="address" className="block font-medium mb-2 text-black">Address:</label>
                        <textarea
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 text-black"
                            placeholder="Enter your address..."
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                        Book
                    </button>
                </form>
            </main>

            <Footer />
        </div>
    );
}

export default function BookingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <BookingForm />
        </Suspense>
    );
}
