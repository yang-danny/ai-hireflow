import {
   CloudUpload,
   FileUser,
   PencilIcon,
   SquarePen,
   Trash2Icon,
} from 'lucide-react';
import ResumeGenerator from './resumeGenerator';
import { dummyResumeData } from '../data/assets';
import { useEffect, useState } from 'react';
import type { Resume } from '../../types/resume.types';
import { Link } from 'react-router';
export default function resume() {
   const [allResumes, setAllResumes] = useState<Resume[]>([]);
   const loadAllResumes = async () => {
      setAllResumes(dummyResumeData);
   };
   useEffect(() => {
      loadAllResumes();
   }, []);
   console.log(allResumes);

   return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 ">
         <Link to="/resume-generator">
            <div className="w-84 h-64 cussor-pointer bg-(--color-background-card) rounded-[20px] flex flex-col items-center justify-center border-2 border-(--color-border) p-8 hover:border-(--color-primary) hover:shadow-[var(--shadow-card-highlighted)] transition-all duration-500 hover:translate-y-[-4px]">
               <div className="w-16 h-16  bg-primary rounded-xl flex items-center justify-center">
                  <button className="w-full  sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-white  cursor-pointer">
                     <SquarePen className="size-18 transition-all duration-300 p-2.5 text-white rounded-full" />
                  </button>
               </div>
               <p className="text-lg pt-4 group-hover: text-white transition-all duration-300">
                  Resume Generator
               </p>
            </div>
         </Link>
         <div className="w-84 h-64 cussor-pointer bg-(--color-background-card) rounded-[20px] flex flex-col items-center justify-center border-2 border-(--color-border) p-8 hover:border-(--color-primary) hover:shadow-[var(--shadow-card-highlighted)] transition-all duration-500 hover:translate-y-[-4px]">
            <div className="w-16 h-16  bg-primary rounded-xl flex items-center justify-center">
               <button className="w-full  sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-white  cursor-pointer">
                  <CloudUpload className="size-18 transition-all duration-300 p-2.5 text-white rounded-full" />
               </button>
            </div>
            <p className="text-lg pt-4 group-hover: text-white transition-all duration-300">
               Upload Resume
            </p>
         </div>

         {allResumes.map((resume, index) => {
            return (
               <div
                  key={index}
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
                        //  onClick={() => deleteResume(index)}
                     />
                  </div>
               </div>
            );
         })}
      </div>
   );
}
