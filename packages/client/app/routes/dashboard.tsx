import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router';

export default function Dashboard() {
   const { user, logout } = useAuthStore();
   const navigate = useNavigate();

   const handleLogout = async () => {
      await logout();
      navigate('/auth', { replace: true });
   };

   return (
      <div className="min-h-screen bg-[#10141E] p-8">
         <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-[#2A2D42] to-[#1A1D2A] p-8 rounded-2xl border border-gray-700/50">
               <div className="flex items-center justify-between mb-6">
                  <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                  <button
                     onClick={handleLogout}
                     className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                  >
                     Logout
                  </button>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                     {user?.avatar ? (
                        <img
                           src={user.avatar}
                           alt={user.name}
                           className="w-16 h-16 rounded-full"
                        />
                     ) : (
                        <div className="w-16 h-16 rounded-full bg-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
                           {user?.name.charAt(0).toUpperCase()}
                        </div>
                     )}
                     <div>
                        <h2 className="text-2xl font-bold text-white">
                           {user?.name}
                        </h2>
                        <p className="text-gray-400">{user?.email}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm">
                           {user?.role}
                        </span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
