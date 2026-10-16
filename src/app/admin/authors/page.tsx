"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Author {
  name: string;
  email: string;
  id: string;
}

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await fetch("/api/authors");

        const data = await response.json();

        if (!response.ok) {
          console.log(data.error);
          setAuthors([]);
          return;
        }
        setAuthors(data);
      } catch (error) {
        console.log(error);

        setAuthors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthors();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Delete this author");

    if (!confirmDelete) return;

    setDeleting(true);

    try {
      const response = await fetch(`/api/authors/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error);

        return;
      }

      toast.success("Deleted successfully");
      setAuthors((prev) => prev.filter((author) => author.id !== id));
    } catch (error) {
      console.log(error);
    } finally {
      setDeleting(false);
    }
  };
  return (
    <main className="md:ml-64 p-6 min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-text">Authors</h2>
          <p className="text-sm text-gray-400 mt-1">
            {"  "}
            Manage all authors and admins on your platform.
          </p>
        </div>

        <Link
          href="/admin/register"
          className="px-4 py-2 bg-primary text-text font-medium text-sm rounded-lg hover:opacity-90 transition"
        >
          + Add Author
        </Link>
      </div>

      <div className="bg-card border border-border rounded-xl">
        <div className="overflow-x-scroll no-scrollbar">
          <table className="min-w-150 w-full text-sm">
            <thead className="bg-surface text-text/70 font-medium">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="py-10 text-center text-gray-400">
                    Loading authors...
                  </td>
                </tr>
              ) : authors.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-10 text-center text-gray-400">
                    No authors found!
                  </td>
                </tr>
              ) : (
                authors.map((author) => (
                  <tr
                    className="border-t border-border hover:bg-surface transition"
                    key={author.id}
                  >
                    <td className="px-4 py-6 text-text whitespace-nowrap">
                      {author.name}
                    </td>
                    <td className="px-4 py-6 text-text whitespace-nowrap">
                      {author.email}
                    </td>
                    <td className="px-4 py-6 text-text whitespace-nowrap">
                      <button
                        disabled={deleting}
                        onClick={() => handleDelete(author.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
