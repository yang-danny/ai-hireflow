import { useState } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import type { AnalysisResult } from '../utils/AI';

interface AnalyseResultProps {
   result: AnalysisResult;
   onNewAnalysis?: () => void;
}

interface CircularProgressProps {
   score: number;
   size?: number;
   strokeWidth?: number;
   label?: string;
}

function CircularProgress({
   score,
   size = 96,
   strokeWidth = 8,
   label,
}: CircularProgressProps) {
   const radius = (size - strokeWidth) / 2;
   const circumference = 2 * Math.PI * radius;
   const offset = circumference * (1 - score / 100);

   return (
      <div className="flex flex-col items-center gap-1 bg-(--color-background-card) border border-gray-600 rounded-xl px-6 py-4">
         <div className="relative" style={{ width: size, height: size }}>
            <svg className="transform -rotate-90" width={size} height={size}>
               <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  fill="none"
                  className="text-(--color-analyzer-input-bg)"
               />
               <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  className="text-(--color-primary)"
                  strokeLinecap="round"
               />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
               <span className="text-white text-2xl font-bold">{score}%</span>
            </div>
         </div>
         {label && (
            <span className="text-(--color-analyzer-label) text-sm">
               {label}
            </span>
         )}
      </div>
   );
}

interface FeedbackItemProps {
   category: string;
   score: number;
   feedback: string;
   isOpen: boolean;
   onToggle: () => void;
}

function FeedbackItem({
   category,
   score,
   feedback,
   isOpen,
   onToggle,
}: FeedbackItemProps) {
   return (
      <div>
         <button
            onClick={onToggle}
            className="w-full flex items-center justify-between py-3 text-left hover:opacity-80 transition-opacity"
         >
            <span className="text-white font-semibold">
               {category} ({score}%)
            </span>
            {isOpen ? (
               <ChevronUp className="w-5 h-5 text-white" />
            ) : (
               <ChevronDown className="w-5 h-5 text-white" />
            )}
         </button>
         {isOpen && (
            <div className="pb-4 flex flex-col gap-2">
               <p className="text-sm text-(--color-score-text) leading-relaxed whitespace-pre-wrap">
                  {feedback}
               </p>
            </div>
         )}
      </div>
   );
}

export default function AnalyseResult({
   result,
   onNewAnalysis,
}: AnalyseResultProps) {
   const [openFeedback, setOpenFeedback] = useState<string>('tone');

   const toggleFeedback = (category: string) => {
      setOpenFeedback(openFeedback === category ? '' : category);
   };

   return (
      <div className="flex-1">
         <div className="bg-(--color-background-card) border border-(--color-analyzer-border) rounded-xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
               <h2 className="text-white text-2xl font-bold">
                  Resume Analysis Result
               </h2>
               {onNewAnalysis && (
                  <button
                     onClick={onNewAnalysis}
                     className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-(--color-primary) border border-(--color-primary) rounded-lg hover:bg-(--color-primary)/10 transition-colors"
                  >
                     <RotateCcw className="w-4 h-4" />
                     New Analysis
                  </button>
               )}
            </div>

            {/* Summary Section */}
            <div className="bg-(--color-analyzer-overlay) border border-(--color-analyzer-summary-border) rounded-xl p-4 flex flex-col gap-4">
               <h3 className="text-white text-lg font-bold">Summary</h3>
               <div className="grid grid-cols-4 gap-4">
                  <div className="flex justify-center col-span-4">
                     <CircularProgress
                        score={result.overallScore}
                        label="Overall Score"
                        size={120}
                        strokeWidth={10}
                     />
                  </div>
                  <div className="col-span-4 gap-4 flex justify-center">
                     <div className="flex justify-center">
                        <CircularProgress
                           score={result.structure.score}
                           label="Structure"
                        />
                     </div>
                     <div className="flex justify-center">
                        <CircularProgress
                           score={result.toneAndStyle.score}
                           label="Tone & Style"
                        />
                     </div>
                     <div className="flex justify-center">
                        <CircularProgress
                           score={result.skills.score}
                           label="Skills"
                        />
                     </div>
                     <div className="flex justify-center">
                        <CircularProgress
                           score={result.content.score}
                           label="Content"
                        />
                     </div>
                  </div>
               </div>
            </div>

            {/* ATS Optimization */}
            <div className="bg-(--color-analyzer-overlay) rounded-xl p-6 flex flex-col gap-4">
               <h3 className="text-white text-lg font-bold">
                  ATS Optimization
               </h3>
               <div className="flex gap-6">
                  {/* Circular Progress */}
                  <div className="">
                     <CircularProgress
                        score={result.atsScore}
                        label="ATS Score"
                     />
                  </div>

                  {/* Suggestions */}
                  <div className="flex-1 flex flex-col gap-2">
                     <h4 className="text-white text-base font-semibold">
                        Suggestions
                     </h4>
                     <ul className="flex flex-col gap-1">
                        {result.atsSuggestions.map((suggestion, index) => (
                           <li
                              key={index}
                              className="flex gap-3 text-sm text-(--color-score-text)"
                           >
                              <span className="text-(--color-primary)">•</span>
                              <span>{suggestion}</span>
                           </li>
                        ))}
                     </ul>
                  </div>
               </div>
            </div>

            {/* Details of Feedback */}
            <div className="flex flex-col gap-3">
               <h3 className="text-white text-lg font-bold">
                  Details of feedback
               </h3>

               <div className="flex flex-col gap-3">
                  {/* Tone & Style */}
                  <div className="bg-(--color-analyzer-overlay) rounded-xl px-4">
                     <FeedbackItem
                        category="Tone & Style"
                        score={result.toneAndStyle.score}
                        feedback={result.toneAndStyle.feedback}
                        isOpen={openFeedback === 'tone'}
                        onToggle={() => toggleFeedback('tone')}
                     />
                  </div>

                  {/* Content */}
                  <div className="bg-(--color-analyzer-overlay) rounded-xl px-4">
                     <FeedbackItem
                        category="Content"
                        score={result.content.score}
                        feedback={result.content.feedback}
                        isOpen={openFeedback === 'content'}
                        onToggle={() => toggleFeedback('content')}
                     />
                  </div>

                  {/* Structure */}
                  <div className="bg-(--color-analyzer-overlay) rounded-xl px-4">
                     <FeedbackItem
                        category="Structure"
                        score={result.structure.score}
                        feedback={result.structure.feedback}
                        isOpen={openFeedback === 'structure'}
                        onToggle={() => toggleFeedback('structure')}
                     />
                  </div>

                  {/* Skills */}
                  <div className="bg-(--color-analyzer-overlay) rounded-xl px-4">
                     <FeedbackItem
                        category="Skills"
                        score={result.skills.score}
                        feedback={result.skills.feedback}
                        isOpen={openFeedback === 'skills'}
                        onToggle={() => toggleFeedback('skills')}
                     />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
