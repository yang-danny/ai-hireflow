import { useState } from 'react';
import { WandSparkles } from 'lucide-react';
import { generateCoverLetter, processResumeWithAI } from '../utils/AI';
import { extractTextFromPDF } from '../utils/pdfExtractor';
import { useResumeStore } from '../../store/useResumeStore';
import type { Resume } from '../../types/resume.types';
import CoverLetterPreview from '../components/CoverLetterPreview';
import JobInformation, { type JobInfoData } from '../components/JobInformation';
import ResumeSelect from '../components/ResumeSelect';

type CoverLetterTone = 'conservative' | 'balanced' | 'enthusiastic';

interface FormData {
   companyName: string;
   jobTitle: string;
   location: string;
   jobDescription: string;
   resumeFile: File | null;
   selectedResumeId: string | null;
   tone: CoverLetterTone;
}

export default function CoverLetter() {
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
   const [tone, setTone] = useState<CoverLetterTone>('balanced');
   const [generatedLetter, setGeneratedLetter] = useState<string>('');
   const [isGenerating, setIsGenerating] = useState(false);
   const [error, setError] = useState('');
   const [showPreview, setShowPreview] = useState(false);
   const [applicantInfo, setApplicantInfo] = useState<{
      name: string;
      phone: string;
      email: string;
   }>({ name: '', phone: '', email: '' });

   const convertResumeToText = (resume: Resume): string => {
      // Convert resume object to text format for AI
      let text = '';

      // Personal Info
      if (resume.personal_info.full_name) {
         text += `${resume.personal_info.full_name}\n`;
      }
      if (resume.personal_info.email) {
         text += `Email: ${resume.personal_info.email}\n`;
      }
      if (resume.personal_info.phone) {
         text += `Phone: ${resume.personal_info.phone}\n`;
      }
      if (resume.personal_info.location) {
         text += `Location: ${resume.personal_info.location}\n`;
      }
      text += '\n';

      // Professional Summary
      if (resume.professional_summary) {
         text += `PROFESSIONAL SUMMARY\n${resume.professional_summary}\n\n`;
      }

      // Experience
      if (resume.experience && resume.experience.length > 0) {
         text += 'EXPERIENCE\n';
         resume.experience.forEach((exp) => {
            text += `${exp.position} at ${exp.company}\n`;
            text += `${exp.start_date} - ${exp.is_current ? 'Present' : exp.end_date}\n`;
            text += `${exp.description}\n\n`;
         });
      }

      // Education
      if (resume.education && resume.education.length > 0) {
         text += 'EDUCATION\n';
         resume.education.forEach((edu) => {
            text += `${edu.degree} in ${edu.field}\n`;
            text += `${edu.institution}${edu.gpa ? ` - GPA: ${edu.gpa}` : ''}\n`;
            text += `${edu.graduation_date}\n\n`;
         });
      }

      // Skills
      if (resume.skills && resume.skills.length > 0) {
         text += `SKILLS\n${resume.skills.join(', ')}\n\n`;
      }

      // Projects
      if (resume.project && resume.project.length > 0) {
         text += 'PROJECTS\n';
         resume.project.forEach((proj) => {
            text += `${proj.name} (${proj.type})\n${proj.description}\n\n`;
         });
      }

      return text;
   };

   const handleGenerate = async () => {
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
         setError('Please select a saved resume or upload a resume file');
         return;
      }

      setIsGenerating(true);
      setError('');

      try {
         let resumeText = '';
         let applicantInfo = {
            name: '',
            phone: '',
            email: '',
         };

         // Get resume text from either uploaded file or saved resume
         if (resumeFile) {
            const pdfText = await extractTextFromPDF(resumeFile);

            // Process the PDF text with AI to get structured data
            const processedResume = await processResumeWithAI(
               pdfText,
               'Uploaded Resume'
            );

            // Use the processed resume data
            applicantInfo = {
               name: processedResume.personal_info?.full_name || '',
               phone: processedResume.personal_info?.phone || '',
               email: processedResume.personal_info?.email || '',
            };

            // Convert processed resume to text format for the cover letter generator
            resumeText = JSON.stringify(processedResume, null, 2);
         } else if (selectedResumeId) {
            const selectedResume = resumes.find(
               (r) => r._id === selectedResumeId
            );
            if (selectedResume) {
               resumeText = convertResumeToText(selectedResume);
               applicantInfo = {
                  name: selectedResume.personal_info?.full_name || '',
                  phone: selectedResume.personal_info?.phone || '',
                  email: selectedResume.personal_info?.email || '',
               };
            }
         }

         if (!resumeText) {
            throw new Error('Failed to extract resume information');
         }

         // Generate cover letter with AI
         const coverLetter = await generateCoverLetter(
            jobInfo,
            resumeText,
            tone
         );

         setGeneratedLetter(coverLetter);
         // Store applicant info in state for preview
         setApplicantInfo(applicantInfo);
         setShowPreview(true);
      } catch (err: any) {
         console.error('Error generating cover letter:', err);
         setError(
            err.message || 'Failed to generate cover letter. Please try again.'
         );
      } finally {
         setIsGenerating(false);
      }
   };

   // If showing preview, render the preview component
   if (showPreview && generatedLetter) {
      const selectedResume = selectedResumeId
         ? resumes.find((r) => r._id === selectedResumeId)
         : null;

      let applicantName = '';
      let applicantPhone = '';
      let applicantEmail = '';

      // Use applicant info from saved resume or extracted from PDF
      if (selectedResume) {
         applicantName = selectedResume.personal_info?.full_name || '';
         applicantPhone = selectedResume.personal_info?.phone || '';
         applicantEmail = selectedResume.personal_info?.email || '';
      } else if (applicantInfo.name) {
         // Use extracted info from PDF upload
         applicantName = applicantInfo.name || 'Applicant';
         applicantPhone = applicantInfo.phone || '';
         applicantEmail = applicantInfo.email || '';
      }

      // Ensure applicant name is only one line (in case it contains extra content)
      if (applicantName && applicantName.includes('\n')) {
         applicantName = applicantName.split('\n')[0].trim();
      }

      return (
         <CoverLetterPreview
            key={generatedLetter.substring(0, 50)} // Force re-render when letter changes
            coverLetter={generatedLetter}
            jobTitle={jobInfo.jobTitle}
            companyName={jobInfo.companyName}
            companyLocation={jobInfo.location}
            applicantName={applicantName}
            applicantPhone={applicantPhone}
            applicantEmail={applicantEmail}
         />
      );
   }

   return (
      <div className="bg-(--color-background-dark) pr-2">
         {/* Main Content */}
         <div className="">
            <div className="flex-1">
               {/* Left Panel - Upload & Input */}
               <div className="bg-(--color-background-card) rounded-xl p-8 space-y-6">
                  <JobInformation data={jobInfo} onChange={setJobInfo} />

                  {/* Tone Selector */}
                  <div className="space-y-2">
                     <label className="block text-white font-medium text-base">
                        Tone
                     </label>
                     <div className="grid grid-cols-3 gap-0 bg-(--color-input-bg) rounded-lg p-2 border border-gray-600">
                        <button
                           onClick={() => setTone('conservative')}
                           className={`px-4 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                              tone === 'conservative'
                                 ? 'bg-(--color-primary) text-(--color-background-dark)'
                                 : 'text-white/50 hover:text-white'
                           }`}
                        >
                           Conservative
                        </button>
                        <button
                           onClick={() => setTone('balanced')}
                           className={`px-4 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                              tone === 'balanced'
                                 ? 'bg-(--color-primary) text-(--color-background-dark)'
                                 : 'text-white/50 hover:text-white'
                           }`}
                        >
                           Balanced
                        </button>
                        <button
                           onClick={() => setTone('enthusiastic')}
                           className={`px-4 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                              tone === 'enthusiastic'
                                 ? 'bg-(--color-primary) text-(--color-background-dark)'
                                 : 'text-white/50 hover:text-white'
                           }`}
                        >
                           Enthusiastic
                        </button>
                     </div>
                  </div>

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

                  {/* Generate Button */}
                  <button
                     onClick={handleGenerate}
                     disabled={isGenerating}
                     className="cursor-pointer w-full flex justify-center items-center gap-2 text-sm font-bold border-2 border-(--color-primary) px-4 py-3 rounded-lg text-(--color-primary) hover:bg-(--color-primary)/10 transition-colors"
                  >
                     {isGenerating ? (
                        <>
                           <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                           Generating...
                        </>
                     ) : (
                        <>
                           <WandSparkles className="size-6" /> Generate with AI
                        </>
                     )}
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}
