import { useAuthStore } from '../../store/useAuthStore';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { LogoIcon } from './icons/icons';
import { HomeNavIcon } from './icons/icons';
import { ResumeGeneratorIcon } from './icons/icons';
import { ResumeAnalyzerIcon } from './icons/icons';
import { CoverLetterIcon } from './icons/icons';
import { InterviewPrepIcon } from './icons/icons';
import { LogoutIcon } from './icons/icons';

interface NavItemProps {
   icon: React.ReactNode;
   label: string;
   onClick: () => void;
   active?: boolean;
   testId?: string;
}

interface DashboardSidebarProps {
   setActiveComponent: (component: string) => void;
}

function NavItem({
   icon,
   label,
   onClick,
   active = false,
   testId,
}: NavItemProps) {
   return (
      <button
         onClick={onClick}
         data-testid={testId}
         className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
            active
               ? 'gradient-nav-active text-white'
               : 'text-(--color-text-secondary) hover:text-(--color-text-primary) hover:bg-white/5'
         }`}
      >
         <div className="w-4 h-4 flex-shrink-0">{icon}</div>
         <span className="text-sm font-medium">{label}</span>
      </button>
   );
}

export function DashboardSidebar({
   setActiveComponent,
}: DashboardSidebarProps) {
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [activeItem, setActiveItem] = useState('home');

   const { logout } = useAuthStore();
   const navigate = useNavigate();

   const handleLogout = () => {
      logout();
      navigate('/');
   };

   const handleNavClick = (component: string) => {
      setActiveComponent(component);
      setActiveItem(component);
   };

   const navItems = [
      {
         icon: <HomeNavIcon width={16} height={16} color="currentColor" />,
         label: 'Home',
         component: 'home',
         testId: 'nav-home',
      },
      {
         icon: (
            <ResumeGeneratorIcon width={16} height={16} color="currentColor" />
         ),
         label: 'AI Resume Generator',
         component: 'resume',
         testId: 'nav-resume-generator',
      },
      {
         icon: (
            <ResumeAnalyzerIcon width={16} height={16} color="currentColor" />
         ),
         label: 'AI Resume Analyzer',
         component: 'analyzer',
         testId: 'nav-resume-analyzer',
      },
      {
         icon: <CoverLetterIcon width={16} height={16} color="currentColor" />,
         label: 'AI Cover Letter Generator',
         component: 'coverLetter',
         testId: 'nav-cover-letter',
      },
      {
         icon: (
            <InterviewPrepIcon width={16} height={16} color="currentColor" />
         ),
         label: 'AI Interview Preparation',
         component: 'interview',
         testId: 'nav-interview-prep',
      },
   ];

   const sidebarContent = (
      <>
         <a href="/" className="flex items-center justify-center mb-6 gap-3">
            <LogoIcon width={28} height={28} color="#00c4cc" />
            <span className="text-xl font-semibold bg-gradient-to-r from-teal-500 to-indigo-600 bg-clip-text text-transparent tracking-tight">
               AI HireFlow
            </span>
         </a>

         <nav className="flex-1 flex flex-col gap-2">
            {navItems.map((item) => (
               <NavItem
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  onClick={() => handleNavClick(item.component)}
                  active={activeItem === item.component}
                  testId={item.testId}
               />
            ))}
         </nav>

         <div className="mt-auto pt-4">
            <button
               onClick={handleLogout}
               className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 hover:bg-white/5 w-full"
            >
               <div className="w-4 h-4 flex-shrink-0">
                  <LogoutIcon width={20} height={20} color="currentColor" />
               </div>
               <span className="mx-2 mt-1 font-large">Logout</span>
            </button>
         </div>
      </>
   );

   return (
      <>
         {/* Mobile Menu Button */}
         <button
            className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-(--color-background-card) rounded-xl"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
         >
            <svg
               className="w-6 h-6 text-white"
               fill="none"
               stroke="currentColor"
               viewBox="0 0 24 24"
            >
               <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
               />
            </svg>
         </button>

         {/* Mobile Sidebar */}
         <aside
            data-sidebar="mobile"
            className={`fixed inset-y-0 left-0 bg-(--color-background-sidebar) backdrop-blur-xl p-6 flex flex-col z-40 transform ${
               isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            } transition-transform duration-300 ease-in-out lg:hidden `}
         >
            {sidebarContent}
         </aside>

         {isMobileMenuOpen && (
            <div
               className="fixed inset-0 bg-black/50 z-30 lg:hidden"
               onClick={() => setIsMobileMenuOpen(false)}
            />
         )}

         {/* Desktop Sidebar */}
         <aside
            data-sidebar="desktop"
            className="w-80 bg-(--color-background-sidebar) backdrop-blur-xl p-6 hidden lg:flex flex-col flex-shrink-0 min-h-screen"
         >
            {sidebarContent}
         </aside>
      </>
   );
}
