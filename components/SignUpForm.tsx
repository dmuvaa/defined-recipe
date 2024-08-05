"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/register', { email, password, firstName, lastName });
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('Failed to log in after sign up. Please try again.');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setError('User with this email exists. Kindly log in.');
      } else {
        setError('Failed to sign up. Please try again.');
      }
    }
  };

  return (
    <div className="container mx-auto p-8">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          className="w-full px-3 py-2 mb-4 border rounded"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          className="w-full px-3 py-2 mb-4 border rounded"
        />
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
          Sign Up
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        <div className="text-center my-4">or</div>
        <button
          onClick={() => signIn('google')}
          className="w-full bg-red-500 text-white px-3 py-2 rounded mt-4"
        >
          Sign up with Google
        </button>
        <p className="mt-4 text-center">
          Already a user?{' '}
          <Link href="/login" className="text-blue-500">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUpForm;
