"use client";

import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RecipeGenerator from '../../components/RecipeGenerator';
import DashboardHeader from '../../components/DashboardHeader';
import DashboardFooter from '../../components/DashboardFooter';

const Dashboard = () => {
  const [session, setSession] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (!session) {
        router.push('/login');
      } else {
        setSession(session);
      }
    };

    fetchSession();
  }, [router]);

  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 30000); // 30 seconds

      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  if (!session) {
    return <p>Loading...</p>;
  }

  const userFirstName = session?.user?.firstName || session?.user?.name?.split(' ')[0] || session?.user?.email;

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <main className="flex-grow container mx-auto p-8">
        {showWelcome && (
          <div className="bg-green-100 p-6 rounded-lg shadow-lg mb-4">
            <h1 className="text-3xl font-bold text-green-800 mb-4">Welcome, {userFirstName}!</h1>
          </div>
        )}
        <div className="bg-green-100 p-6 rounded-lg shadow-lg mb-4">
          <p className="text-lg text-green-700 mb-4">
            You can generate an unlimited number of recipes at your comfort and cook delicious meals.
          </p>
          <p className="text-lg text-green-700 mb-4">
            Our AI-powered recipe generator allows you to explore new culinary horizons, experiment with different ingredients, 
            and find the perfect recipes that suit your taste. Whether you're a seasoned chef or a home cook, our tool is designed 
            to inspire you and make your cooking experience more enjoyable.
          </p>
          <p className="text-lg text-green-700 mb-4">
            Get started now and discover a world of flavors. From quick weeknight dinners to elaborate gourmet dishes, our recipe 
            generator has got you covered. Let's make cooking fun and easy!
          </p>
        </div>
        <div className="mt-8">
          <RecipeGenerator />
        </div>
      </main>
      <DashboardFooter />
    </div>
  );
};

export default Dashboard;
