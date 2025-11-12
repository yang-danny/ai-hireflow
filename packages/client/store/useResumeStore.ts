import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Resume } from '../types/resume.types';
import api from '../services/api';

interface ResumeState {
   resumes: Resume[];
   currentResume: Resume | null;
   loading: boolean;
   error: string | null;
}

interface ResumeActions {
   fetchResumes: () => Promise<void>;
   loadResume: (id: string) => Promise<void>;
   createResume: (resumeData: Partial<Resume>) => Promise<Resume>;
   updateResume: (id: string, resumeData: Partial<Resume>) => Promise<void>;
   deleteResume: (id: string) => Promise<void>;
   setCurrentResume: (resume: Resume | null) => void;
   clearError: () => void;
   setLoading: (loading: boolean) => void;
}

type ResumeStore = ResumeState & ResumeActions;

export const useResumeStore = create<ResumeStore>()(
   persist(
      (set, get) => ({
         resumes: [],
         currentResume: null,
         loading: false,
         error: null,

         fetchResumes: async () => {
            try {
               set({ loading: true, error: null });
               const response = await api.get('/api/resumes');
               set({ resumes: response.data.data.resumes, loading: false });
            } catch (error: any) {
               const errorMessage =
                  error.response?.data?.message || 'Failed to fetch resumes.';
               set({ error: errorMessage, loading: false });
            }
         },

         loadResume: async (id: string) => {
            try {
               set({ loading: true, error: null });
               const response = await api.get(`/api/resumes/${id}`);
               set({ currentResume: response.data.data, loading: false });
            } catch (error: any) {
               const errorMessage =
                  error.response?.data?.message || 'Failed to load resume.';
               set({ error: errorMessage, loading: false });
            }
         },

         createResume: async (resumeData: Partial<Resume>) => {
            try {
               set({ loading: true, error: null });
               const response = await api.post('/api/resumes', resumeData);
               const newResume = response.data.data;
               set((state) => ({
                  resumes: [...state.resumes, newResume],
                  currentResume: newResume,
                  loading: false,
               }));
               return newResume;
            } catch (error: any) {
               const errorMessage =
                  error.response?.data?.message || 'Failed to create resume.';
               set({ error: errorMessage, loading: false });
               throw error;
            }
         },

         updateResume: async (id: string, resumeData: Partial<Resume>) => {
            try {
               set({ loading: true, error: null });
               const response = await api.put(`/api/resumes/${id}`, resumeData);
               const updatedResume = response.data.data;
               set((state) => ({
                  resumes: state.resumes.map((resume) =>
                     resume._id === id ? updatedResume : resume
                  ),
                  currentResume:
                     state.currentResume?._id === id
                        ? updatedResume
                        : state.currentResume,
                  loading: false,
               }));
            } catch (error: any) {
               const errorMessage =
                  error.response?.data?.message || 'Failed to update resume.';
               set({ error: errorMessage, loading: false });
            }
         },

         deleteResume: async (id: string) => {
            try {
               set({ loading: true, error: null });
               await api.delete(`/api/resumes/${id}`);
               set((state) => ({
                  resumes: state.resumes.filter((resume) => resume._id !== id),
                  currentResume:
                     state.currentResume?._id === id
                        ? null
                        : state.currentResume,
                  loading: false,
               }));
            } catch (error: any) {
               const errorMessage =
                  error.response?.data?.message || 'Failed to delete resume.';
               set({ error: errorMessage, loading: false });
            }
         },

         setCurrentResume: (resume: Resume | null) => {
            set({ currentResume: resume });
         },

         clearError: () => {
            set({ error: null });
         },

         setLoading: (loading: boolean) => {
            set({ loading });
         },
      }),
      {
         name: 'resume-storage',
         storage: createJSONStorage(() => localStorage),
         partialize: (state) => ({
            resumes: state.resumes,
            currentResume: state.currentResume,
         }),
      }
   )
);
