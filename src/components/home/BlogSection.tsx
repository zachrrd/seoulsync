"use client";

import { Post } from "@/custom-hooks/usePost";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { LuArrowUpRight } from "react-icons/lu";
import PostCardSkeleton from "../loading/skeletons/PostCardSkeleton";

const supabase = createClient();

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  } catch {
    return "";
  }
}

function getExcerpt(htmlContent: string, maxLength = 160): string {
  if (!htmlContent) return "";
  const plainText = htmlContent.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (plainText.length <= maxLength) return plainText;
  return plainText.slice(0, maxLength).trim() + "…";
}

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

      if (error) {
        console.log(error);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const tabs = useMemo(() => {
    const categories = posts.map((post) => post.category);
    return ["All", ...new Set(categories)];
  }, [posts]);

  const filteredPosts =
    activeTab === "All"
      ? posts
      : posts.filter((post) => post.category === activeTab);

  // Featured article is the top story of the current view without duplicating in the grid
  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const gridPosts = filteredPosts.length > 1 ? filteredPosts.slice(1) : [];

  return (
    <div className="max-w-6xl mx-auto mt-12 pb-20">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 flex-wrap justify-center mb-10">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              type="button"
              className={`px-4 py-2 cursor-pointer rounded-full text-xs sm:text-sm font-medium transition border ${
                isActive
                  ? "bg-primary text-text border-primary shadow-xs"
                  : "bg-card text-text/70 border-border hover:bg-surface hover:text-text"
              }`}
              key={tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {loading && <PostCardSkeleton />}

      {!loading && filteredPosts.length === 0 && (
        <div className="text-center py-16 px-4 bg-card border border-border rounded-2xl max-w-md mx-auto">
          <p className="text-text font-semibold">No dispatches found</p>
          <p className="text-xs text-text/60 mt-1">
            Check back soon for fresh K-Pop editorial stories.
          </p>
        </div>
      )}

      {/* Featured Article Banner */}
      {!loading && featuredPost && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              ✦ Featured Story
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Link
            href={`/post/${featuredPost.slug}`}
            className="group block bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/60 hover:shadow-sm transition duration-300"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="lg:col-span-7 h-64 sm:h-80 lg:h-100 relative overflow-hidden bg-surface">
                <Image
                  unoptimized
                  src={featuredPost.cover_image}
                  fill
                  alt={featuredPost.title}
                  className="object-cover group-hover:scale-105 transition duration-500"
                  priority
                />
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-9 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-surface border border-border text-xs font-semibold text-text uppercase tracking-wider">
                      {featuredPost.category}
                    </span>
                    <span className="text-xs text-text/50">
                      {featuredPost.mins_read} min read
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text group-hover:text-primary transition mt-4 leading-snug">
                    {featuredPost.title}
                  </h2>

                  {featuredPost.content && (
                    <p className="mt-4 text-sm sm:text-base text-text/70 line-clamp-3 leading-relaxed">
                      {getExcerpt(featuredPost.content, 170)}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-5 border-t border-border flex items-center justify-between text-xs text-text/60">
                  <div className="flex items-center gap-2 truncate max-w-[70%]">
                    <span className="font-medium text-text truncate">
                      {featuredPost.author_name || "SeoulSync Editorial"}
                    </span>
                    {featuredPost.created_at && (
                      <>
                        <span>•</span>
                        <span className="whitespace-nowrap">
                          {formatDate(featuredPost.created_at)}
                        </span>
                      </>
                    )}
                  </div>

                  <span className="inline-flex items-center gap-1 font-semibold text-text group-hover:text-primary transition shrink-0">
                    Read Story
                    <LuArrowUpRight size={16} />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Grid of Remaining Articles */}
      {!loading && gridPosts.length > 0 && (
        <div>
          {featuredPost && (
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-text/60">
                Latest Dispatches
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gridPosts.map((post) => (
              <Link
                href={`/post/${post.slug}`}
                key={post.id}
                className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/60 hover:shadow-xs transition cursor-pointer flex flex-col"
              >
                <div className="h-48 w-full overflow-hidden relative bg-surface">
                  <Image
                    unoptimized
                    src={post.cover_image}
                    fill
                    alt={post.title}
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>

                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                      {post.category}
                    </span>

                    <h3 className="text-text mt-2 text-lg font-bold group-hover:text-primary transition line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                  </div>

                  <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs text-text/60">
                    <span className="truncate max-w-[130px] font-medium text-text/80">
                      {post.author_name || "Editorial"}
                    </span>
                    <span className="whitespace-nowrap">
                      {formatDate(post.created_at) || `${post.mins_read} min read`}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
