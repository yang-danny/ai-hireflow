import axios, {
   type AxiosInstance,
   AxiosError,
   type InternalAxiosRequestConfig,
} from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance
const api: AxiosInstance = axios.create({
   baseURL: API_BASE_URL,
   headers: {
      'Content-Type': 'application/json',
   },
   withCredentials: true, // Important for cookies and CORS
   timeout: 10000, // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
   (config: InternalAxiosRequestConfig) => {
      // Get token from localStorage
      const token = localStorage.getItem('token');

      if (token && config.headers) {
         config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
   },
   (error: AxiosError) => {
      return Promise.reject(error);
   }
);

// Response interceptor
api.interceptors.response.use(
   (response) => response,
   (error: AxiosError) => {
      if (error.response?.status === 401) {
         // Clear token and redirect to login
         localStorage.removeItem('token');
         if (typeof window !== 'undefined') {
            window.location.href = '/auth';
         }
      }
      return Promise.reject(error);
   }
);

export default api;
