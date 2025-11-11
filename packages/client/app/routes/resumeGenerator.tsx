import React, { useState } from 'react';
import { Link } from 'react-router';
import UserIcon from '~/components/icons/UserIcon';
import PersonalInfoForm from '~/components/PersonalInfoForm';
import type { PersonalInfo, Resume } from '../../types/resume.types';
import ResumePreview from '~/components/ResumePreview';
import TemplateSelector from '~/components/TemplateSelector';
import ColorPicker from '~/components/ColorPicker';
import ProfessinalSummaryForm from '~/components/ProfessinalSummaryForm';
import ExperienceForm from '~/components/ExperienceForm';
import EducationForm from '~/components/EducationForm';
import ProjectForm from '~/components/ProjectForm';
import SkillsForm from '~/components/SkillsForm';
import {
   DownloadIcon,
   EyeIcon,
   EyeOffIcon,
   Save,
   Share2Icon,
} from 'lucide-react';
import api from '../../services/api';

const ResumeGenerator = () => {
   const [resumeData, setResumeData] = useState<Resume>({
      id: '',
      title: 'Full Stack Developer',
      personal_info: {},
      professional_summary: '',
      experience: [],
      education: [],
      project: [],
      skills: [],
      template: 'classic',
      accent_color: '#3b82f6',
      public: false,
   });
   const [activeSectionIndex, setActiveSectionIndex] = useState(0);
   const [isSaving, setIsSaving] = useState(false);
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
      setResumeData({ ...resumeData, public: !resumeData.public });
   };
   const handleShare = () => {
      const frontendURL = window.location.href.split('/app/')[0];
      const resumeURL = frontendURL + '/view/' + resumeData.id;

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
      setIsSaving(true);
      try {
         let response;
         if (resumeData.id) {
            // Update existing resume
            response = await api.put(
               `/api/resumes/${resumeData.id}`,
               resumeData
            );
         } else {
            // Create new resume
            response = await api.post('/api/resumes', resumeData);
         }

         if (response.data?.data) {
            setResumeData(response.data.data);
         }
      } catch (error) {
         console.error('Failed to save resume:', error);
         // You might want to show an error message to the user
      } finally {
         setIsSaving(false);
      }
   };

   return (
      <div>
         <div className="max-w-7xl mx-auto px-4 py-6">
            <Link
               to="/dashboard"
               className="inline-flex items-center text-sm font-medium text-(--color-primary) hover:underline mb-4"
            >
               Back to Dashboard
            </Link>
         </div>
         <div className="max-w-7xl mx-auto px-4 pb-8">
            <div className="grid lg:grid-cols-12 gap-8">
               {/* Left Panel */}
               <div className="relative lg:col-span-5 rounded-lg overflow-hidden">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                     <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200" />
                     <hr
                        className="absolute top-0 left-0 h-1 bg-gradient-to-r from-cyan-400 to-teal-500 border-none transition-all duration-1000"
                        style={{
                           width: `${(activeSectionIndex * 100) / (sections.length - 1)}%`,
                        }}
                     />
                     <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1">
                        <div className="flex items-center gap-2 p-2">
                           <TemplateSelector
                              selectedTemplete={resumeData.template}
                              onChange={(template: string) =>
                                 setResumeData((prev: Resume) => ({
                                    ...prev,
                                    template,
                                 }))
                              }
                           />
                           <ColorPicker
                              selectedColor={resumeData.accent_color}
                              onChange={(accent_color: string) =>
                                 setResumeData((prev: Resume) => ({
                                    ...prev,
                                    accent_color,
                                 }))
                              }
                           />
                        </div>
                        <div className="flex items-center">
                           {activeSectionIndex !== 0 && (
                              <button
                                 className="flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
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
                              className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${activeSectionIndex === sections.length - 1 && 'opacity-50 cursor-not-allowed'}`}
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
                        {activeSection.id === 'personal' && (
                           <PersonalInfoForm
                              data={resumeData.personal_info}
                              onChange={(data: PersonalInfo) =>
                                 setResumeData((prev: Resume) => ({
                                    ...prev,
                                    personal_info: data,
                                 }))
                              }
                              removeBackground={removeBackground}
                              setRemoveBackground={setRemoveBackground}
                           />
                        )}
                        {activeSection.id === 'summary' && (
                           <ProfessinalSummaryForm
                              data={resumeData.professional_summary}
                              onChange={(data) =>
                                 setResumeData((prev: Resume) => ({
                                    ...prev,
                                    professional_summary: data,
                                 }))
                              }
                              setResumeData={setResumeData}
                           />
                        )}
                        {activeSection.id === 'experience' && (
                           <ExperienceForm
                              data={resumeData.experience}
                              onChange={(data) =>
                                 setResumeData((prev: Resume) => ({
                                    ...prev,
                                    experience: data,
                                 }))
                              }
                           />
                        )}
                        {activeSection.id === 'education' && (
                           <EducationForm
                              data={resumeData.education}
                              onChange={(data) =>
                                 setResumeData((prev: Resume) => ({
                                    ...prev,
                                    education: data,
                                 }))
                              }
                           />
                        )}
                        {activeSection.id === 'projects' && (
                           <ProjectForm
                              data={resumeData.project}
                              onChange={(data) =>
                                 setResumeData((prev: Resume) => ({
                                    ...prev,
                                    project: data,
                                 }))
                              }
                           />
                        )}

                        {activeSection.id === 'skills' && (
                           <SkillsForm
                              data={resumeData.skills}
                              onChange={(data) =>
                                 setResumeData((prev: Resume) => ({
                                    ...prev,
                                    skills: data,
                                 }))
                              }
                           />
                        )}
                     </div>
                     <div className="space-y-6 p-4">
                        <button
                           onClick={handleSaveChanges}
                           disabled={isSaving}
                           className="flex items-center gap-2 bg-gradient-to-br from-green-100 to bg-green-200 ring-green-300 text-green-600 ring hover:ring-green-400 transition-all rounded-md px-6 py-2 mt-6 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                           <Save className="size-4" />
                           {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                     </div>
                  </div>
               </div>
               {/* Right Panel */}
               <div className="lg:col-span-7 max-lg:mt-6">
                  {/* Buttons */}
                  <div className="relative w-full">
                     <div className="absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2">
                        {resumeData.public && (
                           <button
                              onClick={handleShare}
                              className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-100 to bg-blue-200 ring-blue-300 text-blue-600 ring hover:ring transition-colors rounded-lg"
                           >
                              <Share2Icon className="size-4" />
                              Share
                           </button>
                        )}
                        <button
                           onClick={changeResumeVisibility}
                           className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-purple-100 to bg-purple-200 ring-purple-300 text-purple-600 ring hover:ring transition-colors rounded-lg"
                        >
                           {resumeData.public ? (
                              <EyeIcon className="size-4" />
                           ) : (
                              <EyeOffIcon className="size-4" />
                           )}
                           {resumeData.public ? 'Public' : 'Private'}
                        </button>
                        <button
                           onClick={downloadResume}
                           className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-green-100 to bg-green-200 ring-green-300 text-green-600 ring hover:ring transition-colors rounded-lg"
                        >
                           <DownloadIcon className="size-4" />
                           Download
                        </button>
                     </div>
                  </div>
                  {/* Resume Preview */}
                  <ResumePreview
                     data={resumeData}
                     template={resumeData.template}
                     accentColor={resumeData.accent_color}
                  />
               </div>
            </div>
         </div>
      </div>
   );
};

export default ResumeGenerator;
