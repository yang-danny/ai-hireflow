import { useNavigate } from 'react-router';
import { useAuthStore } from '../../store/useAuthStore';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { DashboardHeader } from '../components/DashboardHeader';
import { DashboardFeatureCard } from '../components/DashboardFeatureCard';
import { DashboardQuickTips } from '../components/DashboardQuickTips';
import { ResumeGeneratorIcon } from '../components/icons/icons';
import { ResumeAnalyzerIcon } from '../components/icons/icons';
import { CoverLetterIcon } from '../components/icons/icons';
import { InterviewPrepIcon } from '../components/icons/icons';

export default function Dashboard() {
   const { user } = useAuthStore();
   const navigate = useNavigate();

   if (!user) {
      return null;
   }

   const features = [
      {
         icon: <ResumeGeneratorIcon width={28} height={28} color="white" />,
         title: 'AI Resume Generator',
         description:
            'Create a professional resume tailored to specific job descriptions.',
         buttonText: 'Start Generating',
         onClick: () => navigate('/resume-generator'),
      },
      {
         icon: <ResumeAnalyzerIcon width={28} height={28} color="white" />,
         title: 'AI Resume Analyzer',
         description:
            "Get instant feedback on your resume's strengths and weaknesses.",
         buttonText: 'Analyze Now',
         onClick: () => navigate('/resume-analyzer'),
      },
      {
         icon: <CoverLetterIcon width={28} height={28} color="white" />,
         title: 'AI Cover Letter Generator',
         description: 'Craft compelling cover letters that stand out.',
         buttonText: 'Start Crafting',
         onClick: () => navigate('/cover-letter'),
      },
      {
         icon: <InterviewPrepIcon width={28} height={28} color="white" />,
         title: 'Interview Coach',
         description:
            'Practice common interview questions and get AI-driven feedback.',
         buttonText: 'Practice Now',
         onClick: () => navigate('/interview-prep'),
      },
   ];

   return (
      <div className="flex flex-col lg:flex-row min-h-screen bg-background-dark relative overflow-hidden">
         {/* Gradient Blur Effects */}
         <div className="absolute top-[-125px] left-[-125px] w-[250px] h-[250px] gradient-blur-cyan pointer-events-none" />
         <div className="absolute bottom-[-125px] right-[-125px] w-[250px] h-[250px] gradient-blur-purple pointer-events-none" />

         {/* Sidebar */}
         <aside className="w-full lg:w-80 flex-shrink-0">
            <DashboardSidebar />
         </aside>
         {/* Main Content */}
         <main className="flex-1 flex flex-col border-l-2 border-border relative z-10">
            {/* Center Content */}
            <div className="flex-1 flex flex-col">
               <DashboardHeader user={user} />
               <div className="flex flex-col lg:flex-row gap-4 p-6">
                  {/* Feature Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 ">
                     {features.map((feature) => (
                        <DashboardFeatureCard
                           key={feature.title}
                           {...feature}
                        />
                     ))}
                  </div>
                  {/* Right Sidebar - Quick Tips */}
                  <aside className="w-full lg:w-80 flex-shrink-0 ">
                     <DashboardQuickTips />
                  </aside>
               </div>
            </div>
         </main>
      </div>
   );
}
