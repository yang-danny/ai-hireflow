import { useState } from 'react';
import LogoIcon from './icons/LogoIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import { Button } from './Button';
import type { NavigationItem } from '../types/schema';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
interface HeaderProps {
   navigation: NavigationItem[];
}

export function Header({ navigation }: HeaderProps) {
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const navigate = useNavigate();
   const { isAuthenticated } = useAuthStore();

   const handleGetStarted = () => {
      if (isAuthenticated) {
         navigate('/dashboard');
      } else {
         navigate('/auth');
      }
   };
   return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-(--color-background-dark)/95 backdrop-blur-sm border-b border-(--color-border)">
         <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
               {/* Logo */}
               <a href="/" className="flex items-center gap-3">
                  <LogoIcon width={28} height={28} color="#00c4cc" />
                  <span className="text-xl font-semibold bg-gradient-to-r from-teal-500 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                     AI HireFlow
                  </span>
               </a>

               {/* Desktop Navigation */}
               <nav className="hidden md:flex items-center gap-8">
                  {navigation.map((item) => (
                     <a
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-1 text-sm font-medium text-(--color-text-muted) hover:text-(--color-text-primary) transition-colors"
                     >
                        {item.label}
                        {item.hasDropdown && (
                           <ChevronDownIcon
                              width={7}
                              height={4}
                              color="rgba(255, 255, 255, 0.8)"
                           />
                        )}
                     </a>
                  ))}
               </nav>

               {/* Action Buttons */}
               {/* <div className="hidden md:flex items-center gap-4">
            <button className="text-sm font-bold border-2 px-6 py-2.5 my-1 rounded-lg text-(--color-primary) hover:text-(--color-primary-dark) transition-colors">
              Login
            </button>
            <Button variant="primary">Start Now</Button>
          </div> */}
               {isAuthenticated ? (
                  <button
                     onClick={() => navigate('/dashboard')}
                     className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-teal-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-cyan-500/40 transition-shadow"
                  >
                     Dashboard
                  </button>
               ) : (
                  <>
                     <button
                        onClick={() => navigate('/auth')}
                        className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                     >
                        Sign In
                     </button>
                     <button
                        onClick={() => navigate('/auth')}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-teal-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-cyan-500/40 transition-shadow"
                     >
                        Get Started
                     </button>
                  </>
               )}
               {/* Mobile Menu Button */}
               <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden text-(--color-text-primary)"
               >
                  <svg
                     width="24"
                     height="24"
                     fill="none"
                     stroke="currentColor"
                     strokeWidth="2"
                  >
                     <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
               </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
               <div className="md:hidden mt-4 pb-4 border-t border-(--color-border) pt-4">
                  <nav className="flex flex-col gap-4">
                     {navigation.map((item) => (
                        <a
                           key={item.label}
                           href={item.href}
                           className="text-sm font-medium text-(--color-text-muted) hover:text-(--color-text-primary)"
                        >
                           {item.label}
                        </a>
                     ))}
                     <div className="flex flex-col gap-3 mt-4">
                        <button className="text-sm font-bold text-(--color-primary)">
                           Login
                        </button>
                        <Button variant="primary">Start Now</Button>
                     </div>
                  </nav>
               </div>
            )}
         </div>
      </header>
   );
}
