"use client"

import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminHeader from '../../../components/AdminHeader';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const session = await getSession();
      if (!session || !session.isAdmin) {
        router.push('/admin/login');
      } else {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <AdminHeader />
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold">Welcome to the Admin Dashboard</h1>
        {/* Admin dashboard content */}
      </div>
    </div>
  );
};

export default AdminDashboard;
