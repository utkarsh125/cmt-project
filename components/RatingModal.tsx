'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RatingModal({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, score, comment }),
      });
      setIsOpen(false);
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to submit rating', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h3 className="text-xl font-bold mb-4 text-gray-900">Rate Your Service</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Score (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="w-full border rounded px-3 py-2 text-gray-900"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border rounded px-3 py-2 text-gray-900"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Skip
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
