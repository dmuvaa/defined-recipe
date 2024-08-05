"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';

const AdminLayout = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();

      if (!session || session.user.role !== 'admin') {
        router.push('/admin/login');
        return;
      }

      setIsAdmin(true);
      setLoading(false);
    };

    fetchSession();
  }, [router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="admin-layout">
      <header className="admin-header">Admin Dashboard</header>
      <main className="admin-main">{children}</main>
    </div>
  );
};

export default AdminLayout;
