'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const res = await fetch('/users.json');
      const data = await res.json();
      const users: any[] = data.users;

      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        // Store user in session storage
        sessionStorage.setItem(
          'automob_user',
          JSON.stringify({
            username: user.username,
            name: user.name,
            role: user.role,
          })
        );
        alert('Logged in successfully');
        // Force refresh to update Navbar state immediately if we were just using router.push
        // But since we are pushing to home which uses client components, the Navbar (on layout) might not re-render deeply enough without a trigger
        // However, Navbar listens to pathname changes, so it should update.
        router.push('/');
      } else {
        alert('Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      alert('Login failed due to system error');
    }
  };

  return (
    <div className="flex justify-center items-center flex-grow py-12">
      <form onSubmit={handleLogin} className="w-full max-w-sm">
         {/* Blue Header Bar for the Form similar to screen shot can be simulated or we stick to simple form */}
         {/* Screenshot shows just the page header. The form itself is simple. */}
         
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username:
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter username"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password:
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter password"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-automob-blue hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
