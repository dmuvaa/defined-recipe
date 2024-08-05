"use client";

import { useEffect, useState } from 'react';

const SubscriptionPage = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePaystackPayment = (plan: 'monthly' | 'annually') => {
    const amount = plan === 'monthly' ? 499 : 3999; // Amount in cents (4.99 USD or 39.99 USD)

    if (typeof (window as any).PaystackPop !== 'undefined') {
      const handler = (window as any).PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY, // Replace with your Paystack public key
        email: 'customer@example.com', // Use the logged-in user's email
        amount: amount * 100, // Amount in kobo (100 kobo = 1 Naira)
        currency: 'USD',
        ref: '' + Math.floor(Math.random() * 1000000000 + 1), // Generate a pseudo-unique reference
        callback: function(response: any) {
          // This happens after the payment is completed successfully
          alert('Payment complete! Reference: ' + response.reference);
          // Make a call to your backend to verify payment
        },
        onClose: function() {
          alert('Transaction was not completed, window closed.');
        }
      });

      handler.openIframe();
    } else {
      alert('Paystack is not loaded yet. Please try again later.');
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Subscription Page</h1>
      <button
        onClick={() => handlePaystackPayment('monthly')}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        Subscribe Monthly
      </button>
      <button
        onClick={() => handlePaystackPayment('annually')}
        className="bg-green-500 text-white px-4 py-2 rounded ml-4"
        disabled={loading}
      >
        Subscribe Annually
      </button>
    </div>
  );
};

export default SubscriptionPage;
