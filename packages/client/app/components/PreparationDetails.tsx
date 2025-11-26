import { useState, type ReactNode } from 'react';
import {
   Calendar,
   Building2,
   Wrench,
   Target,
   CheckCircle2,
   ChevronDown,
   ChevronUp,
   Mic,
   MicOff,
   ArrowLeft,
   Send,
   Sparkles,
   MessageCircleQuestionMark,
   MessagesSquare,
   Play,
   RotateCcw,
   ArrowBigRight,
   ArrowRightToLine,
   ArrowRightFromLine,
} from 'lucide-react';
import type {
   InterviewPreparationResult,
   InterviewAnalytics,
} from '../utils/AI';
import { generateInterviewAnalytics } from '../utils/AI';

// Helper function to parse markdown-like text and convert to React elements
function parseMarkdownText(text: string): ReactNode[] {
   const lines = text.split('\n');
   const elements: ReactNode[] = [];

   lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Skip empty lines
      if (!trimmedLine) {
         return;
      }

      // Check if line is a bullet point
      const isBullet =
         trimmedLine.startsWith('*') || trimmedLine.startsWith('-');

      if (isBullet) {
         // Remove the bullet character and trim
         const content = trimmedLine.substring(1).trim();
         const parsedContent = parseBoldText(content);

         elements.push(
            <li key={index} className="flex items-start gap-2 ml-4">
               <span className="text-(--color-primary) mt-1">•</span>
               <span className="flex-1">{parsedContent}</span>
            </li>
         );
      } else {
         // Regular paragraph
         const parsedContent = parseBoldText(trimmedLine);
         elements.push(
            <p key={index} className="mb-2">
               {parsedContent}
            </p>
         );
      }
   });

   return elements;
}

// Helper function to parse bold text (**text** or *text*)
function parseBoldText(text: string): (string | ReactNode)[] {
   const parts: (string | ReactNode)[] = [];
   let current = '';
   let i = 0;

   while (i < text.length) {
      // Check for **bold**
      if (text[i] === '*' && text[i + 1] === '*') {
         // Save current text
         if (current) {
            parts.push(current);
            current = '';
         }

         // Find closing **
         i += 2;
         let boldText = '';
         while (i < text.length && !(text[i] === '*' && text[i + 1] === '*')) {
            boldText += text[i];
            i++;
         }

         if (boldText) {
            parts.push(
               <strong key={parts.length} className="font-bold text-white">
                  {boldText}
               </strong>
            );
         }

         i += 2; // Skip closing **
      }
      // Check for *bold* (only if not already in **)
      else if (text[i] === '*' && text[i + 1] !== '*') {
         // Save current text
         if (current) {
            parts.push(current);
            current = '';
         }

         // Find closing *
         i += 1;
         let boldText = '';
         while (i < text.length && text[i] !== '*') {
            boldText += text[i];
            i++;
         }

         if (boldText) {
            parts.push(
               <strong key={parts.length} className="font-bold text-white">
                  {boldText}
               </strong>
            );
         }

         i += 1; // Skip closing *
      } else {
         current += text[i];
         i++;
      }
   }

   if (current) {
      parts.push(current);
   }

   return parts;
}

interface PreparationDetailsProps {
   preparationResult: InterviewPreparationResult;
   jobTitle: string;
   onNewPreparation: () => void;
}

type TabType = 'preparation' | 'questions' | 'practice';

