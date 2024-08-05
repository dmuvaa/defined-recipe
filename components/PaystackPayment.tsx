"use client";

import { useState } from 'react';
import axios from 'axios';
import { createClient } from '@/utils/supabase/client'; // Import the Supabase client

const PaystackPayment = ({ plan, amount }: { plan: string; amount: number }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const supabase = createClient(); // Initialize Supabase client

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      setError('You must be logged in to subscribe.');
      return;
    }

    const { user } = session;

    let handler = (window as any).PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY, // Replace with your public key
      email: user.email,
      amount: amount * 100, // Paystack expects the amount in kobo
      ref: '' + Math.floor(Math.random() * 1000000000 + 1), // Generates a pseudo-unique reference
      onClose: function () {
        alert('Window closed.');
      },
      callback: async function (response: { reference: string }) {
        let message = 'Payment complete! Reference: ' + response.reference;
        alert(message);

        // Make an AJAX call to your server with the reference to verify the transaction
        try {
          const now = new Date();
          const startDate = now.toISOString();
          const endDate = new Date(
            now.setMonth(now.getMonth() + (plan === 'monthly' ? 1 : 12))
          ).toISOString();

          await axios.post('/api/subscribe', {
            userId: user.id,
            plan,
            startDate,
            endDate,
          });

          alert('Subscription successful!');
        } catch (error) {
          alert('Error saving subscription.');
        }
      },
    });

    handler.openIframe();
  };

  return (
    <form id="paymentForm" onSubmit={handleSubmit}>
      <button type="submit">Subscribe</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default PaystackPayment;
