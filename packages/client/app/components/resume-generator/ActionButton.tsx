import type { ReactNode } from 'react';

interface ActionButtonProps {
   icon: ReactNode;
   label: string;
   onClick?: () => void;
   variant?: 'primary' | 'secondary' | 'ai-enhance';
   className?: string;
}

export function ActionButton({
   icon,
   label,
   onClick,
   variant = 'secondary',
   className = '',
}: ActionButtonProps) {
   const baseClasses =
      'flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm tracking-wide transition-all';

   const variantClasses = {
      primary:
         'bg-(--color-primary) text-white hover:bg-(--color-primary-dark) shadow-[0px_2px_4px_rgba(0,0,0,0.1),0px_4px_6px_rgba(0,0,0,0.1)]',
      secondary: 'bg-(--color-form-input-bg) text-white hover:bg-white/10',
      'ai-enhance': 'gradient-ai-enhance text-white hover:opacity-90',
   };

   return (
      <button
         onClick={onClick}
         className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      >
         <div className="flex-shrink-0">{icon}</div>
         <span>{label}</span>
      </button>
   );
}
