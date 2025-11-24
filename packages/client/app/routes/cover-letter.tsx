import { useState, useEffect } from 'react';
import {
   CloudUpload,
   MousePointerClick,
   WandSparkles,
   FileText,
} from 'lucide-react';
import { generateCoverLetter, processResumeWithAI } from '../utils/AI';
import { extractTextFromPDF } from '../utils/pdfExtractor';
import { useResumeStore } from '../../store/useResumeStore';
import type { Resume } from '../../types/resume.types';
import CoverLetterPreview from '../components/CoverLetterPreview';

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
   const { resumes, fetchResumes } = useResumeStore();
   const [formData, setFormData] = useState<FormData>({
      companyName: '',
      jobTitle: '',
      location: '',
      jobDescription: '',
      resumeFile: null,
      selectedResumeId: null,
      tone: 'balanced',
   });
   const [generatedLetter, setGeneratedLetter] = useState<string>('');
   const [isGenerating, setIsGenerating] = useState(false);
   const [isDragging, setIsDragging] = useState(false);
   const [error, setError] = useState('');
   const [showResumeSelector, setShowResumeSelector] = useState(false);
   const [showPreview, setShowPreview] = useState(false);

   useEffect(() => {
      // Fetch saved resumes when component mounts
      fetchResumes();
   }, [fetchResumes]);

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         if (file.type !== 'application/pdf') {
            setError('Please select a PDF file');
            return;
         }
         setFormData({ ...formData, resumeFile: file, selectedResumeId: null });
         setError('');
      }
   };

   const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
   };

   const handleDragLeave = () => {
      setIsDragging(false);
   };

   const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) {
         if (file.type !== 'application/pdf') {
            setError('Please select a PDF file');
            return;
         }
         setFormData({ ...formData, resumeFile: file, selectedResumeId: null });
         setError('');
      }
   };

   const handleSelectSavedResume = (resumeId: string) => {
      setFormData({
         ...formData,
         selectedResumeId: resumeId,
         resumeFile: null,
      });
      setShowResumeSelector(false);
      setError('');
   };

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
      if (!formData.companyName.trim()) {
         setError('Please enter a company name');
         return;
      }
      if (!formData.jobTitle.trim()) {
         setError('Please enter a job title');
         return;
      }
      if (!formData.jobDescription.trim()) {
         setError('Please enter a job description');
         return;
      }
      if (!formData.resumeFile && !formData.selectedResumeId) {
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
         if (formData.resumeFile) {
            const pdfText = await extractTextFromPDF(formData.resumeFile);

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
         } else if (formData.selectedResumeId) {
            const selectedResume = resumes.find(
               (r) => r._id === formData.selectedResumeId
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
            {
               companyName: formData.companyName,
               jobTitle: formData.jobTitle,
               location: formData.location,
               jobDescription: formData.jobDescription,
            },
            resumeText,
            formData.tone
         );

         setGeneratedLetter(coverLetter);
         // Store applicant info in state for preview
         setFormData((prev) => ({
            ...prev,
            applicantInfo,
         }));
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
      const selectedResume = formData.selectedResumeId
         ? resumes.find((r) => r._id === formData.selectedResumeId)
         : null;

      let applicantName = '';
      let applicantPhone = '';
      let applicantEmail = '';

      // Use applicant info from saved resume or extracted from PDF
      if (selectedResume) {
         applicantName = selectedResume.personal_info?.full_name || '';
         applicantPhone = selectedResume.personal_info?.phone || '';
         applicantEmail = selectedResume.personal_info?.email || '';
      } else if ((formData as any).applicantInfo) {
         // Use extracted info from PDF upload
         applicantName = (formData as any).applicantInfo?.name || 'Applicant';
         applicantPhone = (formData as any).applicantInfo?.phone || '';
         applicantEmail = (formData as any).applicantInfo?.email || '';
      }

      // Ensure applicant name is only one line (in case it contains extra content)
      if (applicantName && applicantName.includes('\n')) {
         applicantName = applicantName.split('\n')[0].trim();
      }

      return (
         <CoverLetterPreview
            key={generatedLetter.substring(0, 50)} // Force re-render when letter changes
            coverLetter={generatedLetter}
            jobTitle={formData.jobTitle}
            companyName={formData.companyName}
            companyLocation={formData.location}
            applicantName={applicantName}
            applicantPhone={applicantPhone}
            applicantEmail={applicantEmail}
         />
      );
   }

   const selectedResume = formData.selectedResumeId
      ? resumes.find((r) => r._id === formData.selectedResumeId)
      : null;

   return (
      <div className="min-h-screen bg-(--color-background-dark) mr-2">
         <main>
            <div className="max-w-5xl ">
               {/* Form Section */}
               <div className="bg-(--color-background-card) rounded-xl p-8 mb-8 space-y-6">
                  {/* Input Fields Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="space-y-2">
                        <label className="block text-white font-medium text-base">
                           Company Name
                           <span className="text-red-500">*</span>
                        </label>
                        <input
                           type="text"
                           placeholder="e.g., Google"
                           value={formData.companyName}
                           onChange={(e) =>
                              setFormData({
                                 ...formData,
                                 companyName: e.target.value,
                              })
                           }
                           className="mt-1 w-full px-3 py-2 bg-(--color-input-bg) border border-gray-600 rounded-lg focus:ring focus:ring-(--color-primary) focus:border-(--color-primary) outline-none transition-colors text-sm text-gray-200"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="block text-white font-medium text-base">
                           Job Title
                           <span className="text-red-500">*</span>
                        </label>
                        <input
                           type="text"
                           placeholder="e.g., Software Engineer"
                           value={formData.jobTitle}
                           onChange={(e) =>
                              setFormData({
                                 ...formData,
                                 jobTitle: e.target.value,
                              })
                           }
                           className="mt-1 w-full px-3 py-2 bg-(--color-input-bg) border border-gray-600 rounded-lg focus:ring focus:ring-(--color-primary) focus:border-(--color-primary) outline-none transition-colors text-sm text-gray-200"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="block text-white font-medium text-base">
                           Location
                        </label>
                        <input
                           type="text"
                           placeholder="e.g., Sydney, Australia"
                           value={formData.location}
                           onChange={(e) =>
                              setFormData({
                                 ...formData,
                                 location: e.target.value,
                              })
                           }
                           className="mt-1 w-full px-3 py-2 bg-(--color-input-bg) border border-gray-600 rounded-lg focus:ring focus:ring-(--color-primary) focus:border-(--color-primary) outline-none transition-colors text-sm text-gray-200"
                        />
                     </div>
                  </div>

                  {/* Job Description */}
                  <div className="space-y-2">
                     <label className="block text-white font-medium text-base">
                        Job Description
                        <span className="text-red-500">*</span>
                     </label>
                     <textarea
                        placeholder="Paste the job description here..."
                        value={formData.jobDescription}
                        onChange={(e) =>
                           setFormData({
                              ...formData,
                              jobDescription: e.target.value,
                           })
                        }
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-600 bg-(--color-input-bg) text-(--color-input-text) rounded-lg outline-none focus:ring-2 focus:ring-(--color-primary) resize-none"
                     />
                  </div>

                  {/* Tone Selector */}
                  <div className="space-y-2">
                     <label className="block text-white font-medium text-base">
                        Tone
                     </label>
                     <div className="grid grid-cols-3 gap-0 bg-(--color-input-bg) rounded-lg p-2 border border-gray-600">
                        <button
                           onClick={() =>
                              setFormData({ ...formData, tone: 'conservative' })
                           }
                           className={`px-4 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                              formData.tone === 'conservative'
                                 ? 'bg-(--color-primary) text-(--color-background-dark)'
                                 : 'text-white/50 hover:text-white'
                           }`}
                        >
                           Conservative
                        </button>
                        <button
                           onClick={() =>
                              setFormData({ ...formData, tone: 'balanced' })
                           }
                           className={`px-4 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                              formData.tone === 'balanced'
                                 ? 'bg-(--color-primary) text-(--color-background-dark)'
                                 : 'text-white/50 hover:text-white'
                           }`}
                        >
                           Balanced
                        </button>
                        <button
                           onClick={() =>
                              setFormData({ ...formData, tone: 'enthusiastic' })
                           }
                           className={`px-4 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                              formData.tone === 'enthusiastic'
                                 ? 'bg-(--color-primary) text-(--color-background-dark)'
                                 : 'text-white/50 hover:text-white'
                           }`}
                        >
                           Enthusiastic
                        </button>
                     </div>
                  </div>

                  <label className="block text-white font-medium text-base">
                     Your Resume
                     <span className="text-red-500">*</span>
                  </label>

                  {/* Resume Selection */}
                  <div className="space-y-2">
                     {/* Saved Resume Selector Button */}
                     <div className="relative">
                        <button
                           onClick={() =>
                              setShowResumeSelector(!showResumeSelector)
                           }
                           className="cursor-pointer w-full flex justify-center items-center gap-2 text-sm font-bold border-2 border-(--color-primary) px-4 py-3 rounded-lg text-(--color-primary) hover:bg-(--color-primary)/10 transition-colors"
                        >
                           <MousePointerClick className="size-5" />
                           {selectedResume
                              ? `Selected: ${selectedResume.title}`
                              : 'Select from Saved Resumes'}
                        </button>

                        {/* Dropdown for saved resumes */}
                        {showResumeSelector && (
                           <div className="absolute z-10 w-full mt-2 bg-(--color-background-card) border border-gray-600 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                              {resumes.length > 0 ? (
                                 resumes.map((resume) => (
                                    <button
                                       key={resume._id}
                                       onClick={() =>
                                          handleSelectSavedResume(resume._id)
                                       }
                                       className="cursor-pointer w-full text-left px-4 py-3 hover:bg-(--color-input-bg) transition-colors flex items-center gap-3 border-b border-gray-700 last:border-b-0"
                                    >
                                       <FileText className="size-5 text-(--color-primary)" />
                                       <div>
                                          <div className="text-white font-medium">
                                             {resume.title}
                                          </div>
                                          <div className="text-gray-400 text-xs">
                                             {resume.personal_info.full_name ||
                                                'No name'}
                                          </div>
                                       </div>
                                    </button>
                                 ))
                              ) : (
                                 <div className="px-4 py-3 text-gray-400 text-sm">
                                    No saved resumes found. Upload a resume
                                    below or create one first.
                                 </div>
                              )}
                           </div>
                        )}
                     </div>

                     <div className="flex items-center my-6">
                        <hr className="flex-grow border-gray-700" />
                        <span className="mx-4 text-gray-500 text-sm font-medium">
                           OR
                        </span>
                        <hr className="flex-grow border-gray-700" />
                     </div>

                     {/* File Upload */}
                     <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                           isDragging
                              ? 'border-(--color-primary) bg-(--color-primary)/10'
                              : 'border-(--color-input-text)/30 bg-(--color-input-bg)'
                        }`}
                     >
                        <input
                           type="file"
                           accept=".pdf,.doc,.docx"
                           onChange={handleFileChange}
                           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <CloudUpload className="w-8 h-6 mx-auto mb-3 text-(--color-input-text)" />
                        <p className="text-sm font-semibold mb-1">
                           <span className="text-(--color-primary)">
                              Click to upload
                           </span>
                           <span className="text-(--color-input-text)">
                              {' '}
                              or drag and drop
                           </span>
                        </p>
                        <p className="text-xs text-(--color-input-text)">
                           PDF, DOC, DOCX (MAX. 5MB)
                        </p>
                        {formData.resumeFile && (
                           <p className="mt-2 text-sm text-(--color-primary)">
                              Selected: {formData.resumeFile.name}
                           </p>
                        )}
                     </div>
                  </div>

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
         </main>
      </div>
   );
}
