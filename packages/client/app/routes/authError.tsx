import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { LogoIcon } from '../components/icons/icons';

export default function AuthError() {
   const [searchParams] = useSearchParams();
   const navigate = useNavigate();
   const [errorMessage, setErrorMessage] = useState('');

   useEffect(() => {
      const message = searchParams.get('message');
      setErrorMessage(message || 'Authentication failed');
   }, [searchParams]);

   return (
      <div className="bg-[#10141E] min-h-screen flex items-center justify-center p-4">
         <div className="w-full max-w-md">
            <div className="bg-gradient-to-br from-[#2A2D42] to-[#1A1D2A] p-8 rounded-2xl border border-gray-700/50">
               <div className="text-center mb-8">
                  <div className="flex justify-center items-center space-x-3 mb-4">
                     <LogoIcon />
                     <span className="text-2xl font-bold text-white">
                        AI HireFlow
                     </span>
                  </div>

                  <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                     <svg
                        className="w-8 h-8 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M6 18L18 6M6 6l12 12"
                        />
                     </svg>
                  </div>

                  <h2 className="text-3xl font-bold text-white mb-2">
                     Authentication Failed
                  </h2>
               </div>

               <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                  <p className="text-sm text-red-400 text-center">
                     {errorMessage}
                  </p>
               </div>

               <button
                  onClick={() => navigate('/auth', { replace: true })}
                  className="w-full bg-gradient-to-r from-cyan-400 to-teal-500 text-white font-bold py-3 px-6 rounded-xl"
               >
                  Try Again
               </button>
            </div>
         </div>
      </div>
   );
}
