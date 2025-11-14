import { Briefcase, Plus, Sparkle, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import type { Experience } from '../../types/resume.types';
import { enhanceJobDescription } from '../utils/AI';

interface ExperienceFormProps {
   data: Experience[];
   onChange: (data: Experience[]) => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ data, onChange }) => {
   const [isProcessing, setIsProcessing] = useState<number | null>(null);
   const [error, setError] = useState<string | null>(null);
   const addExperience = () => {
      const newExperience: Experience = {
         company: '',
         position: '',
         start_date: '',
         end_date: '',
         description: '',
         is_current: false,
      };
      onChange([...data, newExperience]);
   };
   const removeExperience = (index: number) => {
      const updatedExperiences = data.filter((_, i) => i !== index);
      onChange(updatedExperiences);
   };
   const updateExperience = (
      index: number,
      field: keyof Experience,
      value: string | boolean
   ) => {
      const updatedExperiences = [...data];
      updatedExperiences[index] = {
         ...updatedExperiences[index],
         [field]: value,
      };
      onChange(updatedExperiences);
   };

   const handleAIEnhance = async (index: number, description: string) => {
      if (!description) {
         setError('Please enter a description to enhance.');
         return;
      }
      setError(null);
      setIsProcessing(index);
      try {
         const enhancedDescription = await enhanceJobDescription(description);
         updateExperience(index, 'description', enhancedDescription);
      } catch (err: any) {
         setError(
            err.message || 'Failed to enhance description. Please try again.'
         );
      } finally {
         setIsProcessing(null);
      }
   };

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h3 className="flex items-center text-lg gap-2 font-semibold text-gray-900">
                  Professional Experience
               </h3>
               <p className="text-sm text-gray-500">
                  Add your job experiences.
               </p>
            </div>
            <button
               onClick={addExperience}
               className="flex items-centergap-2 px-3 py-1  bg-green-100 text-green-700 rounded text-sm font-medium hover:bg-green-200 transition-colors disabled:opacity-50"
            >
               <Plus className="size-4" /> Add Experience
            </button>
         </div>
         {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
               <p className="text-red-400 text-sm">{error}</p>
            </div>
         )}
         {data.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
               <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
               <p>No work experience added yet.</p>
               <p className="text-sm">
                  Click "Add Experience" to add your work experience
               </p>
            </div>
         ) : (
            <div className="space-y-4">
               {data.map((experience, index) => (
                  <div
                     key={index}
                     className="p-4 border border-gray-200 rounded-lg space-y-3"
                  >
                     <div className="flex justify-between items-start">
                        <h4 className="text-md font-medium text-gray-500">
                           Experience {index + 1}
                        </h4>
                        <button
                           onClick={() => removeExperience(index)}
                           className="text-red-500 text-sm hover:text-red-700 transition-colors"
                        >
                           <Trash2 className="size-4" />
                        </button>
                     </div>
                     <div className="grid md:grid-cols-2 gap-3">
                        {/* <label className='block text-sm font-medium text-gray-700'>Company</label> */}
                        <input
                           type="text"
                           value={experience.company || ''}
                           onChange={(e) =>
                              updateExperience(index, 'company', e.target.value)
                           }
                           className="px-3 py-2 text-sm rounded-lg text-gray-500 border border-gray-300"
                           placeholder="Company Name"
                        />

                        {/* <label className='block text-sm font-medium text-gray-700'>Position</label> */}
                        <input
                           type="text"
                           value={experience.position || ''}
                           onChange={(e) =>
                              updateExperience(
                                 index,
                                 'position',
                                 e.target.value
                              )
                           }
                           className="px-3 py-2 text-sm rounded-lg text-gray-500 border border-gray-300"
                           placeholder="Position"
                        />

                        {/* <label className='block text-sm font-medium text-gray-700'>Start Date</label> */}
                        <input
                           type="month"
                           value={experience.start_date || ''}
                           onChange={(e) =>
                              updateExperience(
                                 index,
                                 'start_date',
                                 e.target.value
                              )
                           }
                           className="px-3 py-2 text-sm rounded-lg text-gray-500 border border-gray-300"
                        />

                        {/* <label className='block text-sm font-medium text-gray-700'>End Date</label> */}
                        <input
                           type="month"
                           value={experience.end_date || ''}
                           disabled={experience.is_current}
                           onChange={(e) =>
                              updateExperience(
                                 index,
                                 'end_date',
                                 e.target.value
                              )
                           }
                           className="wpx-3 py-2 text-sm rounded-lg text-gray-500 border border-gray-300 disabled:bg-gray-100"
                        />
                     </div>
                     <label className="flex items-center gap-2">
                        <input
                           type="checkbox"
                           checked={experience.is_current || false}
                           onChange={(e) => {
                              updateExperience(
                                 index,
                                 'is_current',
                                 e.target.checked ? true : false
                              );
                           }}
                           className="w-4 h-4 bg-white rounded border border-gray-300"
                        />
                        <span className="text-sm text-gray-500">
                           Current Job
                        </span>
                     </label>
                     <div className="space-y-2">
                        <div className="flex items-center justify-between">
                           <label className="text-sm font-medium text-gray-500">
                              Description
                           </label>
                           <button
                              onClick={() =>
                                 handleAIEnhance(index, experience.description)
                              }
                              disabled={isProcessing === index}
                              className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                           >
                              {isProcessing === index ? (
                                 <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-purple-500"></div>
                                    Enhancing...
                                 </>
                              ) : (
                                 <>
                                    <Sparkle className="size-4" /> Enhance with
                                    AI
                                 </>
                              )}
                           </button>
                        </div>
                        <textarea
                           value={experience.description || ''}
                           rows={4}
                           onChange={(e) =>
                              updateExperience(
                                 index,
                                 'description',
                                 e.target.value
                              )
                           }
                           className="w-full text-sm p-2 border text-gray-500 border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                           placeholder="Describe your key responsibilities and achievements..."
                        />
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
};

export default ExperienceForm;
