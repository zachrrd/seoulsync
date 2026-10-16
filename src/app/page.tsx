import BlogSection from "@/components/home/BlogSection";
import Searchinput from "@/components/home/SearchInput";
import ContainerLayout from "@/components/layouts/ContainerLayout";

export default function Home() {
  return (
    <ContainerLayout>
      <div className="space-y-8 sm:space-y-10 relative pt-2 sm:pt-6">
        <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-80 sm:w-120 h-64 sm:h-80 bg-surface/80 blur-3xl rounded-full -z-10" />

        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface border border-border text-xs font-medium text-text/80 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            K-Pop Editorial & Culture Dispatch
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.15] text-center text-text font-bold max-w-4xl mx-auto">
          Your Editorial Lens on K-Pop Comebacks, Sounds & Culture
        </h1>

        <p className="text-text/70 text-sm sm:text-base lg:text-lg max-w-2xl text-center mx-auto leading-relaxed">
          Curated insights into album releases, artist spotlights, in-depth music reviews, and the vibrant stories shaping global fandoms.
        </p>

        <Searchinput />
        <BlogSection />
      </div>
    </ContainerLayout>
  );
}
