'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { setAuthToken, setUser } from '@/lib/auth-utils';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Please enter both email and password');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || 'Login successful!');

                // Store token and user data
                setAuthToken(data.token);
                setUser(data.user);

                // Redirect based on role
                setTimeout(() => {
                    if (data.user.role === 'ADMIN') {
                        router.push('/reports');
                    } else {
                        router.push('/services');
                    }
                }, 500);
            } else {
                toast.error(data.message || 'Invalid credentials');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar isLoggedIn={false} />

            {/* Login Form */}
            <main className="container mx-auto py-16 px-6 max-w-md flex-grow">
                <form onSubmit={handleLogin} className="bg-white border border-gray-300 rounded-lg p-8 shadow-sm">
                    <h2 className="text-2xl font-bold mb-6 text-center text-black">Login</h2>

                    <div className="mb-4">
                        <label htmlFor="email" className="block font-medium mb-2 text-black">
                            Email:
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 text-black"
                            placeholder="john@email.com"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block font-medium mb-2 text-black">
                            Password:
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 text-black"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <p className="text-center text-gray-600 mt-4 text-sm">
                        Don't have an account? <a href="/signup" className="text-blue-600 hover:underline">Sign up</a>
                    </p>
                </form>
            </main>

            <Footer />
        </div>
    );
}

