import { useState } from 'react';
import { Copy, Download, Check } from 'lucide-react';
import { Button } from './Button';

interface CoverLetterPreviewProps {
   coverLetter: string;
   jobTitle: string;
   companyName: string;
   companyLocation?: string;
   applicantName?: string;
   applicantPhone?: string;
   applicantEmail?: string;
}

export default function CoverLetterPreview({
   coverLetter,
   jobTitle,
   companyName,
   companyLocation,
   applicantName,
   applicantPhone,
   applicantEmail,
}: CoverLetterPreviewProps) {
   const [copied, setCopied] = useState(false);

   // Get current date in format: DD Month YYYY
   const formatDate = () => {
      const date = new Date();
      const day = date.getDate().toString().padStart(2, '0');
      const month = date.toLocaleDateString('en-US', { month: 'long' });
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
   };

   const handleCopyText = async () => {
      try {
         await navigator.clipboard.writeText(coverLetter);
         setCopied(true);
         setTimeout(() => setCopied(false), 2000);
      } catch (error) {
         console.error('Failed to copy text:', error);
      }
   };

   const handleDownloadPDF = () => {
      // Use native browser print dialog which allows save as PDF
      window.print();
   };

   return (
      <>
         {/* Print-specific styles */}
         <style>{`
            @media print {
               /* Hide everything first */
               * {
                  margin: 0 !important;
                  padding: 0 !important;
               }
               
               body * {
                  visibility: hidden;
               }
               
               /* Hide parent containers completely */
               body > div,
               .min-h-screen,
               .max-w-5xl {
                  height: 0 !important;
                  min-height: 0 !important;
                  max-height: none !important;
               }
               
               /* Only show the letter content */
               .print-letter,
               .print-letter * {
                  visibility: visible;
               }
               
               /* Position letter at top of page */
               .print-letter {
                  position: fixed !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 210mm !important;
                  min-height: 0 !important;
                  height: auto !important;
                  max-height: 277mm !important;
                  box-shadow: none !important;
                  border-radius: 0 !important;
                  margin: 0 !important;
                  padding: 16mm !important;
                  overflow: hidden !important;
                  background: white !important;
               }
               
               /* Add extra spacing to header elements in print */
               .print-letter .print-applicant-info {
                  margin-bottom: 16px !important;
               }
               
               .print-letter .print-date {
                  margin-bottom: 16px !important;
               }
               
               .print-letter .print-company-info {
                  margin-bottom: 16px !important;
               }
               
               .print-letter .print-subject {
                  margin-bottom: 16px !important;
               }
               
               .print-letter .print-letter-body {
                  margin-bottom: 16px !important;
               }
               
               /* Remove any backgrounds and set body constraints */
               html {
                  height: 297mm !important;
                  max-height: 297mm !important;
                  overflow: hidden !important;
               }
               
               body {
                  margin: 0 !important;
                  padding: 0 !important;
                  background: white !important;
                  height: 297mm !important;
                  max-height: 297mm !important;
                  overflow: hidden !important;
               }
               
               /* Ensure single page */
               @page {
                  size: A4 portrait;
                  margin: 0;
               }
               
               @page :first {
                  margin: 0;
               }
               
               /* Hide all content after first page */
               @page :left, @page :right {
                  size: 0 0;
               }
               
               /* Prevent page breaks */
               .print-letter,
               .print-letter * {
                  page-break-inside: avoid !important;
                  page-break-after: avoid !important;
                  page-break-before: avoid !important;
                  orphans: 99;
                  widows: 99;
               }
            }
         `}</style>

         <div className="min-h-screen bg-(--color-background-dark)">
            <div className="max-w-5xl mx-auto ">
               {/* Header - Hidden when printing */}
               <div className="mb-4 no-print">
                  <h3 className="text-gray-400 text-base font-medium">
                     Cover Letter Preview
                  </h3>
               </div>

               {/* Cover Letter Display - A4 Paper Size Simulation */}
               <div className="print-letter bg-white rounded-lg shadow-2xl mx-auto max-w-[210mm] p-[16mm]">
                  <div className="text-gray-900 text-[11pt] leading-[1.6]">
                     {/* Applicant Contact Information */}
                     <div className="mb-4 print-applicant-info">
                        {applicantName && (
                           <div className="font-bold mb-1">{applicantName}</div>
                        )}
                        {applicantPhone && (
                           <div className="mb-0.5">Phone: {applicantPhone}</div>
                        )}
                        {applicantEmail && (
                           <div className="mb-0.5">
                              Email:{' '}
                              <span className="text-blue-600">
                                 {applicantEmail}
                              </span>
                           </div>
                        )}
                     </div>

                     {/* Date */}
                     <div className="mb-4 font-bold print-date">
                        {formatDate()}
                     </div>

                     {/* Company Information */}
                     <div className="mb-4 print-company-info">
                        <div className="font-bold">{companyName}</div>
                        {companyLocation && <div>{companyLocation}</div>}
                     </div>

                     {/* Subject Line */}
                     <div className="mb-4 font-bold print-subject">
                        Re: Application for {jobTitle}
                     </div>

                     {/* Letter Body */}
                     <div className="whitespace-pre-wrap mb-4 print-letter-body">
                        {coverLetter}
                     </div>

                     {/* Signature */}
                     {applicantName && <div className="">{applicantName}</div>}
                  </div>
               </div>

               {/* Action Buttons - Hidden when printing */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[210mm] mx-auto no-print mt-4">
                  <button
                     onClick={handleCopyText}
                     className="cursor-pointer w-full flex justify-center items-center gap-2 text-sm font-bold border-2 border-(--color-primary) px-4 py-3 rounded-lg text-(--color-primary) hover:bg-(--color-primary)/10 transition-colors"
                  >
                     {copied ? (
                        <>
                           <Check className="w-5 h-5" />
                           Copied!
                        </>
                     ) : (
                        <>
                           <Copy className="w-5 h-5" />
                           Copy to Clipboard
                        </>
                     )}
                  </button>
                  <Button
                     onClick={handleDownloadPDF}
                     className="flex items-center gap-1 text-lg rounded-lg justify-center"
                  >
                     <Download className="size-6" />
                     Download PDF
                  </Button>
               </div>

               {/* Tips - Hidden when printing */}
               <div className="mt-6 p-6 bg-blue-500/10 border border-blue-500/50 rounded-lg max-w-[210mm] mx-auto no-print">
                  <h3 className="text-blue-400 font-semibold mb-2">
                     💡 Next Steps
                  </h3>
                  <ul className="text-blue-300 text-sm space-y-1 list-disc list-inside">
                     <li>
                        Review and personalize the letter to match your voice
                     </li>
                     <li>Add specific details about the company if needed</li>
                     <li>Proofread carefully before sending</li>
                     <li>Save a copy for your records</li>
                  </ul>
               </div>
            </div>
         </div>
      </>
   );
}
