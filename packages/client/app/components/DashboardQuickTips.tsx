import { useState } from 'react';
import { DashboardTipCard } from './DashboardTipCard';
import { LightbulbTipIcon } from './icons/icons';
import { CheckIcon } from './icons/icons';
import { StarTipIcon } from './icons/icons';
import { SearchTipIcon } from './icons/icons';

export function DashboardQuickTips() {
   const [activeTab, setActiveTab] = useState<'tips' | 'outputs'>('tips');

   const tips = [
      {
         icon: <LightbulbTipIcon width={16} height={16} color="#00c4cc" />,
         text: 'Tailor your resume for each job by using keywords from the description.',
      },
      {
         icon: <CheckIcon width={16} height={16} color="#00c4cc" />,
         text: 'Quantify your achievements with numbers to show your impact.',
      },
      {
         icon: <StarTipIcon width={16} height={16} color="#00c4cc" />,
         text: 'Use the STAR method (Situation, Task, Action, Result) for interview answers.',
      },
      {
         icon: <SearchTipIcon width={16} height={16} color="#00c4cc" />,
         text: 'Research the company and interviewer before your interview.',
      },
   ];

   return (
      <div className="bg-(--color-background-sidebar) backdrop-blur-xl rounded-2xl p-6 flex flex-col gap-6 h-full border-2 border-(--color-border)">
         {/* Tabs */}
         <div className="flex border-b border-(--color-border)">
            <button
               onClick={() => setActiveTab('tips')}
               className={`relative pb-3 px-4 text-sm font-bold transition-colors ${
                  activeTab === 'tips'
                     ? 'text-white'
                     : 'text-(--color-text-muted) hover:text-(--color-text-secondary)'
               }`}
            >
               Quick Tips
               {activeTab === 'tips' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-(--color-primary)" />
               )}
            </button>
            <button
               onClick={() => setActiveTab('outputs')}
               className={`relative pb-3 px-4 text-sm font-bold transition-colors ${
                  activeTab === 'outputs'
                     ? 'text-white'
                     : 'text-(--color-text-muted) hover:text-(--color-text-secondary)'
               }`}
            >
               Saved Outputs
               {activeTab === 'outputs' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-(--color-primary)" />
               )}
            </button>
         </div>

         {/* Content */}
         {activeTab === 'tips' ? (
            <div className="flex flex-col gap-4 ">
               {tips.map((tip, index) => (
                  <DashboardTipCard
                     key={index}
                     icon={tip.icon}
                     text={tip.text}
                  />
               ))}
            </div>
         ) : (
            <div className="flex items-center justify-center py-10 text-center">
               <p className="text-(--color-text-muted) text-sm">
                  No saved outputs yet.
               </p>
            </div>
         )}
      </div>
   );
}
