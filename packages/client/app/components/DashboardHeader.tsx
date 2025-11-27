import { useState, useRef, useEffect } from 'react';
import { BellNotificationIcon, HomeNavIcon, LogoutIcon } from './icons/icons';
import type { User } from '../../types/auth.types';
import { LayoutDashboard, UserPen } from 'lucide-react';
import { useAuthStore } from 'store/useAuthStore';

interface DashboardHeaderProps {
   user: User;
   onNavigate?: (destination: string) => void;
}

export function DashboardHeader({ user, onNavigate }: DashboardHeaderProps) {
   const [isPopupOpen, setIsPopupOpen] = useState(false);
   const popupRef = useRef<HTMLDivElement>(null);
   const { logout } = useAuthStore();

   const handleLogout = () => {
      logout();
      onNavigate?.('/');
   };
   // Close popup when clicking outside
   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (
            popupRef.current &&
            !popupRef.current.contains(event.target as Node)
         ) {
            setIsPopupOpen(false);
         }
      };

      if (isPopupOpen) {
         document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, [isPopupOpen]);

   // Extract first name from user.name (assuming it's "FirstName LastName")
   const getFirstName = () => {
      const names = user.name.split(' ');
      return names[0];
   };

   const getLastName = () => {
      const names = user.name.split(' ');
      return names.slice(1).join(' ') || '';
   };

   return (
      <header className="flex items-center justify-between p-6 border-b-2 border-(--color-border)">
         <h1 className="text-2xl font-bold text-(--color-text-primary)">
            Welcome, {user.name} 👋
         </h1>

         <div className="flex items-center gap-4">
            <button className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/15 transition-colors">
               <BellNotificationIcon
                  width={16}
                  height={16}
                  color="rgba(255, 255, 255, 0.9)"
               />
               <div className="absolute top-2 right-2 w-2 h-2 bg-(--color-primary) rounded-full shadow-[0_0_0_2px_#1a1a2e]" />
            </button>

            {/* User Avatar with Popup */}
            <div className="relative" ref={popupRef}>
               <button
                  onClick={() => setIsPopupOpen(!isPopupOpen)}
                  className="flex items-center justify-center cursor-pointer"
               >
                  {user.avatar ? (
                     <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-transparent hover:border-(--color-primary) transition-colors"
                     />
                  ) : (
                     <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg font-bold text-white border-2 border-transparent hover:border-(--color-primary) transition-colors">
                        {getFirstName().charAt(0).toUpperCase()}
                     </div>
                  )}
               </button>

               {/* Popup Menu */}
               {isPopupOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-(--color-background-card) rounded-lg shadow-lg border-2 border-(--color-border) overflow-hidden z-50">
                     {/* User Info Section */}
                     <div className="p-4 border-b border-(--color-border)">
                        <div className="flex items-center gap-3 mb-3">
                           {user.avatar ? (
                              <img
                                 src={user.avatar}
                                 alt={user.name}
                                 className="w-12 h-12 rounded-full object-cover"
                              />
                           ) : (
                              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl font-bold text-white">
                                 {getFirstName().charAt(0).toUpperCase()}
                              </div>
                           )}
                           <div className="flex-1">
                              <div className="text-sm font-semibold text-(--color-text-primary)">
                                 {getFirstName()} {getLastName()}
                              </div>
                              <div className="text-xs text-(--color-text-secondary) mt-0.5">
                                 {user.email}
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Navigation Links */}
                     <div className="py-2">
                        <button
                           className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-(--color-text-primary) w-full text-left cursor-pointer"
                           onClick={() => {
                              setIsPopupOpen(false);
                              onNavigate?.('home');
                           }}
                        >
                           <HomeNavIcon width={18} height={18} />
                           <span className="text-sm">Home</span>
                        </button>

                        <button
                           className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-(--color-text-primary) w-full text-left cursor-pointer"
                           onClick={() => {
                              setIsPopupOpen(false);
                              onNavigate?.('dashboard');
                           }}
                        >
                           <LayoutDashboard className="w-5 h-5" />
                           <span className="text-sm">Dashboard</span>
                        </button>

                        <button
                           className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-(--color-text-primary) w-full text-left cursor-pointer"
                           onClick={() => {
                              setIsPopupOpen(false);
                              onNavigate?.('profile');
                           }}
                        >
                           <UserPen className="w-5 h-5" />
                           <span className="text-sm">Profile</span>
                        </button>

                        <button
                           className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-(--color-text-primary) w-full text-left cursor-pointer"
                           onClick={() => {
                              setIsPopupOpen(false);
                              handleLogout();
                           }}
                        >
                           <LogoutIcon width={18} height={18} />
                           <span className="text-sm">Logout</span>
                        </button>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </header>
   );
}
