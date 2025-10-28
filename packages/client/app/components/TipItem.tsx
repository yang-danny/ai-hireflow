import React from 'react';
import type { TipItemProps } from '../types/schema';

const TipItem: React.FC<TipItemProps> = ({ icon, text }) => {
   return (
      <div className="flex items-start space-x-4 p-4 bg-[#2A2D42] rounded-lg border border-transparent hover:border-cyan-500/30 transition-colors duration-200">
         <div className="bg-cyan-500/10 p-2 rounded-full flex-shrink-0 mt-1">
            {icon}
         </div>
         <p className="text-sm text-gray-300">{text}</p>
      </div>
   );
};

export default TipItem;
