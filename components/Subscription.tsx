// src/components/Subscription.tsx
import React from 'react';

const Subscription = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Choose a Subscription Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a href="https://paystack.com/pay/tztq2e5xup" className="block bg-blue-500 text-white text-center py-4 rounded shadow">
          Annual Plan - $XXX
        </a>
        <a href="https://paystack.com/pay/jo4kh7-s6p" className="block bg-green-500 text-white text-center py-4 rounded shadow">
          Monthly Plan - $XXX
        </a>
      </div>
    </div>
  );
};

export default Subscription;
