import React from 'react';
import Sidebar from '../components/Sidebar';
import DashboardFeatureCard from '../components/DashboardFeatureCard';
import QuickTips from '../components/QuickTips';
import {
   BellIcon,
   CoverLetterIcon,
   MicIcon,
   ResumeIcon,
} from '../components/icons/icons';

const Dashboard = () => {
   const features = [
      {
         icon: <ResumeIcon className="w-6 h-6" />,
         title: 'AI Resume Generator',
         description:
            'Create a professional resume tailored to specific job descriptions.',
         buttonText: 'Start Generating',
      },
      {
         icon: <ResumeIcon className="w-6 h-6" />,
         title: 'AI Resume Analyzer',
         description:
            "Get instant feedback on your resume's strengths and weaknesses.",
         buttonText: 'Analyze Now',
      },
      {
         icon: <CoverLetterIcon className="w-6 h-6" />,
         title: 'AI Cover Letter Generator',
         description: 'Craft compelling cover letters that stand out.',
         buttonText: 'Start Crafting',
      },
      {
         icon: <MicIcon className="w-6 h-6" />,
         title: 'Interview Coach',
         description:
            'Practice common interview questions and get AI-driven feedback.',
         buttonText: 'Practice Now',
      },
   ];

   return (
      <div className="bg-[#10141E] text-gray-200 min-h-screen flex font-sans">
         <Sidebar />
         <main className="flex-1 p-4 md:p-8 lg:ml-64 lg:p-8">
            <header className="flex justify-between items-center mb-10">
               <h1 className="text-3xl font-bold text-white">
                  Welcome, Danny 👋
               </h1>
               <div className="flex items-center space-x-6">
                  <button className="relative text-gray-400 hover:text-white">
                     <BellIcon />
                     <span className="absolute top-0 right-0 h-2 w-2 bg-cyan-400 rounded-full"></span>
                  </button>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-orange-400">
                     <img
                        src="https://picsum.photos/40/40"
                        alt="User avatar"
                        className="rounded-full"
                     />
                  </div>
               </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
               <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {features.map((feature) => (
                     <DashboardFeatureCard
                        key={feature.title}
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                        buttonText={feature.buttonText}
                     />
                  ))}
               </div>

               <div className="xl:col-span-1">
                  <QuickTips />
               </div>
            </div>
         </main>
      </div>
   );
};

export default Dashboard;
