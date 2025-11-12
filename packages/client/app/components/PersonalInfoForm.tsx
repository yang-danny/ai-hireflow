import React from 'react';
import type { PersonalInfo } from '../../types/resume.types';
import {
   User,
   Mail,
   Phone,
   MapPin,
   BriefcaseBusinessIcon,
   Globe,
} from 'lucide-react';
import { GithubIcon, LinkedInIconLight } from './icons/icons';
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
   const handleChange = (field: keyof PersonalInfo, value: any) => {
      onChange({ ...data, [field]: value });
   };

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
         icon: LinkedInIconLight,
      },
      { key: 'github', label: 'GitHub Profile', type: 'url', icon: GithubIcon },
      { key: 'website', label: 'Personal Website', type: 'url', icon: Globe },
   ];
   return (
      <div>
         <h3 className="text-lg mb-2 font-semibold text-gray-900">
            Personal Information
         </h3>
         <p className="text-sm text-gray-600">
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
                  <div className="inline-flex items-center gap-2 mt-5 text-slate-600 hover:text-slate-700 cursor-pointer">
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
                  <p>Remove Background</p>
                  <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                     <input
                        type="checkbox"
                        className="sr-only peer"
                        onChange={() =>
                           setRemoveBackground((prev: boolean) => !prev)
                        }
                        checked={removeBackground}
                     />
                     <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                     <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                  </label>
               </div>
            )}
         </div>
         {/* Input fields */}
         {fields.map((field) => {
            const Icon = field.icon;
            return (
               <div key={field.key} className="space-y-1 mt-5">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                     <Icon className="size-4" />
                     {field.label}{' '}
                     {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                     type={field.type}
                     value={data[field.key] || ''}
                     onChange={(e) => handleChange(field.key, e.target.value)}
                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm text-gray-600 "
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
