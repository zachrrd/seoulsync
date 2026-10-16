import BackButton from "@/components/general/BackButton";
import ContainerLayout from "@/components/layouts/ContainerLayout";
import PostSkeleton from "@/components/loading/skeletons/PostSkeleton";
import { sanitizeArticleContent } from "@/lib/sanitize";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPostBySlug(slug: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !post) {
    return null;
  }
  return post;
}

function formatPublishDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return "";
  }
}

function extractExcerpt(htmlContent?: string | null, maxLength = 160): string {
  if (!htmlContent) {
    return "Curated perspectives on K-Pop comebacks, artist spotlights, album reviews, and fandom culture.";
  }
  const plainText = htmlContent.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (!plainText) {
    return "Curated perspectives on K-Pop comebacks, artist spotlights, album reviews, and fandom culture.";
  }
  if (plainText.length <= maxLength) {
    return plainText;
  }
  return plainText.slice(0, maxLength).trim() + "…";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found — SeoulSync",
      description: "The requested K-Pop article could not be found.",
    };
  }

  const title = `${post.title} — SeoulSync`;
  const description = extractExcerpt(post.content);
  const hasValidImage = Boolean(
    post.cover_image &&
      typeof post.cover_image === "string" &&
      (post.cover_image.startsWith("http://") ||
        post.cover_image.startsWith("https://") ||
        post.cover_image.startsWith("/"))
  );

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: hasValidImage ? [{ url: post.cover_image, alt: post.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: hasValidImage ? [post.cover_image] : [],
    },
  };
}

async function PostContent({ slug }: { slug: string }) {
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const authorName = post.author_name?.trim() || "SeoulSync Editorial";
  const formattedDate = formatPublishDate(post.created_at);
  const hasValidImage = Boolean(
    post.cover_image &&
      typeof post.cover_image === "string" &&
      post.cover_image.trim().length > 0
  );
  const sanitizedContent = sanitizeArticleContent(post.content);

  return (
    <main className="max-w-3xl mx-auto pb-16">
      <BackButton />

      <div className="mb-4">
        <span className="px-3 py-1 rounded-full bg-surface border border-border text-xs font-semibold text-text uppercase tracking-wider">
          {post.category}
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text leading-[1.2] tracking-tight">
        {post.title}
      </h1>

      <div className="flex items-center justify-between flex-wrap gap-4 mt-6 pt-6 border-t border-border text-sm text-text/70">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center text-text font-bold text-xs uppercase shrink-0">
            {authorName.charAt(0)}
          </div>
          <div>
            <p className="text-xs font-semibold text-text">{authorName}</p>
            {formattedDate && (
              <p className="text-xs text-text/60">{formattedDate}</p>
            )}
          </div>
        </div>

        <div className="text-xs font-medium text-text/60 bg-surface/80 px-3 py-1 rounded-full border border-border/80">
          {post.mins_read ? `${post.mins_read} min read` : "Quick read"}
        </div>
      </div>

      {hasValidImage ? (
        <div className="mt-8 rounded-2xl overflow-hidden w-full h-64 sm:h-96 md:h-110 relative bg-surface border border-border">
          <Image
            unoptimized
            src={post.cover_image}
            alt={post.title}
            className="object-cover"
            fill
            priority
          />
        </div>
      ) : (
        <div className="mt-8 rounded-2xl w-full h-40 bg-surface border border-border flex items-center justify-center p-6 text-center">
          <span className="text-sm font-medium text-text/50">
            No cover image available
          </span>
        </div>
      )}

      <article
        className="mt-10 post-content text-text leading-relaxed tracking-normal"
        dangerouslySetInnerHTML={{
          __html: sanitizedContent,
        }}
      />
    </main>
  );
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  return (
    <ContainerLayout>
      <Suspense fallback={<PostSkeleton />}>
        <PostContent slug={slug} />
      </Suspense>
    </ContainerLayout>
  );
}
