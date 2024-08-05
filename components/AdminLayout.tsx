"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push("/admin/login");
        return;
      }

      const { data: user } = await supabase
        .from("users")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (user?.role !== "admin") {
        router.push("/admin/login");
        return;
      }

      setIsAdmin(true);
      setLoading(false);
    };

    fetchSession();
  }, [router, supabase]);

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
