import { twMerge } from 'tailwind-merge';

interface IconButtonProps {
   src: string;
   alt?: string;
   fillStyleCss?: string;
   borderStyleCss?: string;
   padding?: string;
   className?: string;
   iconSize?: string;
   onClick?: () => void;
}

export const IconButton = ({
   src,
   alt = 'Icon',
   fillStyleCss = '',
   borderStyleCss = '',
   padding = '6px',
   className = '',
   iconSize = '24',
   onClick,
}: IconButtonProps) => {
   // Parse fillStyleCss
   const getBackgroundClass = (fillStyle: string) => {
      if (fillStyle.includes('linear-gradient')) {
         return 'bg-gradient-to-br from-cyan-500 to-cyan-600';
      }
      if (fillStyle.includes('#ffffff19')) {
         return 'bg-background-accent';
      }
      if (fillStyle.includes('#00c4cc')) {
         return 'bg-gradient-to-br from-cyan-500 to-cyan-600';
      }
      return fillStyle ? `bg-[${fillStyle.split('=')[1]}]` : '';
   };

   // Parse borderStyleCss
   const getBorderClass = (borderStyle: string) => {
      if (borderStyle.includes('border_radius=20px')) {
         return 'rounded-xl';
      }
      if (borderStyle.includes('border_radius=12px')) {
         return 'rounded-md';
      }
      return borderStyle ? `rounded-[${borderStyle.split('=')[1]}]` : '';
   };

   // Parse padding
   const getPaddingClass = (paddingValue: string) => {
      return `p-[${paddingValue}]`;
   };

   const backgroundClass = getBackgroundClass(fillStyleCss);
   const borderClass = getBorderClass(borderStyleCss);
   const paddingClass = getPaddingClass(padding);

   return (
      <button
         onClick={onClick}
         className={twMerge(
            'inline-flex items-center justify-center transition-all duration-200 hover:opacity-90 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500',
            backgroundClass,
            borderClass,
            paddingClass,
            className
         )}
         aria-label={alt}
      >
         <img
            src={src}
            alt={alt}
            className={`w-[${iconSize}px] h-[${iconSize}px] object-contain`}
         />
      </button>
   );
};
