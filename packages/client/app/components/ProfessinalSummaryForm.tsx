import React from 'react';
import { Sparkle } from 'lucide-react';
import type { Resume } from '../../types/resume.types';

interface ProfessinalSummaryFormProps {
   data: string;
   onChange: (value: string) => void;
   setResumeData: React.Dispatch<React.SetStateAction<Resume>>;
}

const ProfessinalSummaryForm: React.FC<ProfessinalSummaryFormProps> = ({
   data,
   onChange,
   setResumeData,
}) => {
   return (
      <div className="space-y-4">
         <div>
            <h3 className="flex items-center text-lg gap-2 font-semibold text-gray-900">
               Professional Summary
            </h3>
            <p className="text-sm text-gray-500">
               Briefly summarize your professional background and key skills.
            </p>
         </div>
         <button className="flex items-centergap-2 px-3 py-1  bg-purple-100 text-purple-700 rounded text-sm font-medium hover:bg-purple-200 transition-colors disabled:opacity-50">
            <Sparkle className="size-4" /> AI Enhance
         </button>
         <div className="mt-6">
            <textarea
               name="professional_summary"
               id="professional_summary"
               value={data || ''}
               rows={7}
               onChange={(e) => onChange(e.target.value)}
               className="w-full p-3 px-4 mt-2 border text-sm text-gray-500 border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
               placeholder="Write a professional summary that highlights your key strengths and career objectives..."
            />
            <p className="text-xs text-gray-500 max-w-4/5 mx-auto text-center">
               Tip: Keep it concise (3-4 sentences) and focus on your most
               relevant achievements and skills.
            </p>
         </div>
      </div>
   );
};

export default ProfessinalSummaryForm;
