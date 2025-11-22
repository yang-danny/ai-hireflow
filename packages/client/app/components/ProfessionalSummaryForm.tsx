import React, { useState, useEffect } from 'react';
import { Sparkle, WandSparkles } from 'lucide-react';
import type { Resume } from '../../types/resume.types';
import { enhanceProfessionalSummary } from '../utils/AI';

interface ProfessionalSummaryFormProps {
   data: string;
   onChange: (value: string) => void;
}

const ProfessionalSummaryForm: React.FC<ProfessionalSummaryFormProps> = ({
   data,
   onChange,
}) => {
   const [summary, setSummary] = useState<string>(data);
   useEffect(() => {
      setSummary(data);
   }, [data]);
   const [error, setError] = useState<string>('');
   const [isProcessing, setIsProcessing] = useState(false);
   const [progress, setProgress] = useState('');
   const handleAIEnhance = async () => {
      if (!summary) {
         setError('Please enter a professional summary to enhance.');
         return;
      }
      setError('');
      setIsProcessing(true);
      setProgress('Ehanceing professional summary...');
      try {
         const enhanceSummary = await enhanceProfessionalSummary(summary);
         setSummary(enhanceSummary);
         onChange(enhanceSummary);
         setIsProcessing(false);
         setProgress('');
         console.log(enhanceSummary);
      } catch (err: any) {
         setError(
            err.message ||
               'Failed to enhance professional summary. Please try again.'
         );
         setProgress('');
      } finally {
         setIsProcessing(false);
      }
   };
   return (
      <div className="space-y-4">
         <div>
            <h3 className="flex items-center text-lg gap-2 font-semibold text-gray-200">
               Professional Summary
            </h3>
            <p className="text-sm text-gray-300">
               Briefly summarize your professional background and key skills.
            </p>
         </div>
         <button
            onClick={() => handleAIEnhance()}
            disabled={isProcessing}
            className="flex items-center gap-1 text-sm font-bold border-2 px-2 py-2 rounded-lg text-(--color-primary) hover:cursor-pointer hover:text-purple-600 transition-colors disabled:opacity-50"
         >
            {isProcessing ? (
               <>
                  <div className="animate-spin text-sm rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500"></div>
                  <p className="text-sm ">Enhancing...</p>
               </>
            ) : (
               <>
                  <WandSparkles className="size-6" /> Enhance with AI
               </>
            )}
         </button>
         <div className="mt-6">
            {/* Error */}
            {error && (
               <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                  <p className="text-red-400 text-sm">{error}</p>
               </div>
            )}

            <textarea
               name="professional_summary"
               id="professional_summary"
               value={summary || ''}
               rows={7}
               onChange={(e) => {
                  setSummary(e.target.value);
                  onChange(e.target.value);
               }}
               className="w-full p-3 px-4 mt-2 border text-sm text-gray-600 border-gray-600 rounded-lg focus:ring focus:ring-(--color-primary) focus:border-(--color-primary) outline-none transition-colors resize-none"
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

export default ProfessionalSummaryForm;
