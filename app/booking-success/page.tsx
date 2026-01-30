'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import RatingModal from '@/components/RatingModal';

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const [showRating, setShowRating] = useState(false);

  useEffect(() => {
    if (from === 'booking') {
      const timer = setTimeout(() => {
        setShowRating(true);
      }, 60000); // Show after 60 seconds as requested

      return () => clearTimeout(timer);
    }
  }, [from]);

  return (
    <div className="container mx-auto py-20 px-4 text-center">
      <div className="bg-green-100 text-green-800 p-8 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h1 className="text-3xl font-bold mb-4">Booking Confirmed!</h1>
      <p className="text-gray-600 mb-8 max-w-lg mx-auto">
        Your service has been successfully booked. We look forward to serving you.
      </p>
      <Link
        href="/dashboard"
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
      >
        Go to Dashboard
      </Link>

      {/* For demo purposes, we can maybe show a mocked booking Id or pass it along, 
          but usually you'd get the ID from the previous step. 
          Here assuming a dummy ID for the modal demo or just showing it.
          In a real app, pass the actual booking ID. */}
      {showRating && <RatingModal bookingId="demo-booking-id" />}
    </div>
  );
}
