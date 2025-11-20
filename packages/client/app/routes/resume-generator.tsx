import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserIcon from '~/components/icons/UserIcon';
import PersonalInfoForm from '~/components/PersonalInfoForm';
import type { PersonalInfo, Resume } from '../../types/resume.types';
import ResumePreview from '~/components/ResumePreview';
import TemplateSelector from '~/components/TemplateSelector';
import ColorPicker from '~/components/ColorPicker';
import ProfessinalSummaryForm from '~/components/ProfessionalSummaryForm';
import ExperienceForm from '~/components/ExperienceForm';
import EducationForm from '~/components/EducationForm';
import ProjectForm from '~/components/ProjectForm';
import SkillsForm from '~/components/SkillsForm';
import {
   DownloadIcon,
   EyeIcon,
   EyeOffIcon,
   FileType,
   Save,
   Share2Icon,
   Undo2,
} from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { Button } from '~/components/Button';

const ResumeGenerator = () => {
   const {
      currentResume,
      loading: isSaving,
      error,
      createResume,
      updateResume,
   } = useResumeStore();

   const [localResume, setLocalResume] = useState<Resume>(
      currentResume || {
         _id: '',
         title: '',
         personal_info: {},
         professional_summary: '',
         experience: [],
         education: [],
         project: [],
         skills: [],
         template: 'classic',
         accent_color: '#3b82f6',
         public: false,
      }
   );

   useEffect(() => {
      if (currentResume) {
         setLocalResume(currentResume);
      }
   }, [currentResume]);

   const [activeSectionIndex, setActiveSectionIndex] = useState(0);
   const [errors, setErrors] = useState<any>({});
   const [removeBackground, setRemoveBackground] = useState(false);
   const sections = [
      {
         id: 'personal',
         name: 'Personal Information',
         icon: <UserIcon width={16} height={16} color="currentColor" />,
      },
      {
         id: 'summary',
         name: 'Summary',
         icon: <UserIcon width={16} height={16} color="currentColor" />,
      },
      {
         id: 'experience',
         name: 'Experience',
         icon: <UserIcon width={16} height={16} color="currentColor" />,
      },
      {
         id: 'education',
         name: 'Education',
         icon: <UserIcon width={16} height={16} color="currentColor" />,
      },
      {
         id: 'projects',
         name: 'Projects',
         icon: <UserIcon width={16} height={16} color="currentColor" />,
      },
      {
         id: 'skills',
         name: 'Skills',
         icon: <UserIcon width={16} height={16} color="currentColor" />,
      },
   ];
   const activeSection = sections[activeSectionIndex];
   const changeResumeVisibility = async () => {
      setLocalResume({ ...localResume, public: !localResume.public });
   };
   const handleShare = () => {
      const frontendURL = window.location.href.split('/app/')[0];
      const resumeURL = frontendURL + '/view/' + localResume._id;

      if (navigator.share) {
         navigator.share({ url: resumeURL, text: 'My Resume' });
      } else {
         alert('Share not support on this browser...');
      }
   };
   const downloadResume = () => {
      window.print();
   };

   const handleSaveChanges = async () => {
      const newErrors: any = {};
      if (!localResume.title) {
         newErrors.title = 'Resume Title is required.';
      }
      if (!localResume.personal_info.full_name) {
         newErrors.full_name = 'Full Name is required.';
      }
      if (!localResume.personal_info.email) {
         newErrors.email = 'Email Address is required.';
      }
      if (!localResume.personal_info.phone) {
         newErrors.phone = 'Phone Number is required.';
      }

      if (Object.keys(newErrors).length > 0) {
         setErrors(newErrors);
         return;
      }
      setErrors({});

      try {
         if (localResume._id) {
            await updateResume(localResume._id, localResume);
         } else {
            await createResume(localResume);
         }
      } catch (error) {
         console.error('Failed to save resume:', error);
      }
   };

   return (
      <div>
         <div className="max-w-7xl mx-auto px-4 py-6">
            <Link
               to="/dashboard"
               className="inline-flex items-center text-sm font-medium text-(--color-primary) hover:underline mb-4"
            >
               <Undo2 className="size-6" />
            </Link>
         </div>
         <div className="max-w-7xl mx-auto px-4 pb-8">
            <div className="grid lg:grid-cols-12 gap-8">
               {/* Left Panel */}
               <div className="relative lg:col-span-5 rounded-lg overflow-hidden bg-(--color-background-card)">
                  <div className="rounded-lg shadow-sm border-2 border-(--color-border)">
                     <hr className="absolute top-0 left-0 right-0 border-2 border-(--color-border) bg-(--color-background-card-inner)" />
                     <hr
                        className="absolute top-0 left-0 h-1 bg-gradient-to-r from-cyan-400 to-teal-500 border-none transition-all duration-1000"
                        style={{
                           width: `${(activeSectionIndex * 100) / (sections.length - 1)}%`,
                        }}
                     />
                     <div className="flex justify-between items-center mb-6 border-b-2 border-gray-600 py-1">
                        <div className="flex items-center gap-2 p-2">
                           <TemplateSelector
                              selectedTemplete={localResume.template}
                              onChange={(template: string) =>
                                 setLocalResume((prev: Resume) => ({
                                    ...prev,
                                    template,
                                 }))
                              }
                           />
                           <ColorPicker
                              selectedColor={localResume.accent_color}
                              onChange={(accent_color: string) =>
                                 setLocalResume((prev: Resume) => ({
                                    ...prev,
                                    accent_color,
                                 }))
                              }
                           />
                        </div>
                        <div className="flex items-center">
                           {activeSectionIndex !== 0 && (
                              <button
                                 className="flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-200 hover:text-(--color-primary) transition-all"
                                 onClick={() =>
                                    setActiveSectionIndex((prevIndex: number) =>
                                       Math.max(prevIndex - 1, 0)
                                    )
                                 }
                                 disabled={activeSectionIndex === 0}
                              >
                                 Previous
                              </button>
                           )}
                           <button
                              className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-200 hover:text-(--color-primary) transition-all ${activeSectionIndex === sections.length - 1 && 'opacity-50 cursor-not-allowed'}`}
                              onClick={() =>
                                 setActiveSectionIndex((prevIndex: number) =>
                                    Math.min(prevIndex + 1, sections.length - 1)
                                 )
                              }
                              disabled={
                                 activeSectionIndex === sections.length - 1
                              }
                           >
                              Next
                           </button>
                        </div>
                     </div>
                     <div className="space-y-6 p-4">
                        <div className="flex flex-col justify-between border-b-2 border-(--color-primary)">
                           <label className="flex items-center gap-2 text-md font-bold text-gray-200">
                              <FileType className="size-6" /> Resume Title:{' '}
                              <span className="text-red-500">*</span>
                           </label>
                           <input
                              type="text"
                              value={localResume.title || ''}
                              onChange={(e) =>
                                 setLocalResume((prev) => ({
                                    ...prev,
                                    title: e.target.value,
                                 }))
                              }
                              className="mt-1 w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring focus:ring-(--color-primary) focus:border-(--color-primary) outline-none transition-colors text-sm text-gray-600 "
                              placeholder={`Enter resume title`}
                              required={true}
                           />
                           {errors.title && (
                              <p className="text-red-500 text-sm mt-1">
                                 {errors.title}
                              </p>
                           )}
                           <br className="text-gray-600" />
                        </div>
                        {activeSection.id === 'personal' && (
                           <PersonalInfoForm
                              data={localResume.personal_info}
                              onChange={(data: PersonalInfo) =>
                                 setLocalResume((prev: Resume) => ({
                                    ...prev,
                                    personal_info: data,
                                 }))
                              }
                              errors={errors}
                              removeBackground={removeBackground}
                              setRemoveBackground={setRemoveBackground}
                           />
                        )}
                        {activeSection.id === 'summary' && (
                           <ProfessinalSummaryForm
                              data={localResume.professional_summary}
                              onChange={(data) =>
                                 setLocalResume((prev: Resume) => ({
                                    ...prev,
                                    professional_summary: data,
                                 }))
                              }
                           />
                        )}
                        {activeSection.id === 'experience' && (
                           <ExperienceForm
                              data={localResume.experience}
                              onChange={(data) =>
                                 setLocalResume((prev: Resume) => ({
                                    ...prev,
                                    experience: data,
                                 }))
                              }
                           />
                        )}
                        {activeSection.id === 'education' && (
                           <EducationForm
                              data={localResume.education}
                              onChange={(data) =>
                                 setLocalResume((prev: Resume) => ({
                                    ...prev,
                                    education: data,
                                 }))
                              }
                           />
                        )}
                        {activeSection.id === 'projects' && (
                           <ProjectForm
                              data={localResume.project}
                              onChange={(data) =>
                                 setLocalResume((prev: Resume) => ({
                                    ...prev,
                                    project: data,
                                 }))
                              }
                           />
                        )}

                        {activeSection.id === 'skills' && (
                           <SkillsForm
                              data={localResume.skills}
                              onChange={(data) =>
                                 setLocalResume((prev: Resume) => ({
                                    ...prev,
                                    skills: data,
                                 }))
                              }
                           />
                        )}
                     </div>
                     <div className="space-y-6 p-4">
                        <Button
                           onClick={handleSaveChanges}
                           // disabled={isSaving}
                           className="cursor-pointer flex items-center gap-2 transition-all rounded-md px-6 py-2 mt-6 text-sm"
                        >
                           <Save className="size-4" />
                           {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                     </div>
                  </div>
               </div>
               {/* Right Panel */}
               <div className="lg:col-span-7 max-lg:mt-6">
                  {/* Buttons */}
                  <div className="relative w-full">
                     <div className="absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2">
                        {localResume.public && (
                           <button
                              onClick={handleShare}
                              className="flex items-center gap-1 text-sm font-bold border-2 px-6 py-2.5 rounded-lg text-(--color-primary) hover:cursor-pointer text-(--color-primary-dark) transition-colors"
                           >
                              <Share2Icon className="size-4" />
                              Share
                           </button>
                        )}
                        <Button
                           onClick={changeResumeVisibility}
                           className="flex items-center gap-1 text-sm text-white bg-slate-500/50 hover: transition-all font-medium py-2 px-3 rounded-lg"
                        >
                           {localResume.public ? (
                              <EyeIcon className="size-4" />
                           ) : (
                              <EyeOffIcon className="size-4" />
                           )}
                           {localResume.public ? 'Public' : 'Private'}
                        </Button>
                        <Button
                           onClick={downloadResume}
                           className="flex items-center gap-1 text-sm rounded-lg"
                        >
                           <DownloadIcon className="size-4" />
                           Download
                        </Button>
                     </div>
                  </div>
                  {/* Resume Preview */}
                  <ResumePreview
                     data={localResume}
                     template={localResume.template}
                     accentColor={localResume.accent_color}
                  />
               </div>
            </div>
         </div>
      </div>
   );
};

export default ResumeGenerator;
