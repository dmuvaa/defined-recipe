"use client"

import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { prisma } from '../../../lib/prisma';
import AdminHeader from '../../../../components/AdminHeader';

const UsersPage = () => {
  const [loading, setLoading] = useState(true);
  const [usersCount, setUsersCount] = useState(0);
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

  useEffect(() => {
    const fetchUsersCount = async () => {
      const count = await prisma.user.count();
      setUsersCount(count);
    };

    fetchUsersCount();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <AdminHeader />
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Users Management</h1>
        <p>Total Users: {usersCount}</p>
        {/* Additional user management functionality */}
      </div>
    </div>
  );
};

export default UsersPage;
