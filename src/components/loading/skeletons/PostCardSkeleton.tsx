
export default function PostCardSkeleton() {
  return (
    <div className="animate-pulse space-y-12">
      {/* Featured Story Skeleton */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-7 h-64 sm:h-80 lg:h-100 bg-surface" />
          <div className="lg:col-span-5 p-6 sm:p-8 lg:p-9 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="w-24 h-4 bg-surface rounded-full" />
              <div className="w-full h-8 bg-surface rounded-md" />
              <div className="w-3/4 h-8 bg-surface rounded-md" />
              <div className="space-y-2 pt-2">
                <div className="w-full h-4 bg-surface rounded" />
                <div className="w-5/6 h-4 bg-surface rounded" />
                <div className="w-4/6 h-4 bg-surface rounded" />
              </div>
            </div>
            <div className="w-48 h-4 bg-surface rounded pt-4" />
          </div>
        </div>
      </div>

      {/* Grid Skeletons */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-xl overflow-hidden flex flex-col"
          >
            {/* Image Skeleton */}
            <div className="h-48 w-full bg-surface" />

            {/* Content Skeleton */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                {/* Category */}
                <div className="w-20 h-3 bg-surface rounded" />

                {/* Title */}
                <div className="mt-4 space-y-2">
                  <div className="w-full h-5 bg-surface rounded" />
                  <div className="w-3/4 h-5 bg-surface rounded" />
                </div>
              </div>

              {/* Author & Read Time */}
              <div className="w-full pt-3 border-t border-border flex justify-between">
                <div className="w-20 h-3 bg-surface rounded" />
                <div className="w-20 h-3 bg-surface rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}