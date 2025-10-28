import { useState } from 'react';
import { IconButton } from './IconButton';

interface TipItem {
   id: string;
   icon: string;
   text: string;
}

export const QuickTipsSection = () => {
   const [activeTab, setActiveTab] = useState<'tips' | 'outputs'>('tips');

   const tips: TipItem[] = [
      {
         id: '1',
         icon: '/images/img_background_cyan_500.svg',
         text: 'Tailor your resume for\neach job by using\nkeywords from the\ndescription.',
      },
      {
         id: '2',
         icon: '/images/img_background_cyan_500_40x40.svg',
         text: 'Quantify your\nachievements with\nnumbers to show your\nimpact.',
      },
      {
         id: '3',
         icon: '/images/img_background_40x40.svg',
         text: 'Use the STAR method\n(Situation, Task, Action,\nResult) for interview\nanswers.',
      },
      {
         id: '4',
         icon: '/images/img_background_1.svg',
         text: 'Research the company and\ninterviewer before your\ninterview.',
      },
   ];

   return (
      <div className="w-full bg-sidebar-background rounded-lg p-4 sm:p-6">
         {/* Tab Navigation */}
         <div className="flex justify-center mb-6">
            <div className="flex">
               <button
                  onClick={() => setActiveTab('tips')}
                  className={`px-4 py-2 text-sm font-bold leading-tight transition-colors duration-200 ${
                     activeTab === 'tips'
                        ? 'text-text-primary border-b-2 border-cyan-500'
                        : 'text-text-secondary hover:text-text-tertiary'
                  }`}
               >
                  Quick Tips
               </button>
               <button
                  onClick={() => setActiveTab('outputs')}
                  className={`px-4 py-2 text-sm font-bold leading-tight transition-colors duration-200 ml-8 ${
                     activeTab === 'outputs'
                        ? 'text-text-primary border-b-2 border-cyan-500'
                        : 'text-text-secondary hover:text-text-tertiary'
                  }`}
               >
                  Saved Outputs
               </button>
            </div>
         </div>

         {/* Content */}
         {activeTab === 'tips' && (
            <div className="space-y-4">
               {tips.map((tip) => (
                  <div
                     key={tip.id}
                     className="bg-gradient-to-br from-cyan-500/30 to-purple-600/30 rounded-md p-4 hover:shadow-md transition-all duration-300"
                  >
                     <div className="bg-background-secondary rounded-md p-4 flex items-start gap-4">
                        <IconButton
                           src={tip.icon}
                           alt="Tip icon"
                           fillStyleCss="background=linear-gradient(135deg,#00c4cc33 0%, #00c4cc19 100%)"
                           borderStyleCss="border_radius=12px"
                           padding="6px"
                           className="w-10 h-10 flex-shrink-0"
                           iconSize="24"
                           onClick={() => {}}
                        />
                        <p className="text-sm font-normal leading-normal text-text-tertiary whitespace-pre-line">
                           {tip.text}
                        </p>
                     </div>
                  </div>
               ))}
            </div>
         )}

         {activeTab === 'outputs' && (
            <div className="text-center py-8">
               <p className="text-text-secondary">No saved outputs yet.</p>
            </div>
         )}
      </div>
   );
};
