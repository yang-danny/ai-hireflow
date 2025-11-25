import { useEffect, useState } from 'react';
import {
   FileText,
   Sparkles,
   MousePointerClick,
   CloudUpload,
   WandSparkles,
} from 'lucide-react';
import { useResumeStore } from 'store/useResumeStore';
import { analyseResume, type AnalysisResult } from '../utils/AI';
import { extractTextFromPDF } from '../utils/pdfExtractor';
import AnalyseResult from '../components/AnalyseResult';

interface FormData {
   companyName: string;
   jobTitle: string;
   location: string;
   jobDescription: string;
   resumeFile: File | null;
   selectedResumeId: string | null;
}
export default function ResumeAnalyzer() {
   const [error, setError] = useState('');
   const { resumes, fetchResumes } = useResumeStore();
   const [formData, setFormData] = useState<FormData>({
      companyName: '',
      jobTitle: '',
      location: '',
      jobDescription: '',
      resumeFile: null,
      selectedResumeId: null,
   });
   const [isAnalysing, setIsAnalysing] = useState(false);
   const [isDragging, setIsDragging] = useState(false);
   const [showResumeSelector, setShowResumeSelector] = useState(false);
   const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
      null
   );

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
   const selectedResume = formData.selectedResumeId
      ? resumes.find((r) => r._id === formData.selectedResumeId)
      : null;
   const handleSelectSavedResume = (resumeId: string) => {
      setFormData({
         ...formData,
         selectedResumeId: resumeId,
         resumeFile: null,
      });
      setShowResumeSelector(false);
      setError('');
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

   const handleAnalyze = async () => {
      try {
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
            setError('Please select or upload a resume');
            return;
         }

         setError('');
         setIsAnalysing(true);
         setAnalysisResult(null);

         // Extract resume text
         let resumeText = '';
         if (formData.resumeFile) {
            // Extract text from uploaded PDF
            resumeText = await extractTextFromPDF(formData.resumeFile);
         } else if (selectedResume) {
            // Convert saved resume to text
            resumeText = resumeToText(selectedResume);
         }

         // Call AI analysis
         const result = await analyseResume(
            {
               companyName: formData.companyName,
               jobTitle: formData.jobTitle,
               location: formData.location,
               jobDescription: formData.jobDescription,
            },
            resumeText
         );

         setAnalysisResult(result);
      } catch (err: any) {
         console.error('Analysis error:', err);
         setError(err.message || 'Failed to analyze resume. Please try again.');
      } finally {
         setIsAnalysing(false);
      }
   };

   const handleNewAnalysis = () => {
      setAnalysisResult(null);
      setError('');
   };

   // When analysis is complete, show only results (similar to CoverLetterPreview)
   if (analysisResult) {
      return (
         <AnalyseResult
            result={analysisResult}
            onNewAnalysis={handleNewAnalysis}
         />
      );
   }

   return (
      <div className=" bg-(--color-background-dark)">
         {/* Main Content */}
         <div className="">
            <div className="flex-1">
               {/* Left Panel - Upload & Input */}
               <div className="bg-(--color-background-card) rounded-xl p-8 space-y-6">
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

                  {/* Analysing Button */}
                  <button
                     onClick={handleAnalyze}
                     disabled={isAnalysing}
                     className="cursor-pointer w-full flex justify-center items-center gap-2 text-sm font-bold border-2 border-(--color-primary) px-4 py-3 rounded-lg text-(--color-primary) hover:bg-(--color-primary)/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     {isAnalysing ? (
                        <>
                           <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-(--color-primary)"></div>
                           Analysing...
                        </>
                     ) : (
                        <>
                           <WandSparkles className="size-6" /> Analyse with AI
                        </>
                     )}
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}
