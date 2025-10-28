import React from 'react';
import { IconButton } from './IconButton';
import { Button } from './Button';

interface ServiceCardProps {
   icon: string;
   title: string;
   description: string;
   buttonText: string;
   onButtonClick?: () => void;
}

export const ServiceCard = ({
   icon,
   title,
   description,
   buttonText,
   onButtonClick,
}: ServiceCardProps) => {
   return (
      <div className="w-full bg-gradient-to-br from-cyan-500/30 to-purple-600/30 rounded-lg p-6 sm:p-8 shadow-[0px_4px_6px_#00000019] hover:shadow-lg transition-all duration-300">
         {/* Icon */}
         <div className="mb-6">
            <IconButton
               src={icon}
               alt={title}
               fillStyleCss="background=linear-gradient(135deg,#00c4cc 0%, #00aab5 100%)"
               borderStyleCss="border_radius=12px"
               padding="6px"
               className="w-14 h-14"
               iconSize="32"
               onClick={() => {}}
            />
         </div>

         {/* Content */}
         <div className="mb-6">
            <h3 className="text-lg sm:text-lg font-semibold leading-loose text-text-primary mb-2">
               {title}
            </h3>
            <p className="text-base font-normal leading-relaxed text-text-secondary">
               {description}
            </p>
         </div>

         {/* Button */}
         <Button
            text={buttonText}
            text_font_size="16"
            text_font_weight="700"
            text_line_height="20px"
            text_color="#ffffff"
            fill_background="linear-gradient(90deg,#00c4cc 0%, #00aab5 100%)"
            border_border_radius="12px"
            layout_width="100%"
            padding="12px 34px"
            onClick={onButtonClick}
            className="w-full"
            position="relative"
            variant="primary"
            size="medium"
         />
      </div>
   );
};
