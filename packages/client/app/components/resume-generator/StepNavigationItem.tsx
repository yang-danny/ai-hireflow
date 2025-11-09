import type { ReactNode } from 'react';

interface StepNavigationItemProps {
   icon: ReactNode;
   label: string;
   isActive: boolean;
   onClick?: () => void;
}

export function StepNavigationItem({
   icon,
   label,
   isActive,
   onClick,
}: StepNavigationItemProps) {
   return (
      <button
         onClick={onClick}
         className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            isActive
               ? 'bg-(--color-step-active-bg) border border-(--color-step-active-border)'
               : 'border border-transparent hover:bg-white/5'
         }`}
      >
         <div
            className={`flex-shrink-0 ${
               isActive
                  ? 'text-(--color-primary)'
                  : 'text-(--color-step-inactive)'
            }`}
         >
            {icon}
         </div>
         <span
            className={`text-sm font-medium ${
               isActive ? 'text-white' : 'text-(--color-step-inactive)'
            }`}
         >
            {label}
         </span>
      </button>
   );
}
