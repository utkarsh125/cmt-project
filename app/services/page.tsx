'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, logout } from '@/lib/auth-utils';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ServicesPage() {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const userData = getUser();
        if (!userData) {
            router.push('/login');
            return;
        }
        setUser(userData);
    }, [router]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    return 10 * 60; // Reset to 10 minutes
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m:${secs.toString().padStart(2, '0')}s`;
    };

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        router.push('/');
    };

    const services = [
        {
            id: 1,
            name: 'Preventive Maintenance Service',
            description: 'Periodically check and keep your car running.',
            offer: '20%',
            image: '/service-1.jpg',
            detailPage: '/preventive-maintenance'
        },
        {
            id: 2,
            name: 'Body Repair Service',
            description: 'Full chasis body repair provided by the experts.',
            offer: '10%',
            image: '/service-2.jpg',
            detailPage: '/body-repair'
        },
        {
            id: 3,
            name: 'Car Care Service',
            description: 'Get your car sparking clean in just minutes.',
            offer: '15%',
            image: '/service-3.jpg',
            detailPage: '/car-care'
        },
    ];

    if (!user) return null;

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar user={user} onLogout={handleLogout} isLoggedIn={true} />

            {/* Main Content */}
            <main className="container mx-auto py-16 px-6 flex-grow">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2 text-black">Car Repair and Service</h2>
                    <p className="text-black mb-2">
                        Our representatives are professionally trained and skilled with latest and futuristic techniques to provide a best quality service.
                    </p>
                    <p className="text-black">
                        At AutoMob-Mechanic, we provide a high class service to the customers for their happy and memorable driving experience.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                    {services.map((service) => (
                        <div key={service.id} className="border border-gray-300 rounded-lg p-6 text-center">
                            <h3 className="text-xl font-bold mb-4 text-black">{service.name}</h3>
                            <div className="bg-gray-200 rounded-lg mb-4 h-48 overflow-hidden">
                                <img
                                    src={service.image}
                                    alt={service.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="text-black mb-2">{service.description}</p>
                            <p className="text-black font-medium mb-4">Offer: {service.offer}</p>
                            <button
                                onClick={() => router.push(service.detailPage)}
                                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                            >
                                More Details
                            </button>
                        </div>
                    ))}
                </div>

                {/* Countdown Timer */}
                <div className="text-red-600 font-bold text-lg">
                    **Offer ends in: {formatTime(timeLeft)}
                </div>
            </main>

            <Footer />
        </div>
    );
}
