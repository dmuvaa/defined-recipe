"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import AdminHeader from "../../../../components/AdminHeader";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push("/admin/login");
      } else {
        const { data: user } = await supabase
          .from("users")
          .select("isAdmin")
          .eq("id", session.user.id)
          .single();

        if (!user?.isAdmin) {
          router.push("/admin/login");
        } else {
          setLoading(false);
        }
      }
    };

    checkAdmin();
  }, [router, supabase]);

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
