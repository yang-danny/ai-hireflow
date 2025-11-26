import { useState, useEffect } from 'react';
import { MousePointerClick, Save, Briefcase } from 'lucide-react';
import { useJobStore } from '../../store/useJobStore';

interface JobInfoData {
   companyName: string;
   jobTitle: string;
   location: string;
   jobDescription: string;
}

interface JobInformationProps {
   data: JobInfoData;
   onChange: (data: JobInfoData) => void;
}

export default function JobInformation({
   data,
   onChange,
}: JobInformationProps) {
   const { jobs, fetchJobs, createJob } = useJobStore();
   const [showJobSelector, setShowJobSelector] = useState(false);
   const [showSaveDialog, setShowSaveDialog] = useState(false);
   const [jobTitle, setJobTitle] = useState('');
   const [saveError, setSaveError] = useState('');
   const [saveSuccess, setSaveSuccess] = useState('');

   useEffect(() => {
      // Fetch saved jobs when component mounts
      fetchJobs();
   }, [fetchJobs]);

   const handleSelectJob = (job: any) => {
      onChange({
         companyName: job.companyName,
         jobTitle: job.jobTitle,
         location: job.location || '',
         jobDescription: job.jobDescription,
      });
      setShowJobSelector(false);
   };

   const handleSaveJob = async () => {
      // Validation
      if (!jobTitle.trim()) {
         setSaveError('Please enter a title for this job');
         return;
      }
      if (
         !data.companyName.trim() ||
         !data.jobTitle.trim() ||
         !data.jobDescription.trim()
      ) {
         setSaveError('Please fill in all required job information fields');
         return;
      }

      try {
         setSaveError('');
         await createJob({
            title: jobTitle,
            companyName: data.companyName,
            jobTitle: data.jobTitle,
            location: data.location,
            jobDescription: data.jobDescription,
         });
         setSaveSuccess('Job saved successfully!');
         setJobTitle('');
         setShowSaveDialog(false);
         // Clear success message after 3 seconds
         setTimeout(() => setSaveSuccess(''), 3000);
      } catch (error: any) {
         setSaveError(error.message || 'Failed to save job');
      }
   };

   return (
      <>
         {/* Save Dialog */}
         {showSaveDialog && (
            <div className="mb-4 p-4 bg-(--color-input-bg) border border-gray-600 rounded-lg space-y-3">
               <h3 className="text-white font-medium">Save Job</h3>
               <div className="space-y-2">
                  <label className="block text-white text-sm">
                     Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                     type="text"
                     placeholder="e.g., Google SWE Position"
                     value={jobTitle}
                     onChange={(e) => setJobTitle(e.target.value)}
                     className="w-full px-3 py-2 bg-(--color-background-card) border border-gray-600 rounded-lg focus:ring focus:ring-(--color-primary) focus:border-(--color-primary) outline-none transition-colors text-sm text-gray-200"
                  />
               </div>
               {saveError && (
                  <p className="text-red-400 text-sm">{saveError}</p>
               )}
               <div className="flex gap-2">
                  <button
                     onClick={handleSaveJob}
                     className="cursor-pointer flex-1 px-4 py-2 bg-(--color-primary) text-white rounded-lg hover:bg-(--color-primary)/90 transition-colors text-sm font-medium"
                  >
                     Save
                  </button>
                  <button
                     onClick={() => {
                        setShowSaveDialog(false);
                        setJobTitle('');
                        setSaveError('');
                     }}
                     className="cursor-pointer flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                  >
                     Cancel
                  </button>
               </div>
            </div>
         )}

         {/* Success Message */}
         {saveSuccess && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/50 rounded-lg">
               <p className="text-green-400 text-sm">{saveSuccess}</p>
            </div>
         )}

         {/* Input Fields Row */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
               <label className="block text-white font-medium text-base">
                  Company Name
                  <span className="text-red-500">*</span>
               </label>
               <input
                  type="text"
                  placeholder="e.g., Google"
                  value={data.companyName}
                  onChange={(e) =>
                     onChange({
                        ...data,
                        companyName: e.target.value,
                     })
                  }
                  className="mt-1 w-full px-3 py-2 bg-(--color-input-bg) border border-gray-600 rounded-lg focus:ring focus:ring-(--color-primary) focus:border-(--color-primary) outline-none transition-colors text-sm text-gray-200"
               />
            </div>
            <div className="space-y-2">
               <label className="block text-white font-medium text-base">
                  Job Title
                  <span className="text-red-500">*</span>
               </label>
               <input
                  type="text"
                  placeholder="e.g., Software Engineer"
                  value={data.jobTitle}
                  onChange={(e) =>
                     onChange({
                        ...data,
                        jobTitle: e.target.value,
                     })
                  }
                  className="mt-1 w-full px-3 py-2 bg-(--color-input-bg) border border-gray-600 rounded-lg focus:ring focus:ring-(--color-primary) focus:border-(--color-primary) outline-none transition-colors text-sm text-gray-200"
               />
            </div>
            <div className="space-y-2">
               <label className="block text-white font-medium text-base">
                  Location
               </label>
               <input
                  type="text"
                  placeholder="e.g., Sydney, Australia"
                  value={data.location}
                  onChange={(e) =>
                     onChange({
                        ...data,
                        location: e.target.value,
                     })
                  }
                  className="mt-1 w-full px-3 py-2 bg-(--color-input-bg) border border-gray-600 rounded-lg focus:ring focus:ring-(--color-primary) focus:border-(--color-primary) outline-none transition-colors text-sm text-gray-200"
               />
            </div>
         </div>

         {/* Job Description */}
         <div className="space-y-2">
            <label className="block text-white font-medium text-base">
               Job Description
               <span className="text-red-500">*</span>
            </label>
            <textarea
               placeholder="Paste the job description here..."
               value={data.jobDescription}
               onChange={(e) =>
                  onChange({
                     ...data,
                     jobDescription: e.target.value,
                  })
               }
               rows={6}
               className="w-full px-4 py-3 border border-gray-600 bg-(--color-input-bg) text-(--color-input-text) rounded-lg outline-none focus:ring-2 focus:ring-(--color-primary) resize-none"
            />
         </div>
         {/* Job Selector and Save Buttons */}
         <div className="flex-col gap-3 mb-4">
            <button
               onClick={() => setShowSaveDialog(true)}
               className="cursor-pointer w-full flex justify-center tems-center gap-2 text-sm font-bold border-2 border-green-500 px-4 py-3 rounded-lg text-green-500 hover:bg-green-500/10 transition-colors"
            >
               <Save className="size-5" />
               Save this Job
            </button>
            <div className="flex items-center my-6">
               <hr className="flex-grow border-gray-700" />
               <span className="mx-4 text-gray-500 text-sm font-medium">
                  OR
               </span>
               <hr className="flex-grow border-gray-700" />
            </div>
            <div className="relative flex-1">
               <button
                  onClick={() => setShowJobSelector(!showJobSelector)}
                  className="cursor-pointer w-full flex justify-center items-center gap-2 text-sm font-bold border-2 border-(--color-primary) px-4 py-3 rounded-lg text-(--color-primary) hover:bg-(--color-primary)/10 transition-colors"
               >
                  <MousePointerClick className="size-5" />
                  Select from Saved Jobs
               </button>

               {/* Dropdown for saved jobs */}
               {showJobSelector && (
                  <div className="absolute z-10 w-full mt-2 bg-(--color-background-card) border border-gray-600 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                     {jobs.length > 0 ? (
                        jobs.map((job) => (
                           <button
                              key={job._id}
                              onClick={() => handleSelectJob(job)}
                              className="cursor-pointer w-full text-left px-4 py-3 hover:bg-(--color-input-bg) transition-colors flex items-center gap-3 border-b border-gray-700 last:border-b-0"
                           >
                              <Briefcase className="size-5 text-(--color-primary)" />
                              <div>
                                 <div className="text-white font-medium">
                                    {job.title}
                                 </div>
                                 <div className="text-gray-400 text-xs">
                                    {job.jobTitle} at {job.companyName}
                                 </div>
                              </div>
                           </button>
                        ))
                     ) : (
                        <div className="px-4 py-3 text-gray-400 text-sm">
                           No saved jobs found. Save a job first.
                        </div>
                     )}
                  </div>
               )}
            </div>
         </div>
      </>
   );
}

export type { JobInfoData };
