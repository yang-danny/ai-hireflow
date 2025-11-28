import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '../../store/useAuthStore';
import { useEffect, useState, Suspense } from 'react';
import RouteLoadingFallback from '../components/RouteLoadingFallback';

export default function ProtectedLayout() {
   const { isAuthenticated, token, fetchUser } = useAuthStore();
   const [isChecking, setIsChecking] = useState(true);

   useEffect(() => {
      const checkAuth = async () => {
         if (token && !isAuthenticated) {
            try {
               await fetchUser();
            } catch (error) {
               console.error('Failed to fetch user:', error);
            }
         }
         setIsChecking(false);
      };

      checkAuth();
   }, [token, isAuthenticated, fetchUser]);

   if (isChecking) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-[#10141E]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
         </div>
      );
   }

   if (!isAuthenticated) {
      return <Navigate to="/auth" replace />;
   }

   return (
      <Suspense fallback={<RouteLoadingFallback />}>
         <Outlet />
      </Suspense>
   );
}
