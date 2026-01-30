'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Booking {
  id: string;
  date: string;
  status: string;
  user: { email: string };
  service: { name: string };
}

export default function ReportsTable({ bookings }: { bookings: Booking[] }) {
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState('');

  const handleFilter = () => {
    const url = new URL(window.location.href);
    if (filterStatus) {
      url.searchParams.set('status', filterStatus);
    } else {
      url.searchParams.delete('status');
    }
    router.push(url.toString());
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b flex items-center space-x-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded px-3 py-2 text-gray-700"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button
          onClick={handleFilter}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-gray-800"
        >
          Filter
        </button>
      </div>
      <table className="w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4 text-gray-600 font-medium">ID</th>
            <th className="p-4 text-gray-600 font-medium">Date</th>
            <th className="p-4 text-gray-600 font-medium">User</th>
            <th className="p-4 text-gray-600 font-medium">Service</th>
            <th className="p-4 text-gray-600 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="border-t hover:bg-gray-50">
              <td className="p-4 text-gray-800 text-sm truncate max-w-xs" title={b.id}>
                {b.id.substring(0, 8)}...
              </td>
              <td className="p-4 text-gray-800">
                {new Date(b.date).toLocaleDateString()}
              </td>
              <td className="p-4 text-gray-800">{b.user.email}</td>
              <td className="p-4 text-gray-800">{b.service.name}</td>
              <td className="p-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-bold ${
                    b.status === 'confirmed'
                      ? 'bg-green-100 text-green-700'
                      : b.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {b.status}
                </span>
              </td>
            </tr>
          ))}
          {bookings.length === 0 && (
             <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">No bookings found.</td>
             </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
