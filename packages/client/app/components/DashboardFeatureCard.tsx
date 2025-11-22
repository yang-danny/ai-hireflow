interface DashboardFeatureCardProps {
   icon: React.ReactNode;
   title: string;
   description: string;
   buttonText: string;
   onClick?: () => void;
}

export function DashboardFeatureCard({
   icon,
   title,
   description,
   buttonText,
   onClick,
}: DashboardFeatureCardProps) {
   return (
      <div className="cussor-pointer bg-(--color-background-card) rounded-[20px] border-2 border-(--color-border) p-8 hover:border-(--color-primary) hover:shadow-[var(--shadow-card-highlighted)] transition-all duration-500 hover:translate-y-[-4px]">
         {/* Content */}
         <div className="relative z-10 flex flex-col gap-3">
            {/* Icon */}
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center ">
               {icon}
            </div>

            {/* Text Content */}
            <div className="flex flex-col gap-2">
               <h3 className="text-lg font-semibold text-white">{title}</h3>
               <p className="text-sm text-text-muted leading-snug">
                  {description}
               </p>
            </div>

            {/* Button */}
            <button
               onClick={onClick}
               className="w-full py-2 px-6 bg-primary text-white text-base font-bold rounded-xl hover:bg-primary-dark transition-colors cursor-pointer"
            >
               {buttonText}
            </button>
         </div>
      </div>
   );
}
