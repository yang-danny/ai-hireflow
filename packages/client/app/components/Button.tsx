interface ButtonProps {
   children: React.ReactNode;
   variant?: 'primary' | 'secondary' | 'outline';
   onClick?: () => void;
   href?: string;
   className?: string;
}

export function Button({
   children,
   variant = 'primary',
   onClick,
   href,
   className = '',
}: ButtonProps) {
   const baseStyles =
      'px-6 py-3 rounded-lg font-bold text-sm tracking-wide transition-all duration-200';

   const variantStyles = {
      primary:
         'bg-(--color-primary) text-white hover:bg-(--color-primary-dark)',
      secondary: 'bg-(--color-background-card) text-white hover:bg-opacity-80',
      outline:
         'border-2 border-(--color-primary) text-(--color-primary) hover:bg-(--color-primary) hover:text-white',
   };

   const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

   if (href) {
      return (
         <a href={href} className={combinedClassName}>
            {children}
         </a>
      );
   }

   return (
      <button onClick={onClick} className={combinedClassName}>
         {children}
      </button>
   );
}
