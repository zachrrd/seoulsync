"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

interface Stats {
  posts: number;
  authors: number;
}

const supabase = createClient();

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats>({
    posts: 0,
    authors: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        //count number of posts
        const { count: postCount, error: postError } = await supabase
          .from("posts")
          .select("id", {
            count: "exact",
            head: true,
          });

        //count the number of users
        const response = await fetch("/api/authors");

        const authorsData = await response.json();

        if (postError) {
          console.log(postError);
          return;
        }

        if (!response.ok) {
          console.log(authorsData.error);
          return;
        }

        setStats({
          posts: postCount || 0,
          authors: authorsData?.length || 0,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8 sm:mb-10">
      <div className="bg-card border border-border rounded-xl p-4">
        <p className="text-sm text-gray-400">Posts</p>
        <h2 className="text-xl sm:text-2xl font-semibold text-text mt-2">{loading ? "..." : stats.posts}</h2>
      </div>
      <div className="bg-card border border-border rounded-xl p-4">
        <p className="text-sm text-gray-400">Authors</p>
        <h2 className="text-xl sm:text-2xl font-semibold text-text mt-2">{loading ? "..." : stats.authors}</h2>
      </div>
    </div>
  );
}
