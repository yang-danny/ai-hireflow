import React, { useState } from 'react';
import type { NavItemProps } from '../types/schema';
import {
   HomeIcon,
   ResumeIcon,
   CoverLetterIcon,
   InterviewIcon,
   SettingsIcon,
   LogoIcon,
} from '../components/icons/icons';

const NavItem: React.FC<NavItemProps> = ({ icon, label, active = false }) => {
   return (
      <li
         className={`rounded-lg transition-colors duration-200 ${active ? 'bg-[#2C3149]' : 'hover:bg-[#2C3149]/50'}`}
      >
         <a
            href="#"
            className={`flex items-center p-3 space-x-3 font-medium ${active ? 'text-white' : 'text-gray-400'}`}
         >
            {icon}
            <span>{label}</span>
         </a>
      </li>
   );
};

const Sidebar = () => {
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

   const navItems = [
      { icon: <HomeIcon className="w-5 h-5" />, label: 'Home', active: true },
      {
         icon: <ResumeIcon className="w-5 h-5" />,
         label: 'AI Resume Generator',
      },
      { icon: <ResumeIcon className="w-5 h-5" />, label: 'AI Resume Analyzer' },
      {
         icon: <CoverLetterIcon className="w-5 h-5" />,
         label: 'AI Cover Letter Generator',
      },
      {
         icon: <InterviewIcon className="w-5 h-5" />,
         label: 'AI Interview Preparation',
      },
   ];

   const sidebarContent = (
      <>
         <div className="flex items-center space-x-2 mb-12 flex-shrink-0 px-2">
            <LogoIcon />
            <span className="text-xl font-bold text-white">AI HireFlow</span>
         </div>
         <nav className="flex-1">
            <ul className="space-y-2">
               {navItems.map((item) => (
                  <NavItem key={item.label} {...item} />
               ))}
            </ul>
         </nav>
         <div className="mt-12">
            <NavItem
               icon={<SettingsIcon className="w-5 h-5" />}
               label="Settings"
            />
         </div>
      </>
   );

   return (
      <>
         {/* Mobile Menu Button */}
         <button
            className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#1A1D2A] rounded-md"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
         >
            <svg
               className="w-6 h-6 text-white"
               fill="none"
               stroke="currentColor"
               viewBox="0 0 24 24"
               xmlns="http://www.w3.org/2000/svg"
            >
               <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
               ></path>
            </svg>
         </button>

         {/* Mobile Sidebar */}
         <aside
            className={`fixed inset-y-0 left-0 bg-[#1A1D2A] p-6 flex flex-col z-40 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:hidden w-64`}
         >
            {sidebarContent}
         </aside>
         {isMobileMenuOpen && (
            <div
               className="fixed inset-0 bg-black/50 z-30 lg:hidden"
               onClick={() => setIsMobileMenuOpen(false)}
            ></div>
         )}

         {/* Desktop Sidebar */}
         <aside className="w-64 bg-[#1A1D2A] p-6 hidden lg:flex flex-col flex-shrink-0">
            {sidebarContent}
         </aside>
      </>
   );
};

export default Sidebar;
