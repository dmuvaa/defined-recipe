'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';

const SubscriptionPage = () => {
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

  const handlePaystackPayment = (plan: 'monthly' | 'annually') => {
    const amount = plan === 'monthly' ? 499 : 3999; // Amount in cents (4.99 USD or 39.99 USD)
    const handler = PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY, // Replace with your Paystack public key
      email: 'customer@example.com', // Use the logged-in user's email
      amount: amount * 100, // Amount in kobo (100 kobo = 1 Naira)
      currency: 'USD', // Set to USD
      ref: '' + Math.floor((Math.random() * 1000000000) + 1), // Generate a pseudo-unique reference
      callback: (response) => {
        alert('Payment complete! Reference: ' + response.reference);
        // Update the user's subscription status on your server
      },
      onClose: () => {
        alert('Transaction was not completed, window closed.');
      },
    });
    handler.openIframe();
  };

  return (
    <div className="container mx-auto p-8">
      <header className="text-center my-8">
        <h1 className="text-4xl font-bold mb-4">Choose Your Subscription Plan</h1>
      </header>
      <main className="flex flex-col items-center">
        <div className="w-full max-w-md bg-white p-6 rounded shadow-md mb-4">
          <h2 className="text-2xl font-bold mb-4">Free Plan</h2>
          <p className="text-gray-600 mb-4">Limited access to features.</p>
          <button onClick={() => router.push('/dashboard')} className="bg-green-500 text-white px-3 py-2 rounded">
            Continue with Free Plan
          </button>
        </div>
        <div className="w-full max-w-md bg-white p-6 rounded shadow-md mb-4">
          <h2 className="text-2xl font-bold mb-4">Monthly Plan</h2>
          <p className="text-gray-600 mb-4">Full access for a month.</p>
          <button onClick={() => handlePaystackPayment('monthly')} className="bg-green-500 text-white px-3 py-2 rounded">
            Subscribe Monthly ($4.99)
          </button>
        </div>
        <div className="w-full max-w-md bg-white p-6 rounded shadow-md">
          <h2 className="text-2xl font-bold mb-4">Annual Plan</h2>
          <p className="text-gray-600 mb-4">Full access for a year.</p>
          <button onClick={() => handlePaystackPayment('annually')} className="bg-green-500 text-white px-3 py-2 rounded">
            Subscribe Annually ($39.99)
          </button>
        </div>
      </main>
    </div>
  );
};

export default SubscriptionPage;
