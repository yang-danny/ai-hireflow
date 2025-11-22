import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { GoogleIcon, LinkedInIcon, LogoIcon } from '../components/icons/icons';
import { useAuthStore } from '../../store/useAuthStore';
import { Github } from 'lucide-react';
const InputField = ({
   id,
   label,
   type,
   placeholder,
   autoComplete,
   value,
   onChange,
   error,
}: {
   id: string;
   label: string;
   type: string;
   placeholder: string;
   autoComplete: string;
   value: string;
   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
   error?: string;
}) => (
   <div>
      <label
         htmlFor={id}
         className="block text-sm font-medium text-gray-300 mb-2"
      >
         {label}
      </label>
      <input
         type={type}
         id={id}
         name={id}
         placeholder={placeholder}
         autoComplete={autoComplete}
         value={value}
         onChange={onChange}
         required
         className={`w-full bg-[#1A1D2A] border ${
            error ? 'border-red-500' : 'border-gray-700'
         } rounded-lg px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
   </div>
);

const SocialButton = ({
   icon,
   text,
   onClick,
   disabled,
}: {
   icon: React.ReactNode;
   text: string;
   onClick: () => void;
   disabled?: boolean;
}) => (
   <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="cursor-pointer flex items-center justify-center w-full h-14 py-3 px-4 border border-gray-700 rounded-lg text-gray-300 border-2 border-(--color-border) hover:border-(--color-primary) hover:shadow-[var(--shadow-card-highlighted)] transition-all duration-500 hover:translate-y-[-4px]"
   >
      {icon}

      <span className="ml-3 font-medium">{text}</span>
   </button>
);

const Auth = () => {
   const navigate = useNavigate();
   const [searchParams] = useSearchParams();
   const {
      login,
      register,
      googleLogin,
      isLoading,
      error,
      clearError,
      isAuthenticated,
   } = useAuthStore();

   const [isSignIn, setIsSignIn] = useState(true);
   const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
   });
   const [formErrors, setFormErrors] = useState({
      name: '',
      email: '',
      password: '',
   });

   // Get error from URL params (for OAuth failures)
   const urlError = searchParams.get('error');

   // Redirect if already authenticated
   useEffect(() => {
      if (isAuthenticated) {
         navigate('/dashboard', { replace: true });
      }
   }, [isAuthenticated, navigate]);

   // Clear errors when switching between sign in and sign up
   useEffect(() => {
      clearError();
      setFormErrors({ name: '', email: '', password: '' });
   }, [isSignIn, clearError]);

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
   };

   const validateForm = (): boolean => {
      const errors = { name: '', email: '', password: '' };
      let isValid = true;

      if (!isSignIn && !formData.name.trim()) {
         errors.name = 'Name is required';
         isValid = false;
      } else if (!isSignIn && formData.name.trim().length < 2) {
         errors.name = 'Name must be at least 2 characters';
         isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim()) {
         errors.email = 'Email is required';
         isValid = false;
      } else if (!emailRegex.test(formData.email)) {
         errors.email = 'Please enter a valid email';
         isValid = false;
      }

      if (!formData.password) {
         errors.password = 'Password is required';
         isValid = false;
      } else if (formData.password.length < 6) {
         errors.password = 'Password must be at least 6 characters';
         isValid = false;
      }

      setFormErrors(errors);
      return isValid;
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
         return;
      }

      try {
         if (isSignIn) {
            await login({
               email: formData.email,
               password: formData.password,
            });
         } else {
            await register({
               name: formData.name,
               email: formData.email,
               password: formData.password,
            });
         }
         // Navigation happens automatically via useEffect
      } catch (error) {
         console.error('Auth error:', error);
      }
   };

   const handleGoogleLogin = () => {
      googleLogin();
   };

   const toggleAuthMode = () => {
      setIsSignIn(!isSignIn);
      setFormData({ name: '', email: '', password: '' });
      setFormErrors({ name: '', email: '', password: '' });
   };

   const displayError =
      error || (urlError ? decodeURIComponent(urlError) : null);

   return (
      <div className="bg-(--color-background-dark) min-h-screen flex items-center justify-center p-4 font-sans text-gray-200">
         <div className="w-full max-w-md">
            <div className="bg-gradient-to-br bg-(--color-background-card) to-[#1A1D2A] p-8 rounded-2xl border border-gray-700/50 shadow-2xl shadow-cyan-500/5">
               <div className="text-center items-center mb-8">
                  <a
                     href="/"
                     className="flex items-center justify-center mb-6 gap-3"
                  >
                     <LogoIcon width={28} height={28} color="#00c4cc" />
                     <span className="text-xl font-semibold bg-gradient-to-r from-teal-500 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                        AI HireFlow
                     </span>
                  </a>
                  <h2 className="text-3xl font-bold text-white">
                     {isSignIn ? 'Welcome Back' : 'Create an Account'}
                  </h2>
                  <p className="text-gray-400 mt-2">
                     {isSignIn
                        ? 'Sign in to access your dashboard.'
                        : 'Join us and land your dream job.'}
                  </p>
               </div>

               {/* Error Alert */}
               {displayError && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                     <p className="text-sm text-red-400">{displayError}</p>
                  </div>
               )}

               <form onSubmit={handleSubmit} className="space-y-6">
                  {!isSignIn && (
                     <InputField
                        id="name"
                        label="Full Name"
                        type="text"
                        placeholder="John Doe"
                        autoComplete="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        error={formErrors.name}
                     />
                  )}
                  <InputField
                     id="email"
                     label="Email Address"
                     type="email"
                     placeholder="you@example.com"
                     autoComplete="email"
                     value={formData.email}
                     onChange={handleInputChange}
                     error={formErrors.email}
                  />
                  <div>
                     <InputField
                        id="password"
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        autoComplete={
                           isSignIn ? 'current-password' : 'new-password'
                        }
                        value={formData.password}
                        onChange={handleInputChange}
                        error={formErrors.password}
                     />
                     {isSignIn && (
                        <div className="text-right mt-2">
                           <a
                              href="#"
                              className="text-sm text-cyan-400 hover:text-cyan-300"
                           >
                              Forgot password?
                           </a>
                        </div>
                     )}
                  </div>

                  <button
                     type="submit"
                     disabled={isLoading}
                     className="cursor-pointer w-full bg-gradient-to-r from-cyan-400 to-teal-500 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-cyan-500/40 transition-shadow duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                     {isLoading ? (
                        <>
                           <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                           >
                              <circle
                                 className="opacity-25"
                                 cx="12"
                                 cy="12"
                                 r="10"
                                 stroke="currentColor"
                                 strokeWidth="4"
                              ></circle>
                              <path
                                 className="opacity-75"
                                 fill="currentColor"
                                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                           </svg>
                           Processing...
                        </>
                     ) : (
                        <>{isSignIn ? 'Sign In' : 'Create Account'}</>
                     )}
                  </button>
               </form>

               <div className="flex items-center my-8">
                  <hr className="flex-grow border-gray-700" />
                  <span className="mx-4 text-gray-500 text-sm font-medium">
                     OR
                  </span>
                  <hr className="flex-grow border-gray-700" />
               </div>

               <div className="space-y-4">
                  <SocialButton
                     icon={<GoogleIcon className="w-6 h-6" />}
                     text="Continue with Google"
                     onClick={handleGoogleLogin}
                     disabled={isLoading}
                  />
                  <SocialButton
                     icon={<LinkedInIcon className="w-6 h-6" />}
                     text="Continue with LinkedIn"
                     onClick={() => alert('LinkedIn login coming soon!')}
                     disabled={isLoading}
                  />
                  <SocialButton
                     icon={<Github className="w-6 h-6" />}
                     text="Continue with GitHub"
                     onClick={() => alert('GitHub login coming soon!')}
                     disabled={isLoading}
                  />
               </div>

               <p className="text-center text-sm text-gray-400 mt-8">
                  {isSignIn
                     ? "Don't have an account?"
                     : 'Already have an account?'}
                  <button
                     onClick={toggleAuthMode}
                     disabled={isLoading}
                     className="font-semibold text-cyan-400 hover:text-cyan-300 ml-1 disabled:opacity-50 cursor-pointer"
                  >
                     {isSignIn ? 'Sign Up' : 'Sign In'}
                  </button>
               </p>
            </div>
         </div>
      </div>
   );
};

export default Auth;
