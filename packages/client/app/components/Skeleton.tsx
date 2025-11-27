export function SkeletonText({
   lines = 3,
   className = '',
}: {
   lines?: number;
   className?: string;
}) {
   return (
      <div className={`space-y-2 ${className}`}>
         {Array.from({ length: lines }).map((_, i) => (
            <div
               key={i}
               className="h-4 bg-gray-700 rounded animate-pulse"
               style={{ width: i === lines - 1 ? '70%' : '100%' }}
            />
         ))}
      </div>
   );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
   return (
      <div
         className={`bg-(--color-background-card) rounded-lg border border-(--color-border) p-6 ${className}`}
      >
         <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gray-700 rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
               <div className="h-4 bg-gray-700 rounded animate-pulse w-1/3" />
               <div className="h-3 bg-gray-700 rounded animate-pulse w-1/2" />
            </div>
         </div>
         <SkeletonText lines={3} />
      </div>
   );
}

export function SkeletonTable({
   rows = 5,
   columns = 4,
}: {
   rows?: number;
   columns?: number;
}) {
   return (
      <div className="space-y-3">
         {/* Header */}
         <div
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
         >
            {Array.from({ length: columns }).map((_, i) => (
               <div key={i} className="h-4 bg-gray-600 rounded animate-pulse" />
            ))}
         </div>

         {/* Rows */}
         {Array.from({ length: rows }).map((_, rowIndex) => (
            <div
               key={rowIndex}
               className="grid gap-4"
               style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
            >
               {Array.from({ length: columns }).map((_, colIndex) => (
                  <div
                     key={colIndex}
                     className="h-4 bg-gray-700 rounded animate-pulse"
                  />
               ))}
            </div>
         ))}
      </div>
   );
}

export function SkeletonList({ items = 5 }: { items?: number }) {
   return (
      <div className="space-y-4">
         {Array.from({ length: items }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
               <div className="w-10 h-10 bg-gray-700 rounded animate-pulse" />
               <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-gray-700 rounded animate-pulse w-1/2" />
               </div>
            </div>
         ))}
      </div>
   );
}
