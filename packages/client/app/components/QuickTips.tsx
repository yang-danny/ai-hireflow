import React, { useState } from 'react';
import TipItem from './TipItem';
import {
   LightbulbIcon,
   CheckIcon,
   StarIcon,
   SearchIcon,
} from '../components/icons/icons';

const QuickTips = () => {
   const [activeTab, setActiveTab] = useState('tips');

   const tips = [
      {
         icon: <LightbulbIcon />,
         text: 'Tailor your resume for each job by using keywords from the description.',
      },
      {
         icon: <CheckIcon />,
         text: 'Quantify your achievements with numbers to show your impact.',
      },
      {
         icon: <StarIcon />,
         text: 'Use the STAR method (Situation, Task, Action, Result) for interview answers.',
      },
      {
         icon: <SearchIcon />,
         text: 'Research the company and interviewer before your interview.',
      },
   ];

   return (
      <div className="bg-[#1A1D2A] p-6 rounded-2xl h-full">
         <div className="flex border-b border-gray-700 mb-6">
            <button
               onClick={() => setActiveTab('tips')}
               className={`py-2 px-4 text-sm font-semibold transition-colors duration-200 ${activeTab === 'tips' ? 'text-white border-b-2 border-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
               Quick Tips
            </button>
            <button
               onClick={() => setActiveTab('outputs')}
               className={`py-2 px-4 text-sm font-semibold transition-colors duration-200 ${activeTab === 'outputs' ? 'text-white border-b-2 border-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
               Saved Outputs
            </button>
         </div>
         {activeTab === 'tips' ? (
            <div className="space-y-4">
               {tips.map((tip, index) => (
                  <TipItem key={index} icon={tip.icon} text={tip.text} />
               ))}
            </div>
         ) : (
            <div className="text-center text-gray-500 py-10">
               <p>No saved outputs yet.</p>
            </div>
         )}
      </div>
   );
};

export default QuickTips;
