'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function SignupPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !email || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role: 'CUSTOMER'
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || 'Account created successfully!');
                setTimeout(() => {
                    router.push('/login');
                }, 500);
            } else {
                toast.error(data.message || 'Failed to create account');
            }
        } catch (error) {
            console.error('Signup error:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar isLoggedIn={false} />

            {/* Signup Form */}
            <main className="container mx-auto py-16 px-6 max-w-md flex-grow">
                <form onSubmit={handleSignup} className="bg-white border border-gray-300 rounded-lg p-8 shadow-sm">
                    <h2 className="text-2xl font-bold mb-6 text-center text-black">Create Account</h2>

                    <div className="mb-4">
                        <label htmlFor="name" className="block font-medium mb-2 text-black">
                            Full Name:
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 text-black"
                            placeholder="John Doe"
                            required
                        />
                    </div>

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
                            required
                        />
                    </div>

                    <div className="mb-4">
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
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">At least 8 characters</p>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block font-medium mb-2 text-black">
                            Confirm Password:
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 text-black"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:bg-blue-400 mb-4"
                    >
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>

                    <p className="text-center text-gray-600 text-sm">
                        Already have an account?{' '}
                        <a href="/login" className="text-blue-600 hover:underline">
                            Login here
                        </a>
                    </p>
                </form>
            </main>

            <Footer />
        </div>
    );
}
