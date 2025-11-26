import { useState } from 'react';
import { WandSparkles } from 'lucide-react';
import { useResumeStore } from 'store/useResumeStore';
import {
   generateInterviewPreparation,
   type InterviewPreparationResult,
} from '../utils/AI';
import { extractTextFromPDF } from '../utils/pdfExtractor';
import PreparationDetails from '../components/PreparationDetails';
import JobInformation, { type JobInfoData } from '../components/JobInformation';
import ResumeSelect from '../components/ResumeSelect';

interface FormData {
   companyName: string;
   jobTitle: string;
   location: string;
   jobDescription: string;
   resumeFile: File | null;
   selectedResumeId: string | null;
}
export default function InterviewPreparation() {
   const [error, setError] = useState('');
   const { resumes } = useResumeStore();
   const [jobInfo, setJobInfo] = useState<JobInfoData>({
      companyName: '',
      jobTitle: '',
      location: '',
      jobDescription: '',
   });
   const [resumeFile, setResumeFile] = useState<File | null>(null);
   const [selectedResumeId, setSelectedResumeId] = useState<string | null>(
      null
   );
   const [isGenerating, setIsGenerating] = useState(false);
   const [preparationResult, setPreparationResult] =
      useState<InterviewPreparationResult | null>(null);

   const selectedResume = selectedResumeId
      ? resumes.find((r) => r._id === selectedResumeId)
      : null;

   // Convert resume object to text for analysis
   const resumeToText = (resume: any): string => {
      let text = '';

      // Personal info
      if (resume.personal_info) {
         const info = resume.personal_info;
         if (info.full_name) text += `${info.full_name}\n`;
         if (info.profession) text += `${info.profession}\n`;
         if (info.email) text += `Email: ${info.email}\n`;
         if (info.phone) text += `Phone: ${info.phone}\n`;
         if (info.location) text += `Location: ${info.location}\n`;
         if (info.linkedin) text += `LinkedIn: ${info.linkedin}\n`;
         if (info.github) text += `GitHub: ${info.github}\n`;
         if (info.website) text += `Website: ${info.website}\n`;
         text += '\n';
      }

      // Professional summary
      if (resume.professional_summary) {
         text += `PROFESSIONAL SUMMARY\n${resume.professional_summary}\n\n`;
      }

      // Experience
      if (resume.experience && resume.experience.length > 0) {
         text += 'EXPERIENCE\n';
         resume.experience.forEach((exp: any) => {
            text += `${exp.position} at ${exp.company}\n`;
            text += `${exp.start_date} - ${exp.is_current ? 'Present' : exp.end_date}\n`;
            text += `${exp.description}\n\n`;
         });
      }

      // Education
      if (resume.education && resume.education.length > 0) {
         text += 'EDUCATION\n';
         resume.education.forEach((edu: any) => {
            text += `${edu.degree} in ${edu.field}\n`;
            text += `${edu.institution}${edu.gpa ? ` - GPA: ${edu.gpa}` : ''}\n`;
            text += `Graduated: ${edu.graduation_date}\n\n`;
         });
      }

      // Projects
      if (resume.project && resume.project.length > 0) {
         text += 'PROJECTS\n';
         resume.project.forEach((proj: any) => {
            text += `${proj.name} (${proj.type})\n`;
            text += `${proj.description}\n\n`;
         });
      }

      // Skills
      if (resume.skills && resume.skills.length > 0) {
         text += `SKILLS\n${resume.skills.join(', ')}\n`;
      }

      return text;
   };

   const handleGenerate = async () => {
      try {
         // Validation
         if (!jobInfo.companyName.trim()) {
            setError('Please enter a company name');
            return;
         }
         if (!jobInfo.jobTitle.trim()) {
            setError('Please enter a job title');
            return;
         }
         if (!jobInfo.jobDescription.trim()) {
            setError('Please enter a job description');
            return;
         }
         if (!resumeFile && !selectedResumeId) {
            setError('Please select or upload a resume');
            return;
         }

         setError('');
         setIsGenerating(true);
         setPreparationResult(null);

         // Extract resume text
         let resumeText = '';
         if (resumeFile) {
            // Extract text from uploaded PDF
            resumeText = await extractTextFromPDF(resumeFile);
         } else if (selectedResume) {
            // Convert saved resume to text
            resumeText = resumeToText(selectedResume);
         }

         // Call AI generation
         const result = await generateInterviewPreparation(jobInfo, resumeText);

         setPreparationResult(result);
      } catch (err: any) {
         console.error('Generation error:', err);
         setError(
            err.message || 'Failed to generate preparation. Please try again.'
         );
      } finally {
         setIsGenerating(false);
      }
   };

   const handleNewPreparation = () => {
      setPreparationResult(null);
      setError('');
   };

   // When preparation is complete, show results
   if (preparationResult) {
      return (
         <PreparationDetails
            preparationResult={preparationResult}
            jobTitle={jobInfo.jobTitle}
            onNewPreparation={handleNewPreparation}
         />
      );
   }

   return (
      <div className=" bg-(--color-background-dark) pr-2">
         {/* Main Content */}
         <div className="">
            <div className="flex-1">
               {/* Left Panel - Upload & Input */}
               <div className="bg-(--color-background-card) rounded-xl p-8 space-y-6">
                  <JobInformation data={jobInfo} onChange={setJobInfo} />

                  <ResumeSelect
                     resumeFile={resumeFile}
                     selectedResumeId={selectedResumeId}
                     onResumeFileChange={setResumeFile}
                     onResumeIdChange={setSelectedResumeId}
                     onError={setError}
                  />

                  {/* Error Message */}
                  {error && (
                     <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                        <p className="text-red-400 text-sm">{error}</p>
                     </div>
                  )}

                  <button
                     onClick={handleGenerate}
                     disabled={isGenerating}
                     className="cursor-pointer w-full flex justify-center items-center gap-2 text-sm font-bold border-2 border-(--color-primary) px-4 py-3 rounded-lg text-(--color-primary) hover:bg-(--color-primary)/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     {isGenerating ? (
                        <>
                           <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-(--color-primary)"></div>
                           Generating...
                        </>
                     ) : (
                        <>
                           <WandSparkles className="size-6" /> Interview
                           Preparation with AI
                        </>
                     )}
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}
