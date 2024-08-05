'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const AdminHeader = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/admin/login');
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="text-lg font-bold">Admin Dashboard</div>
      <nav>
        <button onClick={() => router.push('/admin')} className="mr-4">Home</button>
        <button onClick={() => router.push('/admin/users')} className="mr-4">Users</button>
        <button onClick={() => router.push('/admin/blogs')} className="mr-4">Blogs</button>
        <button onClick={() => router.push('/admin/create-blog')} className="mr-4">Create Blog</button>
        <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">Logout</button>
      </nav>
    </header>
  );
};

export default AdminHeader;
