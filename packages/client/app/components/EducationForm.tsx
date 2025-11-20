import React from 'react';
import type { Education } from '../../types/resume.types';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';
interface ExperienceFormProps {
   data: Education[];
   onChange: (data: Education[]) => void;
}
const EducationForm: React.FC<ExperienceFormProps> = ({ data, onChange }) => {
   const addEducation = () => {
      const newEducation = {
         institution: '',
         degree: '',
         field: '',
         graduation_date: '',
         gpa: '',
      };
      onChange([...data, newEducation]);
   };
   const removeEducation = (index: number) => {
      const updatedEducation = data.filter((_, i) => i !== index);
      onChange(updatedEducation);
   };
   const updateEducation = (
      index: number,
      field: keyof Education,
      value: string | boolean
   ) => {
      const updatedEducations = [...data];
      updatedEducations[index] = {
         ...updatedEducations[index],
         [field]: value,
      };
      onChange(updatedEducations);
   };
   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h3 className="flex items-center text-lg gap-2 font-semibold text-gray-200">
                  Education
               </h3>
               <p className="text-sm text-gray-300">
                  Add your education details.
               </p>
            </div>
            <button
               onClick={addEducation}
               className="flex items-center gap-1 text-sm font-bold border-2 px-2 py-2 rounded-lg text-(--color-primary) hover:cursor-pointer hover:text-purple-600 transition-colors disabled:opacity-50"
            >
               <Plus className="size-4" /> Add Education
            </button>
         </div>
         {data.length === 0 ? (
            <div className="text-center py-8 text-gray-300">
               <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
               <p>No education added yet.</p>
               <p className="text-sm">
                  Click "Add Education" to add your education
               </p>
            </div>
         ) : (
            <div className="space-y-4">
               {data.map((education, index) => (
                  <div
                     key={index}
                     className="p-4 border border-gray-600 rounded-lg space-y-3"
                  >
                     <div className="flex justify-between items-start">
                        <h4 className="text-md font-medium text-gray-300">
                           Education {index + 1}
                        </h4>
                        <button
                           onClick={() => removeEducation(index)}
                           className="text-red-500 text-sm hover:text-red-700 transition-colors"
                        >
                           <Trash2 className="size-4" />
                        </button>
                     </div>
                     <div className="grid md:grid-cols-2 gap-3">
                        {/* <label className='block text-sm font-medium text-gray-700'>Company</label> */}
                        <input
                           type="text"
                           value={education.institution || ''}
                           onChange={(e) =>
                              updateEducation(
                                 index,
                                 'institution',
                                 e.target.value
                              )
                           }
                           className="px-3 py-2 text-sm rounded-lg text-gray-300 border border-gray-600 focus:ring focus:ring-(--color-primary) focus:border-(--color-primary) outline-none"
                           placeholder="Institution Name"
                        />

                        {/* <label className='block text-sm font-medium text-gray-700'>Position</label> */}
                        <input
                           type="text"
                           value={education.degree || ''}
                           onChange={(e) =>
                              updateEducation(index, 'degree', e.target.value)
                           }
                           className="px-3 py-2 text-sm rounded-lg text-gray-300 border border-gray-600 focus:ring focus:ring-(--color-primary) focus:border-(--color-primary) outline-none"
                           placeholder="Degree(e.g., Bachelor of Science)"
                        />

                        {/* <label className='block text-sm font-medium text-gray-700'>Start Date</label> */}
                        <input
                           type="text"
                           value={education.field || ''}
                           onChange={(e) =>
                              updateEducation(index, 'field', e.target.value)
                           }
                           className="px-3 py-2 text-sm rounded-lg text-gray-300 border border-gray-600 focus:ring focus:ring-(--color-primary) focus:border-(--color-primary) outline-none"
                           placeholder="Field of Study"
                        />

                        {/* <label className='block text-sm font-medium text-gray-700'>End Date</label> */}
                        <input
                           type="month"
                           value={education.graduation_date || ''}
                           onChange={(e) =>
                              updateEducation(
                                 index,
                                 'graduation_date',
                                 e.target.value
                              )
                           }
                           className="wpx-3 py-2 text-sm rounded-lg text-gray-300 border border-gray-600 focus:ring focus:ring-(--color-primary) focus:border-(--color-primary) outline-none"
                        />

                        <input
                           type="text"
                           value={education.gpa || ''}
                           onChange={(e) =>
                              updateEducation(index, 'gpa', e.target.value)
                           }
                           className="px-3 py-2 text-sm rounded-lg text-gray-300 border border-gray-600 focus:ring focus:ring-(--color-primary) focus:border-(--color-primary) outline-none"
                           placeholder="GPA(optional)"
                        />
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
};

export default EducationForm;
