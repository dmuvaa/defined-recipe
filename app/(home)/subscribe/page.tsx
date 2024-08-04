"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";

const Subscribe = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      console.log('Initial session:', session);
      if (!session) {
        router.push("/login"); // Redirect to login page if no session is found
      } else {
        setSession(session);
      }
    };

    fetchSession();
  }, [router]);

  useEffect(() => {
    const script = document.createElement("script");
    script.setAttribute("src", "https://js.paystack.co/v1/inline.js");
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePaystackPayment = (plan) => {
    if (!session) {
      alert('You must be logged in to subscribe.');
      return;
    }

    const amount = plan === 'monthly' ? 499 * 100 : 3999 * 100; // Amount in cents
    const handler = (window as any).PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: session.user.email,
      amount,
      currency: 'USD',
      ref: '' + Math.floor((Math.random() * 1000000000) + 1), // Generate a pseudo-unique reference
      metadata: {
        userId: session.user.id,  // Ensure userId is included here
        plan,
      },
      callback: (response) => {
        fetch(`/api/verify-transaction?reference=${response.reference}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              alert("Subscription successful!");
              router.push("/dashboard");
            } else {
              alert("Subscription failed. Please try again.");
            }
          })
          .catch((error) => {
            console.error("Error verifying transaction:", error);
            alert("Subscription failed. Please try again.");
          });
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
        <h1 className="text-4xl font-bold mb-4">Subscribe for Unlimited Recipes</h1>
        <p className="text-lg text-gray-600 mb-4">
          Choose a subscription plan to access unlimited recipe generations.
        </p>
      </header>

      <main className="flex flex-col items-center">
        <button
          onClick={() => handlePaystackPayment("monthly")}
          className="bg-green-500 text-white px-3 py-2 rounded mb-4"
          disabled={loading}
        >
          Subscribe Monthly ($4.99)
        </button>
        <button
          onClick={() => handlePaystackPayment("annually")}
          className="bg-blue-500 text-white px-3 py-2 rounded"
          disabled={loading}
        >
          Subscribe Annually ($39.99)
        </button>
        {loading && <p className="text-blue-500 mt-4">Processing payment, please wait...</p>}
      </main>
    </div>
  );
};

export default Subscribe;
