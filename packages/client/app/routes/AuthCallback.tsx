import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuthStore } from '../../store/useAuthStore';

export default function AuthCallback() {
   const navigate = useNavigate();
   const [searchParams] = useSearchParams();
   const { setToken, fetchUser } = useAuthStore();

   useEffect(() => {
      const handleCallback = async () => {
         try {
            const token = searchParams.get('token');

            if (token) {
               setToken(token);
               await fetchUser();
               navigate('/dashboard', { replace: true });
            } else {
               navigate('/auth?error=no_token', { replace: true });
            }
         } catch (error) {
            console.error('OAuth callback error:', error);
            navigate('/auth?error=oauth_failed', { replace: true });
         }
      };

      handleCallback();
   }, [navigate, setToken, fetchUser, searchParams]);

   return (
      <div className="bg-[#10141E] min-h-screen flex items-center justify-center">
         <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-300 text-lg">Completing sign in...</p>
         </div>
      </div>
   );
}
