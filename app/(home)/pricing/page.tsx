// src/app/pricing/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import axios from 'axios';

const PricingPage = () => {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (!session) {
        router.push('/login');
      }
    };

    checkSession();
  }, [router]);

  const handlePaystackPayment = async (plan: 'monthly' | 'annual') => {
    const session = await getSession();
    if (!session) {
      alert('You must be logged in to subscribe.');
      return;
    }

    try {
      const response = await axios.post('/api/initialize-transaction', { plan });
      const { authorization_url } = response.data;
      window.location.href = authorization_url;
    } catch (error) {
      alert('Error initializing payment');
    }
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto p-8">
        <header className="text-center my-8">
          <h1 className="text-4xl font-bold mb-4">Choose the right plan for you</h1>
          <p className="text-lg text-gray-600 mb-8">
            Discover the perfect plan to elevate your culinary experience. Whether you're just starting out or a seasoned chef, we have a plan that fits your needs and helps you create delicious meals effortlessly.
          </p>
        </header>
        <main className="flex flex-col items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            <div className="bg-white p-8 rounded shadow-md text-center">
              <h2 className="text-2xl font-bold mb-4">Monthly Plan</h2>
              <p className="text-3xl font-bold mb-4">$4.99<span className="text-lg font-medium">/month</span></p>
              <button
                onClick={() => handlePaystackPayment('monthly')}
                className="block bg-blue-500 text-white text-center py-4 rounded shadow mb-4 text-xl font-semibold hover:bg-blue-600 transition duration-300 w-full"
              >
                Buy plan
              </button>
              <ul className="text-left text-gray-600">
                <li className="mb-2"><span className="text-blue-500 font-bold">✓</span> Full access for a month</li>
                <li className="mb-2"><span className="text-blue-500 font-bold">✓</span> Unlimited recipe generations</li>
                <li className="mb-2"><span className="text-blue-500 font-bold">✓</span> Priority support</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded shadow-md text-center">
              <h2 className="text-2xl font-bold mb-4">Annual Plan</h2>
              <p className="text-3xl font-bold mb-4">$39.99<span className="text-lg font-medium">/year</span></p>
              <button
                onClick={() => handlePaystackPayment('annual')}
                className="block bg-green-500 text-white text-center py-4 rounded shadow mb-4 text-xl font-semibold hover:bg-green-600 transition duration-300 w-full"
              >
                Buy plan
              </button>
              <ul className="text-left text-gray-600">
                <li className="mb-2"><span className="text-green-500 font-bold">✓</span> Full access for a year</li>
                <li className="mb-2"><span className="text-green-500 font-bold">✓</span> Unlimited recipe generations</li>
                <li className="mb-2"><span className="text-green-500 font-bold">✓</span> Priority support</li>
                <li className="mb-2"><span className="text-green-500 font-bold">✓</span> Custom reporting and insights</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default PricingPage;
