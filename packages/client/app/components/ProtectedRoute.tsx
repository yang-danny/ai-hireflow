import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useEffect, useState } from 'react';

export const ProtectedRoute = () => {
   const { isAuthenticated, token, fetchUser } = useAuthStore();
   const [isChecking, setIsChecking] = useState(true);
   const location = useLocation();

   useEffect(() => {
      const checkAuth = async () => {
         // If we have a token but haven't verified the user yet
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
      // Redirect to auth page, but save the location they were trying to go to
      return <Navigate to="/auth" state={{ from: location }} replace />;
   }

   return <Outlet />;
};
