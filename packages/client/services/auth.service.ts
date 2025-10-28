import api from './api';
import type {
   LoginCredentials,
   RegisterCredentials,
   AuthResponse,
   ApiResponse,
   User,
} from '../types/auth.types';

export class AuthService {
   /**
    * Register with email and password
    */
   static async register(
      credentials: RegisterCredentials
   ): Promise<AuthResponse> {
      const response = await api.post<ApiResponse<AuthResponse>>(
         '/api/auth/register',
         credentials
      );
      return response.data.data!;
   }

   /**
    * Login with email and password
    */
   static async login(credentials: LoginCredentials): Promise<AuthResponse> {
      const response = await api.post<ApiResponse<AuthResponse>>(
         '/api/auth/login',
         credentials
      );
      return response.data.data!;
   }

   /**
    * Get current user
    */
   static async getCurrentUser(): Promise<User> {
      const response = await api.get<ApiResponse<User>>('/api/auth/me');
      return response.data.data!;
   }

   /**
    * Logout
    */
   static async logout(): Promise<void> {
      await api.post('/api/auth/logout');
   }

   /**
    * Initiate Google OAuth
    */
   static googleLogin(): void {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const googleOAuthUrl = `${API_URL}/api/auth/google`;

      console.log('Redirecting to Google OAuth:', googleOAuthUrl);

      // Redirect to backend OAuth endpoint
      window.location.href = googleOAuthUrl;
   }

   /**
    * Handle OAuth callback (extract token from URL)
    */
   static handleOAuthCallback(): string | null {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('token');
   }
}
