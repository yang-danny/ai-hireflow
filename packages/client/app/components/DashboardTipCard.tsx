interface DashboardTipCardProps {
   icon: React.ReactNode;
   text: string;
}

export function DashboardTipCard({ icon, text }: DashboardTipCardProps) {
   return (
      <div className="relative flex items-start gap-4 p-4 rounded-xl overflow-hidden border-1 border-(--color-primary)">
         {/* Gradient Background */}
         <div className="absolute inset-0 gradient-card-bg" />

         {/* Inner Background */}
         <div className="absolute inset-0 bg-(--color-background-card-inner)" />

         {/* Content */}
         <div className="relative z-10 flex items-start gap-4 w-full">
            <div className="w-4 h-4 flex-shrink-0 mt-0.5">{icon}</div>
            <p className="text-sm text-(--color-text-secondary) leading-5 flex-1">
               {text}
            </p>
         </div>
      </div>
   );
}
