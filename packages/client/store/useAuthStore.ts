import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthService } from '../services/auth.service';
import type {
   AuthState,
   User,
   LoginCredentials,
   RegisterCredentials,
} from '../types/auth.types';

interface AuthActions {
   login: (credentials: LoginCredentials) => Promise<void>;
   register: (credentials: RegisterCredentials) => Promise<void>;
   logout: () => Promise<void>;
   googleLogin: () => void;
   fetchUser: () => Promise<void>;
   setToken: (token: string) => void;
   clearError: () => void;
   setLoading: (loading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
   persist(
      (set, get) => ({
         // State
         user: null,
         token: null,
         isAuthenticated: false,
         isLoading: false,
         error: null,

         // Actions
         login: async (credentials: LoginCredentials) => {
            try {
               set({ isLoading: true, error: null });

               const { user, token } = await AuthService.login(credentials);

               // Store token
               localStorage.setItem('token', token);

               set({
                  user,
                  token,
                  isAuthenticated: true,
                  isLoading: false,
                  error: null,
               });
            } catch (error: any) {
               const errorMessage =
                  error.response?.data?.message || 'Login failed';
               set({
                  error: errorMessage,
                  isLoading: false,
               });
               throw error;
            }
         },

         register: async (credentials: RegisterCredentials) => {
            try {
               set({ isLoading: true, error: null });

               const { user, token } = await AuthService.register(credentials);

               // Store token
               localStorage.setItem('token', token);

               set({
                  user,
                  token,
                  isAuthenticated: true,
                  isLoading: false,
                  error: null,
               });
            } catch (error: any) {
               const errorMessage =
                  error.response?.data?.message || 'Registration failed';
               set({
                  error: errorMessage,
                  isLoading: false,
               });
               throw error;
            }
         },

         logout: async () => {
            try {
               await AuthService.logout();
            } catch (error) {
               console.error('Logout error:', error);
            } finally {
               // Clear state and storage
               localStorage.removeItem('token');
               set({
                  user: null,
                  token: null,
                  isAuthenticated: false,
                  error: null,
               });
            }
         },

         googleLogin: () => {
            AuthService.googleLogin();
         },

         fetchUser: async () => {
            try {
               set({ isLoading: true, error: null });

               const user = await AuthService.getCurrentUser();

               set({
                  user,
                  isAuthenticated: true,
                  isLoading: false,
                  error: null,
               });
            } catch (error: any) {
               const errorMessage =
                  error.response?.data?.message || 'Failed to fetch user';
               set({
                  error: errorMessage,
                  isLoading: false,
                  isAuthenticated: false,
               });
               // Clear invalid token
               localStorage.removeItem('token');
            }
         },

         setToken: (token: string) => {
            localStorage.setItem('token', token);
            set({ token, isAuthenticated: true });
         },

         clearError: () => {
            set({ error: null });
         },

         setLoading: (loading: boolean) => {
            set({ isLoading: loading });
         },
      }),
      {
         name: 'auth-storage',
         storage: createJSONStorage(() => localStorage),
         partialize: (state) => ({
            token: state.token,
            user: state.user,
            isAuthenticated: state.isAuthenticated,
         }),
      }
   )
);
