"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminHeader from "../../../../components/AdminHeader";
import dynamic from "next/dynamic";
import { createClient } from "@/utils/supabase/client";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const CreateBlogPage = () => {
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        router.push("/admin/login");
      } else {
        const { data: user, error: userError } = await supabase
          .from("users")
          .select("isAdmin")
          .eq("id", session.user.id)
          .single();

        if (userError || !user?.isAdmin) {
          router.push("/admin/login");
        } else {
          setLoading(false);
        }
      }
    };

    checkAdmin();
  }, [router, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("No session found");
      }

      const { data, error } = await supabase.from("blogs").insert([
        {
          title,
          url,
          content,
          author_id: session.user.id,
        },
      ]);

      if (error) {
        throw error;
      }

      if (data) {
        router.push("/admin/blogs");
      }
    } catch (error) {
      console.error("Failed to create blog post", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <AdminHeader />
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Create New Blog</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <ReactQuill value={content} onChange={setContent} />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Create Blog
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBlogPage;
