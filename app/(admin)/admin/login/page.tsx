'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signIn('admin-credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('Failed to log in as admin. Please try again.');
      } else {
        router.push('/admin');
      }
    } catch (error) {
      setError('Failed to log in. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-8">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 mb-4 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 mb-4 border rounded"
        />
        <button type="submit" className="w-full bg-blue-500 text-white px-3 py-2 rounded">
          Login
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
};

export default AdminLoginPage;
