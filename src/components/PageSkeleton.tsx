export function PageSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-muted rounded-md" />
        <div className="h-9 w-28 bg-muted rounded-md" />
      </div>

      {/* Cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-24 bg-card border border-border rounded-lg p-4 space-y-2">
            <div className="h-3 w-20 bg-muted rounded" />
            <div className="h-6 w-16 bg-muted rounded" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="h-10 bg-muted/50 border-b border-border" />
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-12 border-b border-border flex items-center gap-4 px-4">
            <div className="h-3 w-24 bg-muted rounded" />
            <div className="h-3 w-32 bg-muted rounded" />
            <div className="h-3 w-16 bg-muted rounded ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
