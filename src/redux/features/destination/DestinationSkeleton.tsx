export function DestinationSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-[340px] rounded-2xl bg-white overflow-hidden shadow-sm"
        >
          <div className="h-[60%] bg-gray-200 animate-pulse" />
          <div className="p-5 space-y-3">
            <div className="h-3 w-20 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
