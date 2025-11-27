export function Spinner({
   size = 'md',
   className = '',
}: {
   size?: 'sm' | 'md' | 'lg';
   className?: string;
}) {
   const sizeClasses = {
      sm: 'w-4 h-4 border-2',
      md: 'w-8 h-8 border-3',
      lg: 'w-12 h-12 border-4',
   };

   return (
      <div
         className={`${sizeClasses[size]} border-t-primary border-gray-700 rounded-full animate-spin ${className}`}
         role="status"
         aria-label="Loading"
      >
         <span className="sr-only">Loading...</span>
      </div>
   );
}

export function LoadingButton({
   isLoading,
   children,
   disabled,
   ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { isLoading?: boolean }) {
   return (
      <button
         {...props}
         disabled={disabled || isLoading}
         className={`${props.className} relative`}
      >
         {isLoading && (
            <span className="absolute inset-0 flex items-center justify-center">
               <Spinner size="sm" />
            </span>
         )}
         <span className={isLoading ? 'invisible' : ''}>{children}</span>
      </button>
   );
}

export function LoadingOverlay({
   message = 'Loading...',
}: {
   message?: string;
}) {
   return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
         <div className="bg-(--color-background-card) rounded-lg p-8 flex flex-col items-center gap-4 min-w-[200px]">
            <Spinner size="lg" />
            <p className="text-(--color-text-primary) font-medium">{message}</p>
         </div>
      </div>
   );
}

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
   return (
      <div className="flex flex-col items-center justify-center p-12 gap-4">
         <Spinner size="lg" />
         <p className="text-(--color-text-secondary)">{message}</p>
      </div>
   );
}
