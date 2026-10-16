export default function PostSkeleton() {
  return (
    <main className="max-w-3xl mx-auto animate-pulse pb-16">
      <div className="h-8 w-36 bg-surface rounded-full mb-6" />

      <div className="h-6 w-28 bg-surface rounded-full mb-4" />

      <div className="h-10 sm:h-12 w-full bg-surface rounded-lg mb-3" />
      <div className="h-10 sm:h-12 w-4/5 bg-surface rounded-lg mb-6" />

      <div className="pt-6 border-t border-border flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-surface" />
          <div className="space-y-1.5">
            <div className="h-3 w-28 bg-surface rounded" />
            <div className="h-3 w-20 bg-surface rounded" />
          </div>
        </div>
        <div className="h-6 w-20 bg-surface rounded-full" />
      </div>

      <div className="w-full h-64 sm:h-96 md:h-110 bg-surface rounded-2xl mb-10 border border-border" />

      <div className="space-y-4">
        <div className="h-4 w-full bg-surface rounded" />
        <div className="h-4 w-full bg-surface rounded" />
        <div className="h-4 w-5/6 bg-surface rounded" />
        <div className="h-4 w-full bg-surface rounded" />
        <div className="h-4 w-3/4 bg-surface rounded" />
        <div className="h-4 w-full bg-surface rounded pt-4" />
        <div className="h-4 w-4/5 bg-surface rounded" />
      </div>
    </main>
  );
}
