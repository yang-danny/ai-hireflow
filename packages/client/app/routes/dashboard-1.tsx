import { Helmet } from 'react-helmet';
import { Header } from '../components/Header';
import Sidebar from '../components/Sidebar';
import { ServiceCard } from '../components/ServiceCard';
import { QuickTipsSection } from '../components/QuickTipsSection';

export const loader = async () => {
   return {};
};

export default function Dashboard() {
   const services = [
      {
         id: 'resume-generator',
         icon: '/images/img_component_2_white_a700.svg',
         title: 'AI Resume Generator',
         description:
            'Create a professional resume tailored to\nspecific job descriptions.',
         buttonText: 'Start Generating',
      },
      {
         id: 'resume-analyzer',
         icon: '/images/img_component_2_white_a700_28x24.svg',
         title: 'AI Resume Analyzer',
         description:
            "Get instant feedback on your resume's\nstrengths and weaknesses.",
         buttonText: 'Analyze Now',
      },
      {
         id: 'cover-letter',
         icon: '/images/img_background.svg',
         title: 'AI Cover Letter Generator',
         description: 'Craft compelling cover letters that stand\nout.',
         buttonText: 'Start Crafting',
      },
      {
         id: 'interview-coach',
         icon: '/images/img_background_white_a700.svg',
         title: 'Interview Coach',
         description:
            'Practice common interview questions and\nget AI-driven feedback.',
         buttonText: 'Practice Now',
      },
   ];

   const handleServiceClick = (serviceId: string) => {
      console.log(`Clicked service: ${serviceId}`);
      // Handle navigation or service activation
   };

   return (
      <>
         <Helmet>
            <title>
               AI HireFlow Dashboard - Transform Your Job Search with AI-Powered
               Career Tools
            </title>
            <meta
               name="description"
               content="Access AI-powered resume generation, analysis, cover letter creation, and interview preparation tools. Transform your job search with intelligent career assistance and expert guidance."
            />
            <meta
               property="og:title"
               content="AI HireFlow Dashboard - Transform Your Job Search with AI-Powered Career Tools"
            />
            <meta
               property="og:description"
               content="Access AI-powered resume generation, analysis, cover letter creation, and interview preparation tools. Transform your job search with intelligent career assistance and expert guidance."
            />
         </Helmet>

         <main className="min-h-screenoverflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 pointer-events-none" />

            <div className="flex h-screen relative">
               {/* Sidebar */}
               <Sidebar onToggle={() => {}} />

               {/* Main Content */}
               <div className="flex-1 flex flex-col lg:ml-0 ml-0">
                  {/* Header */}
                  {/* <Header /> */}

                  {/* Dashboard Content */}
                  <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                     {/* Services Grid */}
                     <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-4xl">
                           {services.map((service) => (
                              <ServiceCard
                                 key={service.id}
                                 icon={service.icon}
                                 title={service.title}
                                 description={service.description}
                                 buttonText={service.buttonText}
                                 onButtonClick={() =>
                                    handleServiceClick(service.id)
                                 }
                              />
                           ))}
                        </div>
                     </div>

                     {/* Quick Tips Sidebar */}
                     <div className="w-full lg:w-80 xl:w-96 p-4 sm:p-6 lg:p-8 lg:border-l lg:border-gray-700/30 overflow-y-auto">
                        <QuickTipsSection />
                     </div>
                  </div>
               </div>
            </div>

            {/* Decorative Elements */}
            <div className="fixed bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-purple-600/20 to-transparent rounded-full blur-3xl pointer-events-none" />
         </main>
      </>
   );
}
