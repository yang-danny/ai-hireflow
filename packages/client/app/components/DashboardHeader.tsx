import { BellNotificationIcon } from './icons/icons';
import type { User } from '../../types/auth.types';

interface DashboardHeaderProps {
   user: User;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
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

            {user.avatar ? (
               <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-transparent hover:border-(--color-primary) transition-colors"
               />
            ) : (
               <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg font-bold text-white border-2 border-transparent hover:border-(--color-primary) transition-colors">
                  {user.name.charAt(0).toUpperCase()}
               </div>
            )}
         </div>
      </header>
   );
}
