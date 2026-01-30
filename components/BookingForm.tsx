'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultService = searchParams.get('service') || '';

  const [serviceSlug, setServiceSlug] = useState(defaultService);
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!serviceSlug) {
      setError('Please select a service.');
      return;
    }

    const selectedDate = new Date(date);
    const now = new Date();
    if (selectedDate < now) {
      setError('Please select a future date and time.');
      return;
    }

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ serviceSlug, date }),
      });

      if (res.ok) {
        router.push('/booking-success?from=booking');
      } else {
        const data = await res.json();
        setError(data.error || 'Booking failed.');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Book a Service</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Service Slug</label>
        <input
          type="text"
          value={serviceSlug}
          onChange={(e) => setServiceSlug(e.target.value)}
          placeholder="e.g., preventive-maintenance"
          className="w-full border rounded px-3 py-2 text-gray-800"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          (In a real app, this would be a dropdown of available services)
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Date & Time</label>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border rounded px-3 py-2 text-gray-800"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Confirm Booking
      </button>
    </form>
  );
}
