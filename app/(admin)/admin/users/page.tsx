"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import AdminHeader from "../../../../components/AdminHeader";

const UsersPage = () => {
  const [loading, setLoading] = useState(true);
  const [usersCount, setUsersCount] = useState(0);
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

  useEffect(() => {
    const fetchUsersCount = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id", { count: "exact" });

      if (!error && data) {
        setUsersCount(data.length);
      } else {
        console.error("Error fetching user count:", error);
      }
    };

    fetchUsersCount();
  }, [supabase]);

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