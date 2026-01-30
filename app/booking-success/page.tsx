'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, logout } from '@/lib/auth-utils';
import { toast } from 'sonner';

export default function BookingSuccessPage() {
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
                        {user?.role === 'ADMIN' && <a href="/reports" className="hover:underline">Reports</a>}
                        <a href="/booking" className="hover:underline">Booking</a>
                        <button onClick={handleLogout} className="hover:underline">Logout</button>
                        <a href="mailto:contact@automob.co.in" className="hover:underline">contact@automob.co.in ✉</a>
                        <span>| 999-999-9999 📞</span>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto py-16 px-6 flex-grow flex items-center justify-center">
                <div className="text-center">
                    <div className="mb-6">
                        <img
                            src="/thankyou.jpg"
                            alt="Thank You"
                            className="mx-auto w-full max-w-lg rounded-lg"
                        />
                    </div>

                    <h2 className="text-4xl font-bold mb-4 text-black">Thanks for booking our service 👍</h2>
                    <p className="text-black text-lg mb-8">
                        We will get back to you soon with the details via email/phone.
                    </p>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => router.push('/services')}
                            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
                        >
                            Book Another Service
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="bg-gray-600 text-white px-6 py-3 rounded hover:bg-gray-700 transition-colors"
                        >
                            Go to Home
                        </button>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-blue-600 text-white text-center py-4">
                <p>Copyright © 2020 AutoMob-Mechanic. All Rights Reserved.</p>
            </footer>
        </div>
    );
}
