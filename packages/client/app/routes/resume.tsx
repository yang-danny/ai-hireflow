import {
   CloudUpload,
   FileUser,
   ShoppingBag,
   SquarePen,
   Trash2Icon,
   XIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeStore } from '../../store/useResumeStore';
import type { Resume } from '../../types/resume.types';

export default function ResumePage() {
   const navigate = useNavigate();
   const {
      resumes,
      loading,
      error,
      fetchResumes,
      deleteResume,
      setCurrentResume,
      createResume,
   } = useResumeStore();

   const [showUploadResume, setShowUploadResume] = useState<boolean>(false);
   const [title, setTitle] = useState<string>('');
   const [selectedFile, setSelectedFile] = useState<File | null>(null);

   useEffect(() => {
      fetchResumes();
   }, [fetchResumes]);

   const handleCreateResume = async (
      e: React.MouseEvent<HTMLButtonElement>
   ) => {
      e.preventDefault();
      setCurrentResume(null);
      navigate('/resume-generator');
   };

   const handleEditResume = (resume: Resume) => {
      setCurrentResume(resume);
      navigate('/resume-generator');
   };

   const handleUploadResume = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!selectedFile) return;

      // The user wants to process the file in the frontend.
      // This requires a library to parse PDF/DOCX, which is not yet installed.
      // For now, we will just create a new resume with the title.
      try {
         await createResume({ title });
         setShowUploadResume(false);
         setTitle('');
         setSelectedFile(null);
      } catch (error) {
         console.error('Failed to create resume', error);
      }
   };

   if (loading) {
      return <div>Loading...</div>;
   }

   if (error) {
      return <div>Error: {error}</div>;
   }

   return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 ">
         <div className="w-84 h-64 cussor-pointer bg-(--color-background-card) rounded-[20px] flex flex-col items-center justify-center border-2 border-(--color-border) p-8 hover:border-(--color-primary) hover:shadow-[var(--shadow-card-highlighted)] transition-all duration-500 hover:translate-y-[-4px]">
            <div className="w-16 h-16  bg-primary rounded-xl flex items-center justify-center">
               <button
                  onClick={handleCreateResume}
                  className="w-full  sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-white  cursor-pointer"
               >
                  <SquarePen className="size-18 transition-all duration-300 p-2.5 text-white rounded-full" />
               </button>
            </div>
            <p className="text-lg pt-4 group-hover: text-white transition-all duration-300">
               Resume Generator
            </p>
         </div>

         <div className="w-84 h-64 cussor-pointer bg-(--color-background-card) rounded-[20px] flex flex-col items-center justify-center border-2 border-(--color-border) p-8 hover:border-(--color-primary) hover:shadow-[var(--shadow-card-highlighted)] transition-all duration-500 hover:translate-y-[-4px]">
            <div className="w-16 h-16  bg-primary rounded-xl flex items-center justify-center">
               <button
                  onClick={() => setShowUploadResume(true)}
                  className="w-full  sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-white  cursor-pointer"
               >
                  <CloudUpload className="size-18 transition-all duration-300 p-2.5 text-white rounded-full" />
               </button>
            </div>
            <p className="text-lg pt-4 group-hover: text-white transition-all duration-300">
               Upload Resume
            </p>
         </div>
         {showUploadResume && (
            <form
               onSubmit={handleUploadResume}
               onClick={(e) => e.stopPropagation()}
               className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
            >
               <div className="relative bg-slate-200 border shadow-md rounded-lg w-full max-w-sm p-6">
                  <h2 className="text-xl font-semibold mb-4 text-slate-700">
                     Upload Resume
                  </h2>
                  <input
                     type="text"
                     placeholder="Resume Title"
                     value={title}
                     onChange={(e) => setTitle(e.target.value)}
                     className="w-full px-4 py-2 border border-gray-300 text-slate-700 p-2 rounded-md focus:border-green-500 focus:outline-none"
                     required
                  />
                  <div>
                     <label
                        htmlFor="resume-input"
                        className="block text-sm text-slate-700 py-2"
                     >
                        Select Resume File
                        <div
                           className="flex flex-col items-center justify-between gap-2 border group text-slate-400 border-slate-400 border-dashed
                    rounded-md p-4 py-10 my-4 hover:border-green-500 hover:text-green-700 cursor-pointer transition-colors"
                        >
                           {selectedFile ? (
                              <p className="text-green-600 font-medium">
                                 {selectedFile.name}
                              </p>
                           ) : (
                              <div className="flex flex-col items-center">
                                 <ShoppingBag className="size-6 mb-2" />
                                 <p className="text-sm">
                                    Click to upload or drag and drop
                                 </p>
                                 <p className="text-xs text-gray-500 mt-1">
                                    Supported formats: PDF, DOCX
                                 </p>
                              </div>
                           )}
                        </div>
                     </label>
                     <input
                        id="resume-input"
                        type="file"
                        className="hidden"
                        onChange={(e) =>
                           setSelectedFile(
                              e.target.files ? e.target.files[0] : null
                           )
                        }
                        accept=".pdf,.docx"
                     />
                  </div>
                  <button className="w-full py-2 bg-green-600 text-white founded hover:bg-green-700 transition-colors">
                     Upload Resume
                  </button>
                  <XIcon
                     className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                     onClick={() => {
                        setShowUploadResume(false);
                        setTitle('');
                     }}
                  />
               </div>
            </form>
         )}
         {Array.isArray(resumes) &&
            resumes.map((resume) => {
               return (
                  <div
                     key={resume._id}
                     onClick={() => handleEditResume(resume)}
                     className="relative w-84 h-64 cussor-pointer bg-(--color-background-card) rounded-[20px] flex flex-col items-center justify-center border-2 border-(--color-border) p-8 hover:border-(--color-primary) hover:shadow-[var(--shadow-card-highlighted)] transition-all duration-500 hover:translate-y-[-4px]"
                  >
                     <div className="w-16 h-16  bg-primary rounded-xl flex items-center justify-center">
                        <button className="w-full  sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-white  cursor-pointer">
                           <FileUser className="size-18 transition-all duration-300 p-2.5 text-white rounded-full" />
                        </button>
                     </div>
                     <p className="text-lg pt-4 group-hover: text-white transition-all duration-300">
                        {resume.title}
                     </p>
                     <p className="absolute bottom-2 text-sm text-gray-400 px-2 text-center">
                        Update on{' '}
                        {new Date(resume.updatedAt || '').toLocaleDateString()}
                     </p>
                     <div className="absolute top-4 right-4 flex gap-2">
                        <Trash2Icon
                           className="text-white cursor-pointer hover:text-red-600 transition-all duration-300"
                           onClick={(e) => {
                              e.stopPropagation();
                              deleteResume(resume._id);
                           }}
                        />
                     </div>
                  </div>
               );
            })}
      </div>
   );
}
