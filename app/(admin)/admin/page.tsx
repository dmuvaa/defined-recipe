// src/app/admin/page.tsx
import AdminLayout from '../../components/AdminLayout';

const AdminPage = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <p>Welcome to the admin dashboard. Here you can manage the application.</p>
        {/* Add more admin functionalities as needed */}
      </div>
    </AdminLayout>
  );
};

export default AdminPage;
