import { useState, useEffect } from 'react';
import { FileText, MousePointerClick, CloudUpload } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';

interface ResumeSelectProps {
   resumeFile: File | null;
   selectedResumeId: string | null;
   onResumeFileChange: (file: File | null) => void;
   onResumeIdChange: (id: string | null) => void;
   onError: (error: string) => void;
}

export default function ResumeSelect({
   resumeFile,
   selectedResumeId,
   onResumeFileChange,
   onResumeIdChange,
   onError,
}: ResumeSelectProps) {
   const { resumes, fetchResumes } = useResumeStore();
   const [isDragging, setIsDragging] = useState(false);
   const [showResumeSelector, setShowResumeSelector] = useState(false);

   useEffect(() => {
      // Fetch saved resumes when component mounts
      fetchResumes();
   }, [fetchResumes]);

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         if (file.type !== 'application/pdf') {
            onError('Please select a PDF file');
            return;
         }
         onResumeFileChange(file);
         onResumeIdChange(null);
         onError('');
      }
   };

   const selectedResume = selectedResumeId
      ? resumes.find((r) => r._id === selectedResumeId)
      : null;

   const handleSelectSavedResume = (resumeId: string) => {
      onResumeIdChange(resumeId);
      onResumeFileChange(null);
      setShowResumeSelector(false);
      onError('');
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
            onError('Please select a PDF file');
            return;
         }
         onResumeFileChange(file);
         onResumeIdChange(null);
         onError('');
      }
   };

   return (
      <>
         <label className="block text-white font-medium text-base">
            Your Resume
            <span className="text-red-500">*</span>
         </label>

         {/* Resume Selection */}
         <div className="space-y-2">
            {/* Saved Resume Selector Button */}
            <div className="relative">
               <button
                  onClick={() => setShowResumeSelector(!showResumeSelector)}
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
                           No saved resumes found. Upload a resume below or
                           create one first.
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
               {resumeFile && (
                  <p className="mt-2 text-sm text-(--color-primary)">
                     Selected: {resumeFile.name}
                  </p>
               )}
            </div>
         </div>
      </>
   );
}
