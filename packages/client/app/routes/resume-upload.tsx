import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { processResumeWithAI } from '../utils/AI';
import { extractTextFromPDF } from '../utils/pdfExtractor';
import { useResumeStore } from 'store/useResumeStore';
import { Undo2 } from 'lucide-react';

export default function ResumeUpload() {
   const { loading: isSaving, createResume } = useResumeStore();
   const navigate = useNavigate();
   const fileInputRef = useRef<HTMLInputElement>(null);

   const [title, setTitle] = useState('');
   const [selectedFile, setSelectedFile] = useState<File | null>(null);
   const [isProcessing, setIsProcessing] = useState(false);
   const [progress, setProgress] = useState('');
   const [error, setError] = useState('');

   const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
         if (file.type !== 'application/pdf') {
            setError('Please select a PDF file');
            return;
         }
         if (file.size > 10 * 1024 * 1024) {
            // 10MB limit
            setError('File size must be less than 10MB');
            return;
         }
         setSelectedFile(file);
         setError('');

         // Auto-set title from filename if not already set
         if (!title) {
            const fileName = file.name.replace('.pdf', '');
            setTitle(fileName);
         }
      }
   };

   const handleUpload = async () => {
      if (!title.trim()) {
         setError('Please enter a resume title');
         return;
      }

      if (!selectedFile) {
         setError('Please select a PDF file');
         return;
      }

      setIsProcessing(true);
      setError('');
      setProgress('Extracting text from PDF...');

      try {
         // Step 1: Extract text from PDF
         const pdfText = await extractTextFromPDF(selectedFile);
         console.log('Extracted text length:', pdfText.length);
         console.log('First 300 characters:', pdfText.substring(0, 300));

         if (!pdfText || pdfText.length < 50) {
            throw new Error(
               'Could not extract enough text from PDF. Please ensure the PDF contains readable text.'
            );
         }

         // Step 2: Process with Gemini AI
         setProgress('Processing with AI...');
         const resumeData = await processResumeWithAI(pdfText, title);
         console.log('Processed resume data:', resumeData);

         // Step 3: Save to database
         setProgress('Saving resume...');
         const savedResume = await createResume(resumeData);
         console.log('Saved resume:', savedResume);

         // Step 4: Navigate to resume editor/viewer
         setProgress('Success! Redirecting...');
         setTimeout(() => {
            navigate(`/resume-generator/${savedResume._id}`);
         }, 1000);
      } catch (err: any) {
         console.error('Error uploading resume:', err);
         setError(err.message || 'Failed to process resume. Please try again.');
         setProgress('');
      } finally {
         setIsProcessing(false);
      }
   };

   const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
   };

   const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const file = e.dataTransfer.files[0];
      if (file && file.type === 'application/pdf') {
         setSelectedFile(file);
         setError('');
         if (!title) {
            setTitle(file.name.replace('.pdf', ''));
         }
      } else {
         setError('Please drop a PDF file');
      }
   };

   return (
      <div className="min-h-screen pt-16">
         <div className="max-w-lg mx-auto">
            <Link
               to="/dashboard"
               className="inline-flex items-center text-sm font-medium text-(--color-primary) hover:underline mb-4"
            >
               <Undo2 className="size-6" />
            </Link>
            <div className="bg-gradient-to-br from-[#2A2D42] to-[#1A1D2A] p-8 rounded-2xl border-2 border-(--color-border) p-8 hover:border-(--color-primary) hover:shadow-[var(--shadow-card-highlighted)] transition-all duration-500 hover:translate-y-[-4px]">
               {/* Header */}
               <div className="mb-8">
                  <h1 className="text-3xl font-bold text-white mb-2">
                     Upload Resume
                  </h1>
                  <p className="text-gray-400">
                     Upload your resume PDF and let AI extract the information
                  </p>
               </div>

               {/* Form */}
               <div className="space-y-6">
                  {/* Title Input */}
                  <div>
                     <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-300 mb-2"
                     >
                        Resume Title *
                     </label>
                     <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Software Engineer Resume"
                        disabled={isProcessing}
                        className="w-full bg-[#1A1D2A] border border-gray-700 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors disabled:opacity-50"
                     />
                  </div>

                  {/* File Upload Area */}
                  <div>
                     <label className="block text-sm font-medium text-gray-300 mb-2">
                        Upload PDF *
                     </label>
                     <div
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-cyan-500 transition-colors"
                     >
                        <input
                           ref={fileInputRef}
                           type="file"
                           accept="application/pdf"
                           onChange={handleFileSelect}
                           disabled={isProcessing}
                           className="hidden"
                        />

                        {selectedFile ? (
                           <div className="space-y-4">
                              <div className="w-16 h-16 mx-auto bg-cyan-500/20 rounded-full flex items-center justify-center">
                                 <svg
                                    className="w-8 h-8 text-cyan-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                 >
                                    <path
                                       strokeLinecap="round"
                                       strokeLinejoin="round"
                                       strokeWidth={2}
                                       d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                 </svg>
                              </div>
                              <div>
                                 <p className="text-white font-medium">
                                    {selectedFile.name}
                                 </p>
                                 <p className="text-gray-400 text-sm">
                                    {(selectedFile.size / 1024).toFixed(2)} KB
                                 </p>
                              </div>
                              <button
                                 onClick={() => fileInputRef.current?.click()}
                                 disabled={isProcessing}
                                 className="text-cyan-400 hover:text-cyan-300 text-sm disabled:opacity-50"
                              >
                                 Change file
                              </button>
                           </div>
                        ) : (
                           <div className="space-y-4">
                              <div className="w-16 h-16 mx-auto bg-gray-700/50 rounded-full flex items-center justify-center">
                                 <svg
                                    className="w-8 h-8 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                 >
                                    <path
                                       strokeLinecap="round"
                                       strokeLinejoin="round"
                                       strokeWidth={2}
                                       d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    />
                                 </svg>
                              </div>
                              <div>
                                 <button
                                    onClick={() =>
                                       fileInputRef.current?.click()
                                    }
                                    disabled={isProcessing}
                                    className="text-cyan-400 hover:text-cyan-300 font-medium disabled:opacity-50"
                                 >
                                    Click to upload
                                 </button>
                                 <span className="text-gray-400">
                                    {' '}
                                    or drag and drop
                                 </span>
                              </div>
                              <p className="text-gray-500 text-sm">
                                 PDF (max 10MB)
                              </p>
                           </div>
                        )}
                     </div>
                  </div>

                  {/* Progress */}
                  {progress && (
                     <div className="bg-cyan-500/10 border border-cyan-500/50 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                           <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-cyan-500"></div>
                           <p className="text-cyan-400 text-sm">{progress}</p>
                        </div>
                     </div>
                  )}

                  {/* Error */}
                  {error && (
                     <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                        <p className="text-red-400 text-sm">{error}</p>
                     </div>
                  )}

                  {/* Upload Button */}
                  <button
                     onClick={handleUpload}
                     disabled={!title || !selectedFile || isProcessing}
                     className="cursor-pointer w-full bg-gradient-to-r from-cyan-400 to-teal-500 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-cyan-500/40 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                     {isProcessing ? (
                        <>
                           <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                           >
                              <circle
                                 className="opacity-25"
                                 cx="12"
                                 cy="12"
                                 r="10"
                                 stroke="currentColor"
                                 strokeWidth="4"
                              ></circle>
                              <path
                                 className="opacity-75"
                                 fill="currentColor"
                                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                           </svg>
                           Processing...pleae wait...
                        </>
                     ) : (
                        'Upload and Process Resume'
                     )}
                  </button>

                  {/* Cancel Button */}
                  <button
                     onClick={() => navigate('/dashboard')}
                     disabled={isProcessing}
                     className="cursor-pointer w-full border border-gray-700 text-gray-300 font-medium py-3 px-6 rounded-xl hover:bg-gray-700/50 transition-colors disabled:opacity-50"
                  >
                     Cancel
                  </button>
               </div>

               {/* Info */}
               <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg">
                  <p className="text-blue-400 text-sm">
                     <strong>Note:</strong> The AI will extract information from
                     your PDF and structure it. You'll be able to review and
                     edit the extracted information afterwards.
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
}
