import React, { useEffect, useState } from 'react';
import type { PersonalInfo } from '../../types/resume.types';
import {
   User,
   Mail,
   Phone,
   MapPin,
   BriefcaseBusinessIcon,
   Globe,
   Linkedin,
   Github,
} from 'lucide-react';
import { removeImageBackground } from '~/utils/AI';

interface PersonalInfoFormProps {
   data: PersonalInfo;
   onChange: (data: PersonalInfo) => void;
   removeBackground: boolean;
   setRemoveBackground: React.Dispatch<React.SetStateAction<boolean>>;
   errors: { [key: string]: string };
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
   data,
   onChange,
   removeBackground,
   setRemoveBackground,
   errors,
}) => {
   const [isProcessing, setIsProcessing] = useState(false);
   const [processingError, setProcessingError] = useState('');

   const handleChange = (field: keyof PersonalInfo, value: any) => {
      onChange({ ...data, [field]: value });
   };

   // Handle background removal when toggle is enabled
   useEffect(() => {
      const processBackgroundRemoval = async () => {
         // Only process if:
         // 1. Remove background is enabled
         // 2. Image exists
         // 3. Image is a File object (not a URL string from previous upload)
         // 4. Not already processing
         if (
            removeBackground &&
            data.image &&
            typeof data.image === 'object' &&
            !isProcessing
         ) {
            setIsProcessing(true);
            setProcessingError('');

            try {
               // Remove background from the image
               const processedBlob = await removeImageBackground(data.image);

               // Convert blob to File to maintain the same type
               const processedFile = new File(
                  [processedBlob],
                  data.image.name.replace(/\.(jpg|jpeg|png)$/i, '_no_bg.png'),
                  { type: 'image/png' }
               );

               // Update the image with the processed version
               handleChange('image', processedFile);
            } catch (error: any) {
               console.error('Background removal failed:', error);
               setProcessingError(
                  error.message ||
                     'Failed to remove background. Please try again.'
               );
               // Turn off the toggle if processing failed
               setRemoveBackground(false);
            } finally {
               setIsProcessing(false);
            }
         }
      };

      processBackgroundRemoval();
   }, [removeBackground]); // Only trigger when removeBackground changes

   type Field = {
      key: keyof Omit<PersonalInfo, 'image'>;
      label: string;
      type: string;
      icon: React.ElementType;
      required?: boolean;
   };

   const fields: Field[] = [
      {
         key: 'full_name',
         label: 'Full Name',
         type: 'text',
         icon: User,
         required: true,
      },
      {
         key: 'email',
         label: 'Email Address',
         type: 'email',
         icon: Mail,
         required: true,
      },
      {
         key: 'phone',
         label: 'Phone Number',
         type: 'tel',
         icon: Phone,
         required: true,
      },
      { key: 'location', label: 'Location', type: 'text', icon: MapPin },
      {
         key: 'profession',
         label: 'Profession',
         type: 'text',
         icon: BriefcaseBusinessIcon,
      },
      {
         key: 'linkedin',
         label: 'LinkedIn Profile',
         type: 'url',
         icon: Linkedin,
      },
      { key: 'github', label: 'GitHub Profile', type: 'url', icon: Github },
      { key: 'website', label: 'Personal Website', type: 'url', icon: Globe },
   ];
   return (
      <div>
         <h3 className="text-lg mb-2 font-semibold text-gray-200">
            Personal Information
         </h3>
         <p className="text-sm text-gray-300">
            Get Started with the Personal Information
         </p>
         <div className="flex items-center gap-2">
            <label>
               {data.image ? (
                  <img
                     src={
                        typeof data.image === 'string'
                           ? data.image
                           : URL.createObjectURL(data.image)
                     }
                     alt="user-image"
                     className="w-16 h-16 rounded-full object-cover mt-5 ring ring-slate-300"
                  />
               ) : (
                  <div className="inline-flex items-center gap-2 mt-5 text-gray-300 hover:text-gray-100 cursor-pointer">
                     <User className="size-10 p-2.5 border rounded-full" />
                     Upload user image
                  </div>
               )}
               <input
                  type="file"
                  accept="image/jpeg, image/png"
                  className="hidden"
                  onChange={(e) => {
                     if (e.target.files) {
                        handleChange('image', e.target.files[0]);
                     }
                  }}
               />
            </label>
            {typeof data.image === 'object' && (
               <div className="flex flex-col gap-1 pl-4 text-sm">
                  <p className="text-gray-300">Remove Background</p>
                  <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                     <input
                        type="checkbox"
                        className="sr-only peer"
                        onChange={() =>
                           setRemoveBackground((prev: boolean) => !prev)
                        }
                        checked={removeBackground}
                        disabled={isProcessing}
                     />
                     <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                     <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                  </label>
                  {isProcessing && (
                     <p className="text-blue-400 text-xs mt-1">
                        🤖 Processing image...
                     </p>
                  )}
                  {processingError && (
                     <p className="text-red-400 text-xs mt-1">
                        {processingError}
                     </p>
                  )}
               </div>
            )}
         </div>
         {/* Input fields */}
         {fields.map((field) => {
            const Icon = field.icon;
            return (
               <div key={field.key} className="space-y-1 mt-5">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                     <Icon className="size-4" />
                     {field.label}{' '}
                     {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                     type={field.type}
                     value={data[field.key] || ''}
                     onChange={(e) => handleChange(field.key, e.target.value)}
                     className="mt-1 w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring focus:ring-(--color-primary) focus:border-(--color-primary) outline-none transition-colors text-sm text-gray-600 "
                     placeholder={`Enter your ${field.label.toLowerCase()}`}
                     required={field.required}
                  />
                  {errors[field.key] && (
                     <p className="text-red-500 text-sm mt-1">
                        {errors[field.key]}
                     </p>
                  )}
               </div>
            );
         })}
      </div>
   );
};

export default PersonalInfoForm;
