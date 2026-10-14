"use client";

import Logo from "@/components/navbar/Logo";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { BiLogOut } from "react-icons/bi";
import { FiFileText, FiHome, FiMenu, FiUser, FiX } from "react-icons/fi";

const links = [
  { name: "Dashboard", href: "/admin", icon: FiHome },
  { name: "Authors", href: "/admin/authors", icon: FiUser },
  { name: "Posts", href: "/admin/posts", icon: FiFileText },
];

const supabase = createClient();

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    router.replace("/login");
  };
  return (
    <>
      {/* tob bar(mobile device) */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background">
        <Logo />
        <button onClick={() => setOpen(true)}>
          <FiMenu size={22} className="text-text z-100" />
        </button>
      </div>

      {/* overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-card border-r 
      border-border p-5 flex flex-col z-50 transform transition-transform duration-300 md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between mb-8">
          <Logo />
          <button className="md:hidden" onClick={() => setOpen(false)}>
            <FiX size={22} className="text-text" />
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link
                href={link.href}
                key={link.name}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-6 rounded-lg text-lg transition ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-400 hover:bg-surface hover:text-white"
                }`}
              >
                <Icon size={18} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white transition"
          >
            <BiLogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
