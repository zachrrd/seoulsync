"use client";

import { Post } from "@/custom-hooks/usePost";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import PostCardSkeleton from "../loading/skeletons/PostCardSkeleton";

const supabase = createClient();

export default function BlogSection() {
  const [activeTab, setActiveTab] = useState("All");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // fetch published post
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });

        if(error){
          console.log(error)
        } else {
          setPosts(data || [])
        }
        setLoading(false)
    };
    fetchPosts();
  }, []);

  const tabs = useMemo(() => {
    const categories = posts.map((post) => post.category);

    return ["All", ...new Set(categories)]
  }, [posts]);

  const filteredPosts = 
    activeTab === "All"
      ? posts
      : posts.filter((post) => post.category === activeTab);
  return (
    <div className="max-w-6xl mx-auto mt-16 pb-20">
      <div className="relative z-10 flex gap-2 flex-wrap justify-center mb-10">
        {tabs.map((tab) => (
          <button
            type="button"
            className={`px-4 py-2 cursor-pointer rounded-full text-sm transition border ${activeTab === tab ? "bg-primary text-white border-primary" : "text-gray-400 border-border  hover:text-white"}`}
            key={tab}
            onClick={() => {
              setActiveTab(tab);
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading && (
        <PostCardSkeleton/>
      )}

      {!loading && filteredPosts.length === 0 && (
        <div className="text-center text-gray-400">
          No post found!
        </div>
      )}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <Link
            href={`/post/${post.slug}`}
            key={post.id}
            className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary transition cursor-pointer"
          >
            <div className="h-44 w-full overflow-hidden relative">
              <Image
                unoptimized
                src={post.cover_image}
                fill
                alt={post.title}
                className="object-cover hover:scale-105 transition duration-300"
              />
            </div>

            <div className="p-5">
              <span className="text-xs text-primary font-medium">
                {post.category}
              </span>

              <h3 className="text-text mt-2 text-lg font-semibold">
                {post.title}
              </h3>

              <p className="mt-2 text-sm text-gray-400">{post.mins_read} min read</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
