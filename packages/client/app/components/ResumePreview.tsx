import React from 'react';
import ModernTemplete from './templates/ModernTemplate';
import ClassicTemplete from './templates/ClassicTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import MinimalImageTemplate from './templates/MinimalImageTemplate';
import type { Resume } from '../../types/resume.types';

interface ResumePreviewProps {
   data: Partial<Resume>;
   template: string;
   accentColor: string;
   classes?: string;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({
   data,
   template,
   accentColor,
   classes = '',
}) => {
   const renderTemplate = () => {
      switch (template) {
         case 'modern':
            return <ModernTemplete data={data} accentColor={accentColor} />;
         case 'minimal':
            return <MinimalTemplate data={data} accentColor={accentColor} />;
         case 'minimal-image':
            return (
               <MinimalImageTemplate data={data} accentColor={accentColor} />
            );
         default:
            return <ClassicTemplete data={data} accentColor={accentColor} />;
      }
   };
   return (
      <div className="w-full bg-gray-300 ">
         <div
            id="resume-preview"
            className={
               'border border-gray-200  print:shadow-none print:border-none' +
               classes
            }
         >
            {renderTemplate()}
         </div>
         <style>
            {`
            @page{
            size:letter;
            margin:0;
            }
            @media print{
                html, body {
                    width: 8.5in;
                    height: 11in;
                    overflow: hidden;
                }
                body * {
                    visibility: hidden;
                }
                #resume-preview, #resume-preview * {
                    visibility: visible;
                }
                #resume-preview {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: auto;
                    margin: 0;
                    padding: 0;
                    box-shadow: none !important;
                    border: none !important;
                }
            }
            `}
         </style>
      </div>
   );
};

export default ResumePreview;
