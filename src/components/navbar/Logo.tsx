import Link from "next/link";
import { LuSparkles } from "react-icons/lu";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <div className="p-2 rounded-xl bg-primary text-text transition group-hover:opacity-90">
        <LuSparkles size={18} />
      </div>
      <span className="text-lg font-bold tracking-tight text-text">
        Seoul<span className="text-primary font-medium">Sync</span>
      </span>
    </Link>
  );
}