export interface User {
   id: string;
   email: string;
   name: string;
   role: 'admin' | 'recruiter' | 'candidate';
   avatar?: string;
   isEmailVerified?: boolean;
}

export interface AuthState {
   user: User | null;
   token: string | null;
   isAuthenticated: boolean;
   isLoading: boolean;
   error: string | null;
}

export interface LoginCredentials {
   email: string;
   password: string;
}

export interface RegisterCredentials {
   email: string;
   password: string;
   name: string;
}

export interface ApiResponse<T = any> {
   success: boolean;
   message: string;
   data?: T;
   error?: string;
}

export interface AuthResponse {
   user: User;
   token: string;
}
