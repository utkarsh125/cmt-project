'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, logout } from '@/lib/auth-utils';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
            <Navbar user={user} onLogout={handleLogout} isLoggedIn={true} />

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

            <Footer />
        </div>
    );
}
