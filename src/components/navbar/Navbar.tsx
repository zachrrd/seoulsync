import Link from "next/link";
import Logo from "./Logo";
import { LuArrowRight } from "react-icons/lu";

export default function Navbar() {
  return (
    <nav className="bg-surface/90 backdrop-blur-sm border border-border w-[95%] max-w-3xl mx-auto mt-5 rounded-full shadow-xs">
      <div className="flex items-center justify-between h-16 px-5 sm:px-6">
        <Logo />

        <Link
          href="/login"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-text text-sm font-medium hover:opacity-90 cursor-pointer transition"
        >
          Login
          <LuArrowRight size={16} />
        </Link>
      </div>
    </nav>
  );
}
