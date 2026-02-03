'use client';

import { useState } from 'react';
import { Phone, Envelope } from '@phosphor-icons/react';

interface NavbarProps {
    user?: {
        name: string;
        role: 'ADMIN' | 'USER';
    } | null;
    onLogout?: () => void;
    isLoggedIn?: boolean;
}

export default function Navbar({ user, onLogout, isLoggedIn = false }: NavbarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <header className="bg-blue-600 text-white py-4 px-6">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">AutoMob-Mechanic</h1>

                {/* Hamburger Menu Icon - Mobile Only */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden flex flex-col gap-1.5 z-50 p-2 hover:bg-blue-700 rounded transition-colors"
                    aria-label="Toggle menu"
                >
                    <span
                        className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                            }`}
                    ></span>
                    <span
                        className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''
                            }`}
                    ></span>
                    <span
                        className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                            }`}
                    ></span>
                </button>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex gap-6 items-center">
                    {isLoggedIn && user && <span>Hi {user.name}</span>}
                    <a href="/" className="hover:underline">
                        Home
                    </a>
                    {isLoggedIn ? (
                        <>
                            <a href="/services" className="hover:underline">
                                Services
                            </a>
                            {user?.role === 'ADMIN' && (
                                <a href="/reports" className="hover:underline">
                                    Dashboard
                                </a>
                            )}
                            {user?.role !== 'ADMIN' && (
                                <>
                                    <a href="/booking" className="hover:underline">
                                        Booking
                                    </a>
                                    <a href="/booking-history" className="hover:underline">
                                        My Bookings
                                    </a>
                                    <a href="/my-cars" className="hover:underline">
                                        My Cars
                                    </a>
                                </>
                            )}
                            <button onClick={onLogout} className="hover:underline">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <a href="/services" className="hover:underline">
                                Services
                            </a>
                            <a href="/booking" className="bg-white text-blue-600 px-4 py-2 rounded font-semibold hover:bg-gray-100 transition-colors">
                                Book Now
                            </a>
                            <a href="/login" className="hover:underline">
                                Login
                            </a>
                            <a href="/signup" className="hover:underline">
                                Sign Up
                            </a>
                        </>
                    )}
                    <a href="mailto:contact@automob.co.in" className="hover:underline flex items-center gap-1">
                        <Envelope size={16} />
                        contact@automob.co.in
                    </a>
                    <span className="flex items-center gap-1">| <Phone size={16} /> 999-999-9999</span>
                </nav>

                {/* Mobile Navigation Menu */}
                <div
                    className={`fixed inset-0 bg-blue-600 z-40 md:hidden transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    <nav className="flex flex-col items-center justify-center h-full gap-8 text-xl">
                        {isLoggedIn && user && (
                            <span className="text-white font-semibold">Hi {user.name}</span>
                        )}
                        <a
                            href="/"
                            onClick={closeMenu}
                            className="hover:underline text-white py-2 px-4 min-h-[44px] flex items-center"
                        >
                            Home
                        </a>
                        {isLoggedIn ? (
                            <>
                                <a
                                    href="/services"
                                    onClick={closeMenu}
                                    className="hover:underline text-white py-2 px-4 min-h-[44px] flex items-center"
                                >
                                    Services
                                </a>
                                {user?.role === 'ADMIN' && (
                                    <a
                                        href="/reports"
                                        onClick={closeMenu}
                                        className="hover:underline text-white py-2 px-4 min-h-[44px] flex items-center"
                                    >
                                        Dashboard
                                    </a>
                                )}
                                {user?.role !== 'ADMIN' && (
                                    <>
                                        <a
                                            href="/booking"
                                            onClick={closeMenu}
                                            className="hover:underline text-white py-2 px-4 min-h-[44px] flex items-center"
                                        >
                                            Booking
                                        </a>
                                        <a
                                            href="/booking-history"
                                            onClick={closeMenu}
                                            className="hover:underline text-white py-2 px-4 min-h-[44px] flex items-center"
                                        >
                                            My Bookings
                                        </a>
                                        <a
                                            href="/my-cars"
                                            onClick={closeMenu}
                                            className="hover:underline text-white py-2 px-4 min-h-[44px] flex items-center"
                                        >
                                            My Cars
                                        </a>
                                    </>
                                )}
                                <button
                                    onClick={() => {
                                        closeMenu();
                                        onLogout?.();
                                    }}
                                    className="hover:underline text-white py-2 px-4 min-h-[44px] flex items-center"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <a
                                    href="/services"
                                    onClick={closeMenu}
                                    className="hover:underline text-white py-2 px-4 min-h-[44px] flex items-center"
                                >
                                    Services
                                </a>
                                <a
                                    href="/booking"
                                    onClick={closeMenu}
                                    className="bg-white text-blue-600 py-2 px-6 rounded font-semibold"
                                >
                                    Book Now
                                </a>
                                <a
                                    href="/login"
                                    onClick={closeMenu}
                                    className="hover:underline text-white py-2 px-4 min-h-[44px] flex items-center"
                                >
                                    Login
                                </a>
                                <a
                                    href="/signup"
                                    onClick={closeMenu}
                                    className="hover:underline text-white py-2 px-4 min-h-[44px] flex items-center"
                                >
                                    Sign Up
                                </a>
                            </>
                        )}
                        <a
                            href="mailto:contact@automob.co.in"
                            onClick={closeMenu}
                            className="hover:underline text-white py-2 px-4 min-h-[44px] flex items-center gap-2"
                        >
                            <Envelope size={18} />
                            contact@automob.co.in
                        </a>
                        <span className="text-white py-2 px-4 flex items-center gap-2">
                            <Phone size={18} />
                            999-999-9999
                        </span>
                    </nav>
                </div>
            </div>
        </header>
    );
}
