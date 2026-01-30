'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { setAuthToken, setUser } from '@/lib/auth-utils';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            toast.error('Please enter both username and password');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
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
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-blue-600 text-white py-4 px-6">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">AutoMob-Mechanic</h1>
                    <nav className="flex gap-6">
                        <a href="/" className="hover:underline">Home</a>
                        <a href="/login" className="hover:underline">Login</a>
                        <a href="mailto:contact@automob.co.in" className="hover:underline">contact@automob.co.in ✉</a>
                        <span>| 999-999-9999 📞</span>
                    </nav>
                </div>
            </header>

            {/* Login Form */}
            <main className="container mx-auto py-16 px-6 max-w-md">
                <form onSubmit={handleLogin} className="bg-white border border-gray-300 rounded-lg p-8 shadow-sm">
                    <h2 className="text-2xl font-bold mb-6 text-center text-black">Login</h2>

                    <div className="mb-4">
                        <label htmlFor="username" className="block font-medium mb-2 text-black">
                            Username:
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 text-black"
                            placeholder="john"
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
                            placeholder="••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </main>

            {/* Footer */}
            <footer className="bg-blue-600 text-white text-center py-4 mt-16 fixed bottom-0 w-full">
                <p>Copyright © 2020 AutoMob-Mechanic. All Rights Reserved.</p>
            </footer>
        </div>
    );
}
