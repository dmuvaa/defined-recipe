"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import axios from 'axios';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient(); // Initialize Supabase client

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: sessionData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError || !sessionData?.session) {
        setError('Incorrect Username/Password');
        return;
      }

      // Fetch user data to check subscription status
      const userResponse = await axios.get('/api/user');
      const user = userResponse.data;

      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/signup');
      }
    } catch (error: any) {
      setError('Failed to log in. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    const { error: googleSignInError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (googleSignInError) {
      setError('Failed to log in with Google. Please try again.');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="container mx-auto p-8">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Log In</h1>
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
          Log In
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        <div className="text-center my-4">or</div>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full bg-red-500 text-white px-3 py-2 rounded mt-4"
        >
          Log in with Google
        </button>
        <p className="mt-4 text-center">
          Not a user yet?{' '}
          <Link href="/signup" className="text-blue-500">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
