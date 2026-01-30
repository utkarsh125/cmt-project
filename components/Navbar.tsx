'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { User } from '@/types/user';

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="hover:underline uppercase text-sm font-semibold tracking-wider">
    {children}
  </Link>
);

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check sessionStorage on mount
    const storedUser = sessionStorage.getItem('automob_user');
    if (storedUser) {
      try {
        const parsed: User = JSON.parse(storedUser);
        setUser(parsed);
      } catch (e) {
        console.error('Failed to parse user session', e);
      }
    }
  }, [pathname]); 

  const handleLogout = () => {
    sessionStorage.removeItem('automob_user');
    setUser(null);
    alert('Logged out successfully');
    router.push('/');
  };

  return (
    <nav className="bg-automob-blue text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-wide">
          AutoMob-Mechanic
        </Link>

        <div className="flex items-center space-x-1 sm:space-x-3 text-sm sm:text-base">
          {user && (
            <>
              <span className="bg-white/20 px-2 py-1 rounded border border-white/30 mr-2 text-sm font-medium">
                Hi {user.name}
              </span>
              <span className="text-white/50">|</span>
            </>
          )}

          <NavLink href="/">Home</NavLink>
          <span className="text-white/50">|</span>

          {!user ? (
            <>
              <NavLink href="/login">Login</NavLink>
              <span className="text-white/50">|</span>
            </>
          ) : (
            <>
              {user.role === 'customer' && (
                <>
                  <NavLink href="/services">Services</NavLink>
                  <span className="text-white/50">|</span>
                  <NavLink href="/booking">Booking</NavLink>
                  <span className="text-white/50">|</span>
                </>
              )}
              {user.role === 'admin' && (
                <>
                  <NavLink href="/reports">Reports</NavLink>
                  <span className="text-white/50">|</span>
                </>
              )}
              <button
                onClick={handleLogout}
                className="hover:underline uppercase text-sm font-semibold tracking-wider"
              >
                Logout
              </button>
              <span className="text-white/50">|</span>
            </>
          )}

          <a href="mailto:contact@automob.co.in" className="hover:underline flex items-center gap-1">
            contact@automob.co.in
          </a>
          <span className="text-white/50">|</span>
          <a href="tel:999-999-9999" className="hover:underline">
             999-999-9999 ☎
          </a>
        </div>
      </div>
    </nav>
  );
}
