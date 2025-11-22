import { Linkedin, WandSparkles } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from './Button';
import { captureResumeFromLinkedIn } from '~/utils/AI';
import type { Resume } from '../../types/resume.types';

interface LinkedInImportProps {
   onImport: (data: Partial<Resume>) => void;
}

const LinkedInImport: React.FC<LinkedInImportProps> = ({ onImport }) => {
   const [isOpen, setIsOpen] = useState<boolean>(false);
   const [linkedInUrl, setLinkedInUrl] = useState('');
   const [linkedInContent, setLinkedInContent] = useState('');
   const [isCapturing, setIsCapturing] = useState(false);
   const [captureError, setCaptureError] = useState('');

   const handleImport = async () => {
      // Check if user provided either URL or content
      if (!linkedInUrl.trim() && !linkedInContent.trim()) {
         setCaptureError(
            'Please enter a LinkedIn URL or paste your profile content'
         );
         return;
      }

      setIsCapturing(true);
      setCaptureError('');

      try {
         let profileContent = linkedInContent; // Use pasted content if provided

         // If user provided URL but no content, try to fetch automatically
         if (linkedInUrl.trim() && !linkedInContent.trim()) {
            try {
               const response = await fetch(linkedInUrl);

               if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
               }

               const htmlContent = await response.text();

               // Extract text content from HTML
               const parser = new DOMParser();
               const doc = parser.parseFromString(htmlContent, 'text/html');
               profileContent =
                  doc.body.innerText || doc.body.textContent || '';
            } catch (fetchError: any) {
               // If fetch fails, prompt user to use manual paste
               throw new Error(
                  'Unable to automatically fetch LinkedIn profile due to CORS restrictions. Please copy your LinkedIn profile content and paste it in the textarea below.'
               );
            }
         }

         if (!profileContent.trim()) {
            throw new Error(
               'No content to process. Please paste your LinkedIn profile content in the textarea.'
            );
         }

         const capturedData = await captureResumeFromLinkedIn(profileContent);
         console.log('Captured data:', capturedData);

         // Call the onImport callback with captured data
         onImport(capturedData);

         // Close popup and reset
         setIsOpen(false);
         setLinkedInUrl('');
         setLinkedInContent('');
         setCaptureError('');
      } catch (error: any) {
         console.error('Failed to capture LinkedIn profile:', error);
         setCaptureError(
            error.message ||
               'Failed to import LinkedIn profile. Please try again.'
         );
      } finally {
         setIsCapturing(false);
      }
   };

   return (
      <div className="relative">
         <Button
            className="cursor-pointer flex items-center gap-2 transition-all rounded-md px-6 py-2 mt-6 text-sm bg-[#0072B1] hover:bg-blue-700"
            onClick={() => {
               console.log('LinkedIn Import button clicked, isOpen:', isOpen);
               setIsOpen(!isOpen);
            }}
         >
            <Linkedin className="size-4" />
            <span className="max-sm:hidden">LinkedIn Import</span>
         </Button>

         {isOpen && (
            <div className="absolute bottom-full mb-1 left-0 p-6 w-117 max-w-[90vw] z-50 rounded-lg border border-gray-600 shadow-2xl bg-(--color-background-card-inner)">
               <h3
                  className="text-lg font-bold mb-3"
                  style={{ color: '#e2e8f0' }}
               >
                  Import from LinkedIn
               </h3>
               <p className="text-xs mb-4" style={{ color: '#94a3b8' }}>
                  Enter your LinkedIn URL or paste your profile content below.
               </p>

               <div className="space-y-4">
                  {/* URL Input */}
                  <div>
                     <label
                        className="block text-xs font-medium mb-2"
                        style={{ color: '#cbd5e1' }}
                     >
                        LinkedIn Profile URL (Optional)
                     </label>
                     <input
                        type="url"
                        value={linkedInUrl}
                        onChange={(e) => {
                           setLinkedInUrl(e.target.value);
                           setCaptureError('');
                        }}
                        placeholder="https://www.linkedin.com/in/username"
                        className="w-full px-3 py-2 border rounded-lg outline-none transition-colors text-xs bg-(--color-background-card) border-(--color-border) text-(--color-text)"
                        disabled={isCapturing}
                     />
                     <p className="text-xs mt-1" style={{ color: '#64748b' }}>
                        Note: May fail due to LinkedIn's security
                     </p>
                  </div>

                  {/* Content Textarea */}
                  <div>
                     <label
                        className="block text-xs font-medium mb-2"
                        style={{ color: '#cbd5e1' }}
                     >
                        Or Paste Profile Content{' '}
                        <span style={{ color: '#60a5fa' }}>(Recommended)</span>
                     </label>
                     <textarea
                        value={linkedInContent}
                        onChange={(e) => {
                           setLinkedInContent(e.target.value);
                           setCaptureError('');
                        }}
                        placeholder="Go to your LinkedIn profile, select all (Ctrl/Cmd + A), copy, and paste here..."
                        className="w-full px-3 py-2 border rounded-lg outline-none transition-colors text-xs min-h-[100px] resize-y bg-(--color-background-card) border-(--color-border) text-(--color-text)"
                        disabled={isCapturing}
                     />
                  </div>

                  {/* Error Message */}
                  {captureError && (
                     <div
                        className="p-3 rounded-lg"
                        style={{
                           backgroundColor: 'rgba(239, 68, 68, 0.1)',
                           border: '1px solid #ef4444',
                        }}
                     >
                        <p
                           className="text-xs whitespace-pre-line"
                           style={{ color: '#f87171' }}
                        >
                           {captureError}
                        </p>
                     </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 justify-end pt-2">
                     <Button
                        onClick={() => {
                           setIsOpen(false);
                           setLinkedInUrl('');
                           setLinkedInContent('');
                           setCaptureError('');
                        }}
                        className="cursor-pointer flex items-center gap-1 text-sm text-white bg-slate-500/50 hover: transition-all font-medium py-2 px-3 rounded-lg"
                        disabled={isCapturing}
                     >
                        Cancel
                     </Button>
                     <button
                        onClick={handleImport}
                        disabled={
                           isCapturing ||
                           (!linkedInUrl.trim() && !linkedInContent.trim())
                        }
                        className="flex items-center gap-1 text-sm font-bold border-2 px-2 py-2 rounded-lg text-(--color-primary) hover:cursor-pointer hover:text-purple-600 transition-colors disabled:opacity-50"
                     >
                        {isCapturing ? (
                           'Capturing...'
                        ) : (
                           <>
                              <WandSparkles className="size-4" />
                              Import with AI
                           </>
                        )}
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default LinkedInImport;
