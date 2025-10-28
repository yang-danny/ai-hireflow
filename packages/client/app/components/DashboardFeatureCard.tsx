import React from 'react';
import type { FeatureCardProps } from '../types/schema';

const DashboardFeatureCard: React.FC<FeatureCardProps> = ({
   icon,
   title,
   description,
   buttonText,
}) => {
   return (
      <div className="bg-gradient-to-br from-[#2A2D42] to-[#1A1D2A] p-6 rounded-2xl flex flex-col justify-between border border-gray-700/50 shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1 transition-all duration-300">
         <div>
            <div className="bg-cyan-500/10 p-3 rounded-lg w-12 h-12 mb-6 flex items-center justify-center text-cyan-400">
               {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-gray-400 mb-8 h-16">{description}</p>
         </div>
         <button className="bg-gradient-to-r from-cyan-400 to-teal-500 text-white font-bold py-3 px-6 rounded-xl w-full hover:shadow-lg hover:shadow-cyan-500/40 transition-shadow duration-300">
            {buttonText}
         </button>
      </div>
   );
};

export default DashboardFeatureCard;
