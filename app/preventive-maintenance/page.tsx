'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, logout } from '@/lib/auth-utils';
import { toast } from 'sonner';

export default function PreventiveMaintenancePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const userData = getUser();
        if (!userData) {
            router.push('/login');
            return;
        }
        setUser(userData);
    }, [router]);

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        router.push('/');
    };

    const handleBookService = () => {
        router.push('/booking?service=preventive-maintenance');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <header className="bg-blue-600 text-white py-4 px-6">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">AutoMob-Mechanic</h1>
                    <nav className="flex gap-6 items-center">
                        <span>Hi {user.name}</span>
                        <a href="/" className="hover:underline">Home</a>
                        <a href="/services" className="hover:underline">Services</a>
                        {user.role === 'ADMIN' && <a href="/reports" className="hover:underline">Reports</a>}
                        <a href="/booking" className="hover:underline">Booking</a>
                        <button onClick={handleLogout} className="hover:underline">Logout</button>
                        <a href="mailto:contact@automob.co.in" className="hover:underline">contact@automob.co.in ✉</a>
                        <span>| 999-999-9999 📞</span>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto py-16 px-6 flex-grow">
                <h2 className="text-3xl font-bold mb-6 text-black">Preventive Maintenance Service</h2>

                <div className="mb-6">
                    <img
                        src="/service-1.jpg"
                        alt="Preventive Maintenance Service"
                        className="w-full max-w-md rounded-lg"
                    />
                </div>

                <p className="text-black mb-6">
                    Looking to keep your car functioning smoothly? Save money and opt for AutoMob-Mechanic's periodic maintenance service. This service aims at:
                </p>

                <ul className="list-disc list-inside mb-8 text-black space-y-2">
                    <li>Air filter replacement.</li>
                    <li>Engine oil replacement.</li>
                    <li>Break pad cleaning.</li>
                </ul>

                <div className="flex gap-4">
                    <button
                        onClick={handleBookService}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                        Book Service
                    </button>
                    <button
                        onClick={() => router.back()}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                        ← Go Back
                    </button>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-blue-600 text-white text-center py-4">
                <p>Copyright © 2020 AutoMob-Mechanic. All Rights Reserved.</p>
            </footer>
        </div>
    );
}
