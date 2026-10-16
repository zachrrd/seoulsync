import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";

export default function BackButton() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-text/70 hover:text-text hover:bg-surface px-3.5 py-1.5 rounded-full border border-border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary mb-6"
    >
      <LuArrowLeft size={15} />
      <span>Kembali ke SeoulSync</span>
    </Link>
  );
}
