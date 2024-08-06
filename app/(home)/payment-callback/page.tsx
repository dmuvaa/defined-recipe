// app/(home)/payment-callback/page.tsx

'use client'

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

const PaymentCallbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');

  useEffect(() => {
    if (reference) {
      verifyTransaction(reference);
    }
  }, [reference]);

  const verifyTransaction = async (reference: string) => {
    try {
      const response = await axios.get(`/api/verify-transaction?reference=${reference}`);
      const { success } = response.data;
      if (success) {
        alert('Payment successful! Subscription updated.');
        router.push('/success');
      } else {
        alert('Payment verification failed.');
        router.push('/error');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      alert('An error occurred while verifying the payment.');
      router.push('/error');
    }
  };

  return <p>Verifying payment...</p>;
};

const PaymentCallback = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <PaymentCallbackContent />
    </Suspense>
  );
};

export default PaymentCallback;