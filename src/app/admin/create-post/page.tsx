"use client";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import JoditEditor from "jodit-react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import Slugify from "slugify";
import { useRouter } from "next/navigation";

export interface FormState {
  title: string;
  category: string;
  content: string;
  status: "draft" | "published";
  image: null | File;
}

export const categories = [
  { name: "Technology", slug: "technology" },
  { name: "Startup", slug: "startup" },
  { name: "Lifestyle", slug: "lifestyle" },
  { name: "Finance", slug: "finance" },
];

const supabase = createClient();

export default function CreatePostPage() {
  const [form, setForm] = useState<FormState>({
    title: "",
    category: "",
    content: "",
    status: "draft",
    image: null,
  });

  const editor = useRef(null);
  const fileInputRef = useRef<null | HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (preview) URL.revokeObjectURL(preview);

    const url = URL.createObjectURL(file);

    setForm((prev) => ({ ...prev, image: file }));
    setPreview(url);
  };

  const removeImage = () => {
    if (preview) URL.revokeObjectURL(preview);

    setPreview(null);
    setForm((prev) => ({ ...prev, image: null }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const config = useMemo(
    () => ({
      placeholder: "Start writing article...",
      theme: "dark",
      style: {
        background: "#121212",
        color: "#d1d5dc",
      },
    }),
    [],
  );

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!form.content || !form.category || !form.image || !form.title) {
      toast.error("All fields are required!");
      return;
    }
    try {
      setLoading(true);

      let imageURL = "";

      if (form.image) {
        const fileExt = form.image.name.split(".").pop();

        const imagePath = `${Date.now()}.${fileExt}`;

        const { error: UploadError } = await supabase.storage
          .from("cover_images")
          .upload(imagePath, form.image);
        if (UploadError) {
          throw new Error(UploadError.message);
        }

        //generate image URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("cover_images").getPublicUrl(imagePath);

        imageURL = publicUrl;
      }

      const {data:{user}} = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Unauthorized");
      }

      //create slug
      const slug = Slugify(form.title, {
        lower: true,
        strict: true,
        trim: true,
      });

      //calculate the read time
      const plainText = form.content.replace(/<[^>]*>/g, "");

      const wordCount = plainText.trim().split(/\s+/).length;

      const minsRead = Math.max(1, Math.ceil(wordCount / 200));

      //insert the post
      const { error } = await supabase.from("posts").insert({
        title: form.title,
        slug,
        content: form.content,
        category: form.category,
        status: form.status,
        cover_image: imageURL,
        mins_read: minsRead,
        author_id: user.id,
        author_name: user.user_metadata.name,
      });

      if (error) {
        toast.error(error.message as string);
        return;
      }

      toast.success("Post created successfully");
      router.replace("/admin/posts");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="md:ml-64 p-6 min-h-screen">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-text">Create Post</h2>
        <p className="text-sm text-gray-400 mt-1">
          Write and publish a new blog post.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-5 space-y-6 max-w-3xl">
        {/* title */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Title</label>
          <input
            className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-sm text-text focus:border-primary"
            type="text"
            placeholder="Enter post title"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </div>

        {/* category */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Category</label>
          <select
            className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-sm text-text focus:border-primary"
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
          >
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* status */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Status</label>
          <select
            className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-sm text-text focus:border-primary"
            value={form.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {/* image */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Cover Image
          </label>
          <input
            onChange={handleImageChange}
            ref={fileInputRef}
            type="file"
            className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-sm text-text focus:border-primary"
          />

          {preview && (
            <div className="mt-3">
              <div className="h-64 w-full relative">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="rounded-lg object-cover border border-border"
                />
              </div>

              <button
                onClick={removeImage}
                className="text-xs text-red-400 mt-2"
              >
                Remove image
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Content</label>
          <div className="rounded-lg bg-white overflow-hidden">
            <JoditEditor
              ref={editor}
              value={form.content}
              config={config}
              onChange={(content) => handleChange("content", content)}
            />
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button className="px-5 py-2 bg-primary text-white text-sm rounded-lg hover:opacity-90 transition">
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </main>
  );
}
