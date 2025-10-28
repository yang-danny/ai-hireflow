import React from 'react';
import { twMerge } from 'tailwind-merge';

interface MenuItemProps {
   icon: string;
   text: string;
   isActive?: boolean;
   onClick?: () => void;
   className?: string;
}

const MenuItem = ({
   icon,
   text,
   isActive = false,
   onClick,
   className = '',
}: MenuItemProps) => {
   return (
      <button
         onClick={onClick}
         className={twMerge(
            'flex items-center w-full p-xs rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500',
            isActive
               ? 'bg-background-accent text-text-primary'
               : 'hover:bg-background-accent text-menu-text',
            className
         )}
         role="menuitem"
      >
         <img src={icon} alt="" className="w-6 h-7 ml-sm flex-shrink-0" />
         <span className="ml-lg text-sm font-medium leading-tight whitespace-pre-line text-left">
            {text}
         </span>
      </button>
   );
};

export default MenuItem;