export default function PreparationDetails({
   preparationResult,
   jobTitle,
   onNewPreparation,
}: PreparationDetailsProps) {
   const [activeTab, setActiveTab] = useState<TabType>('preparation');

   return (
      <div className="bg-(--color-background-dark) pr-2">
         <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
               <h3 className="text-gray-400 text-base font-medium">
                  Interview Preparation
               </h3>
               <button
                  onClick={onNewPreparation}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-(--color-primary) border border-(--color-primary) rounded-lg hover:bg-(--color-primary)/10 transition-colors"
               >
                  <RotateCcw className="w-4 h-4" />
                  New Preparation
               </button>
            </div>

            {/* Tab Navigation */}
            <div className="bg-(--color-background-card) rounded-xl overflow-hidden mb-6">
               <div className="flex border-b border-gray-700">
                  <button
                     onClick={() => setActiveTab('preparation')}
                     className={`flex-1 px-6 py-4 text-sm font-bold transition-all cursor-pointer ${
                        activeTab === 'preparation'
                           ? 'bg-(--color-primary)/10 text-(--color-primary) border-b-2 border-(--color-primary)'
                           : 'text-gray-400 hover:text-white hover:bg-(--color-input-bg)'
                     }`}
                  >
                     <div className="flex items-center justify-center gap-2">
                        <Calendar className="size-5" />
                        Preparation Plan
                     </div>
                  </button>
                  <button
                     onClick={() => setActiveTab('questions')}
                     className={`flex-1 px-6 py-4 text-sm font-bold transition-all cursor-pointer ${
                        activeTab === 'questions'
                           ? 'bg-(--color-primary)/10 text-(--color-primary) border-b-2 border-(--color-primary)'
                           : 'text-gray-400 hover:text-white hover:bg-(--color-input-bg)'
                     }`}
                  >
                     <div className="flex items-center justify-center gap-2">
                        <MessageCircleQuestionMark className="size-5" />
                        Mock Questions
                     </div>
                  </button>
                  <button
                     onClick={() => setActiveTab('practice')}
                     className={`flex-1 px-6 py-4 text-sm font-bold transition-all cursor-pointer ${
                        activeTab === 'practice'
                           ? 'bg-(--color-primary)/10 text-(--color-primary) border-b-2 border-(--color-primary)'
                           : 'text-gray-400 hover:text-white hover:bg-(--color-input-bg)'
                     }`}
                  >
                     <div className="flex items-center justify-center gap-2">
                        <MessagesSquare className="size-5" />
                        Interview Practice
                     </div>
                  </button>
               </div>

               {/* Tab Content */}
               <div className="p-6">
                  {activeTab === 'preparation' && (
                     <PreparationPlanTab
                        plan={preparationResult.preparationPlan}
                     />
                  )}
                  {activeTab === 'questions' && (
                     <MockQuestionsTab
                        questions={preparationResult.mockQuestions}
                     />
                  )}
                  {activeTab === 'practice' && (
                     <InterviewPracticeTab
                        questions={preparationResult.mockQuestions}
                        jobTitle={jobTitle}
                     />
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}

// Preparation Plan Tab Component
function PreparationPlanTab({
   plan,
}: {
   plan: InterviewPreparationResult['preparationPlan'];
}) {
   return (
      <div className="space-y-6">
         {/* Timeline */}
         <div className="bg-(--color-input-bg) rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
               <Calendar className="size-6 text-(--color-primary)" />
               <h3 className="text-xl font-bold text-white">
                  Preparation Timeline
               </h3>
            </div>
            <div className="text-gray-300 leading-relaxed space-y-2">
               {parseMarkdownText(plan.timeline)}
            </div>
         </div>

         {/* Employer Research */}
         <div className="bg-(--color-input-bg) rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
               <Building2 className="size-6 text-(--color-primary)" />
               <h3 className="text-xl font-bold text-white">
                  Research Employer & Interviewer
               </h3>
            </div>
            <div className="text-gray-300 leading-relaxed space-y-2">
               {parseMarkdownText(plan.employerResearch)}
            </div>
         </div>

         {/* Technical Resources */}
         <div className="bg-(--color-input-bg) rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
               <Wrench className="size-6 text-(--color-primary)" />
               <h3 className="text-xl font-bold text-white">
                  Technical Resources & Tools
               </h3>
            </div>
            <ul className="space-y-3">
               {plan.technicalResources.map((resource, index) => (
                  <li
                     key={index}
                     className="flex items-start gap-3 text-gray-300"
                  >
                     <CheckCircle2 className="size-5 text-(--color-primary) mt-0.5 flex-shrink-0" />
                     <div className="leading-relaxed">
                        <div className="font-medium text-white">
                           {resource.name}
                        </div>
                        <div className="text-sm text-gray-400">
                           {resource.description}
                        </div>
                        {resource.url && (
                           <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-(--color-primary) hover:underline inline-flex items-center gap-1 mt-1"
                           >
                              Visit Resource →
                           </a>
                        )}
                     </div>
                  </li>
               ))}
            </ul>
         </div>

         {/* Skill Alignment */}
         <div className="bg-(--color-input-bg) rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
               <Target className="size-6 text-(--color-primary)" />
               <h3 className="text-xl font-bold text-white">
                  Align Skills & Experiences
               </h3>
            </div>
            <div className="text-gray-300 leading-relaxed space-y-2">
               {parseMarkdownText(plan.skillAlignment)}
            </div>
         </div>

         {/* Practice and Final Prep */}
         <div className="bg-(--color-input-bg) rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
               <Sparkles className="size-6 text-(--color-primary)" />
               <h3 className="text-xl font-bold text-white">
                  Practice & Final Prep
               </h3>
            </div>
            <div className="text-gray-300 leading-relaxed space-y-2">
               {parseMarkdownText(plan.practiceAndFinalPrep)}
            </div>
         </div>
      </div>
   );
}

// Mock Questions Tab Component
function MockQuestionsTab({
   questions,
}: {
   questions: InterviewPreparationResult['mockQuestions'];
}) {
   const [expandedSection, setExpandedSection] = useState<string | null>(
      'technical'
   );

   const toggleSection = (section: string) => {
      setExpandedSection(expandedSection === section ? null : section);
   };

   return (
      <div className="space-y-4">
         {/* Technical Questions */}
         <div className="bg-(--color-input-bg) rounded-lg overflow-hidden">
            <button
               onClick={() => toggleSection('technical')}
               className="w-full flex items-center justify-between p-6 hover:bg-(--color-background-card) transition-colors"
            >
               <h3 className="text-xl font-bold text-white">
                  Technical Questions ({questions.technicalQuestions.length})
               </h3>
               {expandedSection === 'technical' ? (
                  <ChevronUp className="size-6 text-(--color-primary)" />
               ) : (
                  <ChevronDown className="size-6 text-gray-400" />
               )}
            </button>
            {expandedSection === 'technical' && (
               <div className="px-6 pb-6 space-y-4">
                  {questions.technicalQuestions.map((question, index) => (
                     <div
                        key={index}
                        className="bg-(--color-background-card) rounded-lg p-4 border border-gray-700"
                     >
                        <div className="flex gap-3">
                           <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-(--color-primary)/20 text-(--color-primary) font-bold text-sm">
                              {index + 1}
                           </span>
                           <p className="text-gray-200 leading-relaxed pt-1">
                              {question}
                           </p>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>

         {/* Behavioral Questions */}
         <div className="bg-(--color-input-bg) rounded-lg overflow-hidden">
            <button
               onClick={() => toggleSection('behavioral')}
               className="w-full flex items-center justify-between p-6 hover:bg-(--color-background-card) transition-colors"
            >
               <h3 className="text-xl font-bold text-white">
                  Behavioral Questions ({questions.behavioralQuestions.length})
               </h3>
               {expandedSection === 'behavioral' ? (
                  <ChevronUp className="size-6 text-(--color-primary)" />
               ) : (
                  <ChevronDown className="size-6 text-gray-400" />
               )}
            </button>
            {expandedSection === 'behavioral' && (
               <div className="px-6 pb-6 space-y-4">
                  {questions.behavioralQuestions.map((question, index) => (
                     <div
                        key={index}
                        className="bg-(--color-background-card) rounded-lg p-4 border border-gray-700"
                     >
                        <div className="flex gap-3">
                           <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-(--color-primary)/20 text-(--color-primary) font-bold text-sm">
                              {index + 1}
                           </span>
                           <p className="text-gray-200 leading-relaxed pt-1">
                              {question}
                           </p>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>

         {/* Questions to Ask Interviewer */}
         <div className="bg-(--color-input-bg) rounded-lg overflow-hidden">
            <button
               onClick={() => toggleSection('toAsk')}
               className="w-full flex items-center justify-between p-6 hover:bg-(--color-background-card) transition-colors"
            >
               <h3 className="text-xl font-bold text-white">
                  Questions to Ask Interviewer (
                  {questions.questionsToAsk.length})
               </h3>
               {expandedSection === 'toAsk' ? (
                  <ChevronUp className="size-6 text-(--color-primary)" />
               ) : (
                  <ChevronDown className="size-6 text-gray-400" />
               )}
            </button>
            {expandedSection === 'toAsk' && (
               <div className="px-6 pb-6 space-y-4">
                  {questions.questionsToAsk.map((question, index) => (
                     <div
                        key={index}
                        className="bg-(--color-background-card) rounded-lg p-4 border border-gray-700"
                     >
                        <div className="flex gap-3">
                           <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-(--color-primary)/20 text-(--color-primary) font-bold text-sm">
                              {index + 1}
                           </span>
                           <p className="text-gray-200 leading-relaxed pt-1">
                              {question}
                           </p>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>
      </div>
   );
}

// Interview Practice Tab Component
function InterviewPracticeTab({
   questions,
   jobTitle,
}: {
   questions: InterviewPreparationResult['mockQuestions'];
   jobTitle: string;
}) {
   const [isStarted, setIsStarted] = useState(false);
   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
   const [answers, setAnswers] = useState<string[]>([]);
   const [currentAnswer, setCurrentAnswer] = useState('');
   const [isRecording, setIsRecording] = useState(false);
   const [analytics, setAnalytics] = useState<InterviewAnalytics | null>(null);
   const [isGeneratingAnalytics, setIsGeneratingAnalytics] = useState(false);

   // Combine all questions for the practice session
   const allQuestions = [
      ...questions.technicalQuestions,
      ...questions.behavioralQuestions,
   ];

   const handleStart = () => {
      setIsStarted(true);
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setCurrentAnswer('');
      setAnalytics(null);
   };

   const handleNextQuestion = () => {
      // Save current answer
      const newAnswers = [...answers, currentAnswer];
      setAnswers(newAnswers);
      setCurrentAnswer('');

      // Check if we're done
      if (currentQuestionIndex < allQuestions.length - 1) {
         setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
         // Generate analytics
         handleFinishInterview(newAnswers);
      }
   };

   const handleFinishInterview = async (finalAnswers: string[]) => {
      setIsGeneratingAnalytics(true);
      try {
         const analyticsResult = await generateInterviewAnalytics(
            allQuestions,
            finalAnswers,
            jobTitle
         );
         setAnalytics(analyticsResult);
      } catch (error) {
         console.error('Failed to generate analytics:', error);
         alert('Failed to generate analytics. Please try again.');
      } finally {
         setIsGeneratingAnalytics(false);
      }
   };

   const handleVoiceToggle = () => {
      if (!isRecording) {
         // Start voice recording
         if ('webkitSpeechRecognition' in window) {
            const recognition = new (window as any).webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;

            recognition.onresult = (event: any) => {
               const transcript = Array.from(event.results)
                  .map((result: any) => result[0])
                  .map((result) => result.transcript)
                  .join('');
               setCurrentAnswer(transcript);
            };

            recognition.start();
            setIsRecording(true);

            // Store recognition instance
            (window as any).currentRecognition = recognition;
         } else {
            alert(
               'Speech recognition is not supported in your browser. Please use text input instead.'
            );
         }
      } else {
         // Stop voice recording
         if ((window as any).currentRecognition) {
            (window as any).currentRecognition.stop();
         }
         setIsRecording(false);
      }
   };

   // Show analytics if available
   if (analytics) {
      return <InterviewAnalyticsDisplay analytics={analytics} />;
   }

   // Show loading state while generating analytics
   if (isGeneratingAnalytics) {
      return (
         <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-(--color-primary) mb-4"></div>
            <p className="text-white text-lg font-medium">
               Analyzing your interview performance...
            </p>
            <p className="text-gray-400 text-sm mt-2">This may take a moment</p>
         </div>
      );
   }

   // Show start screen
   if (!isStarted) {
      return (
         <div className="text-center py-12">
            <MessagesSquare className="size-20 text-(--color-primary) mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">
               AI Mock Interview Practice
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
               Practice answering interview questions with our AI interviewer.
               You'll be asked {allQuestions.length} questions (technical and
               behavioral). After completing all questions, you'll receive
               detailed analytics on your performance.
            </p>
            <div className="bg-(--color-input-bg) rounded-lg p-6 max-w-2xl mx-auto mb-8">
               <h3 className="text-white font-bold mb-3">How it works:</h3>
               <ul className="text-left text-gray-300 space-y-2">
                  <li className="flex items-start gap-2">
                     <CheckCircle2 className="size-5 text-(--color-primary) mt-0.5 flex-shrink-0" />
                     <span>One question will be displayed at a time</span>
                  </li>
                  <li className="flex items-start gap-2">
                     <CheckCircle2 className="size-5 text-(--color-primary) mt-0.5 flex-shrink-0" />
                     <span>
                        Type your answer or use voice input (if supported)
                     </span>
                  </li>
                  <li className="flex items-start gap-2">
                     <CheckCircle2 className="size-5 text-(--color-primary) mt-0.5 flex-shrink-0" />
                     <span>Click "Next Question" to proceed</span>
                  </li>
                  <li className="flex items-start gap-2">
                     <CheckCircle2 className="size-5 text-(--color-primary) mt-0.5 flex-shrink-0" />
                     <span>
                        After all questions, receive detailed analytics
                     </span>
                  </li>
               </ul>
            </div>
            <button
               onClick={handleStart}
               className="cursor-pointer w-full flex justify-center items-center gap-2 text-sm font-bold border-2 border-(--color-primary) px-4 py-3 rounded-lg text-(--color-primary) hover:bg-(--color-primary)/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
               <Play className="size-6 " /> Start Mock Interview
            </button>
         </div>
      );
   }

   // Show interview in progress
   return (
      <div className="space-y-6">
         {/* Progress */}
         <div className="bg-(--color-input-bg) rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
               <span className="text-sm font-medium text-gray-400">
                  Progress
               </span>
               <span className="text-sm font-bold text-(--color-primary)">
                  Question {currentQuestionIndex + 1} of {allQuestions.length}
               </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
               <div
                  className="bg-(--color-primary) h-2 rounded-full transition-all duration-300"
                  style={{
                     width: `${((currentQuestionIndex + 1) / allQuestions.length) * 100}%`,
                  }}
               ></div>
            </div>
         </div>

         {/* Current Question */}
         <div className="bg-(--color-input-bg) rounded-lg p-6">
            <div className="flex items-start gap-4 mb-6">
               <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-(--color-primary) text-white font-bold text-lg">
                  Q{currentQuestionIndex + 1}
               </div>
               <div className="flex-1">
                  <p className="text-white text-lg leading-relaxed">
                     {allQuestions[currentQuestionIndex]}
                  </p>
               </div>
            </div>

            {/* Answer Input */}
            <div className="space-y-4">
               <label className="block text-sm font-medium text-gray-300">
                  Your Answer:
               </label>
               <textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Type your answer here or use the microphone button for voice input..."
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-600 bg-(--color-background-card) text-white rounded-lg outline-none focus:ring-2 focus:ring-(--color-primary) resize-none"
               />

               {/* Controls */}
               <div className="flex items-center gap-4">
                  <button
                     onClick={handleVoiceToggle}
                     className={`cursor-pointer flex justify-center items-center gap-2 text-sm font-bold border-2 border-(--color-primary) px-4 py-3 rounded-lg text-(--color-primary) hover:bg-(--color-primary)/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        isRecording
                           ? 'bg-red-500 text-white hover:bg-red-400'
                           : 'bg-(--color-background-card) border border-gray-600 text-gray-300 hover:text-white hover:border-(--color-primary)'
                     }`}
                  >
                     {isRecording ? (
                        <>
                           <MicOff className="size-5" />
                           Stop Recording
                        </>
                     ) : (
                        <>
                           <Mic className="size-5" />
                           Voice Input
                        </>
                     )}
                  </button>

                  <button
                     onClick={handleNextQuestion}
                     disabled={!currentAnswer.trim()}
                     className="ml-auto flex items-center gap-2 px-4 py-3 bg-(--color-primary) text-white font-bold rounded-lg hover:bg-(--color-primary)/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     {currentQuestionIndex < allQuestions.length - 1 ? (
                        <>
                           Next Question
                           <ArrowRightFromLine className="size-5" />
                        </>
                     ) : (
                        <>
                           Finish & Get Analytics
                           <ArrowRightToLine className="size-5" />
                        </>
                     )}
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}

// Interview Analytics Display Component
function InterviewAnalyticsDisplay({
   analytics,
}: {
   analytics: InterviewAnalytics;
}) {
   const CircularScore = ({
      score,
      label,
   }: {
      score: number;
      label: string;
   }) => {
      const circumference = 2 * Math.PI * 40;
      const offset = circumference - (score / 100) * circumference;

      return (
         <div className="flex flex-col items-center justify-center w-40 h-40 bg-(--color-background-card) border-2 border-gray-600 hover:border-(--color-primary) transition-colors rounded-xl p-4">
            <div className="relative w-28 h-28 ">
               <svg className="transform -rotate-90 w-28 h-28">
                  <circle
                     cx="56"
                     cy="56"
                     r="40"
                     stroke="currentColor"
                     strokeWidth="8"
                     fill="transparent"
                     className="text-gray-700"
                  />
                  <circle
                     cx="56"
                     cy="56"
                     r="40"
                     stroke="currentColor"
                     strokeWidth="8"
                     fill="transparent"
                     strokeDasharray={circumference}
                     strokeDashoffset={offset}
                     className="text-(--color-primary) transition-all duration-1000"
                     strokeLinecap="round"
                  />
               </svg>
               <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                     {score}%
                  </span>
               </div>
            </div>
            <p className="mt-1 text-sm font-medium text-gray-300 text-center">
               {label}
            </p>
         </div>
      );
   };

   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="text-center py-6">
            <Sparkles className="size-16 text-(--color-primary) mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">
               Interview Analytics
            </h2>
            <p className="text-gray-400">
               Here's how you performed in the mock interview
            </p>
         </div>

         {/* Scores Grid */}
         <div className="bg-(--color-input-bg) rounded-lg p-2">
            <h3 className="text-xl font-bold text-white mb-6 text-center">
               Performance Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
               <CircularScore score={analytics.confidence} label="Confidence" />
               <CircularScore score={analytics.clarity} label="Clarity" />
               <CircularScore
                  score={analytics.logicAndStructure}
                  label="Logic & Structure"
               />
               <CircularScore
                  score={analytics.toneAndPronunciation}
                  label="Tone & Style"
               />
            </div>
         </div>

         {/* Improvement Suggestions */}
         <div className="bg-(--color-input-bg) rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">
               Improvement Suggestions
            </h3>
            <div className="space-y-3">
               {analytics.improvementSuggestions.map((suggestion, index) => (
                  <div
                     key={index}
                     className="flex gap-3 bg-(--color-background-card) rounded-lg p-4 border-2 border-gray-600 hover:border-(--color-primary) transition-colors"
                  >
                     <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-(--color-primary)/20 text-(--color-primary) font-bold text-sm">
                        {index + 1}
                     </span>
                     <p className="text-gray-200 leading-relaxed pt-1">
                        {suggestion}
                     </p>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}
