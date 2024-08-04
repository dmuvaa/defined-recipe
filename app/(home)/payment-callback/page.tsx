// pages/payment-callback.tsx

"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const PaymentCallback = () => {
  const router = useRouter();
  const { reference } = router.query;

  useEffect(() => {
    if (reference) {
      verifyTransaction(reference as string);
    }
  }, [reference]);

  const verifyTransaction = async (reference: string) => {
    try {
      const response = await axios.get(`/api/verify-transaction?reference=${reference}`);
      const { success, message } = response.data;
      if (success) {
        alert('Payment successful! Subscription updated.');
        router.push('/success');
      } else {
        alert('Payment verification failed.');
        router.push('/error');
      }
    } catch (error) {
      alert('An error occurred while verifying the payment.');
      router.push('/error');
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Processing Payment...</h1>
      <p>Please wait while we verify your payment.</p>
    </div>
  );
};

export default PaymentCallback;
