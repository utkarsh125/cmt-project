'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUser, logout, isAuthenticated } from '@/lib/auth-utils';
import { toast } from 'sonner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      const userData = getUser();
      setUser(userData);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    setIsLoggedIn(false);
    setUser(null);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar user={user} onLogout={handleLogout} isLoggedIn={isLoggedIn} />

      {/* Main Content */}
      <main className="container mx-auto py-16 px-6 flex-grow">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="bg-gray-200 rounded-lg overflow-hidden">
            <img
              src="/home.jpg"
              alt="Mechanic at work"
              className="w-full h-[400px] object-cover"
            />
          </div>

          {/* About Us Section */}
          <div>
            <h2 className="text-3xl font-bold mb-4 text-black">About Us</h2>
            <p className="text-gray-700 mb-6 italic">
              "One stop solution to get your car repaired and serviced".
            </p>
            <p className="text-gray-600 mb-8">
              At AutoMob-Mechanic, we aim to make the car repair and service experience straightforward by providing services for repairing, servicing and maintaining - lending our expertise in all forms.
            </p>

            <h3 className="text-2xl font-bold mb-4 text-black">How it Works?</h3>

            <div className="space-y-4 mb-8">
              <div>
                <h4 className="font-bold text-lg text-black">Choose the service</h4>
                <p className="text-gray-600">Choose the perfect service for your car.</p>
              </div>

              <div>
                <h4 className="font-bold text-lg text-black">Book an Appointment</h4>
                <p className="text-gray-600">Book an appointment with us on your convenient date.</p>
              </div>

              <div>
                <h4 className="font-bold text-lg text-black">Get your Car Fixed</h4>
                <p className="text-gray-600">No need to wait, our representative will take care of everything on their own.</p>
              </div>
            </div>

            <button
              onClick={() => router.push('/services')}
              className="bg-blue-600 text-white px-8 py-3 rounded hover:bg-blue-700 transition-colors"
            >
              Explore More
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
