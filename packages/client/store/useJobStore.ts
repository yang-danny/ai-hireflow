import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Job } from '../types/job.types';
import api from '../services/api';
import { showToast } from '~/components/Toast';
interface JobState {
   jobs: Job[];
   currentJob: Job | null;
   loading: boolean;
   error: string | null;
}

interface JobActions {
   fetchJobs: () => Promise<void>;
   loadJob: (id: string) => Promise<void>;
   createJob: (jobData: Partial<Job>) => Promise<Job>;
   updateJob: (id: string, jobData: Partial<Job>) => Promise<void>;
   deleteJob: (id: string) => Promise<void>;
   setCurrentJob: (job: Job | null) => void;
   clearError: () => void;
   setLoading: (loading: boolean) => void;
}

type JobStore = JobState & JobActions;

export const useJobStore = create<JobStore>()(
   persist(
      (set, get) => ({
         jobs: [],
         currentJob: null,
         loading: false,
         error: null,

         fetchJobs: async () => {
            try {
               set({ loading: true, error: null });
               const response = await api.get('/api/jobs');
               set({ jobs: response.data.data.jobs, loading: false });
            } catch (error: any) {
               const errorMessage =
                  error.response?.data?.message || 'Failed to fetch jobs.';
               set({ error: errorMessage, loading: false });
            }
         },

         loadJob: async (id: string) => {
            try {
               set({ loading: true, error: null });
               const response = await api.get(`/api/jobs/${id}`);
               set({ currentJob: response.data.data, loading: false });
            } catch (error: any) {
               const errorMessage =
                  error.response?.data?.message || 'Failed to load job.';
               set({ error: errorMessage, loading: false });
            }
         },

         createJob: async (jobData: Partial<Job>) => {
            try {
               set({ loading: true, error: null });
               const response = await api.post('/api/jobs', jobData);
               const newJob = response.data.data;
               set((state) => ({
                  jobs: [...state.jobs, newJob],
                  currentJob: newJob,
                  loading: false,
               }));
               showToast.success('Job created successfully!');
               return newJob;
            } catch (error: any) {
               const errorMessage =
                  error.response?.data?.message || 'Failed to create job.';
               set({ error: errorMessage, loading: false });
               throw error;
            }
         },

         updateJob: async (id: string, jobData: Partial<Job>) => {
            try {
               set({ loading: true, error: null });
               const response = await api.put(`/api/jobs/${id}`, jobData);
               const updatedJob = response.data.data;
               set((state) => ({
                  jobs: state.jobs.map((job) =>
                     job._id === id ? updatedJob : job
                  ),
                  currentJob:
                     state.currentJob?._id === id
                        ? updatedJob
                        : state.currentJob,
                  loading: false,
               }));
               showToast.success('Job updated successfully!');
            } catch (error: any) {
               const errorMessage =
                  error.response?.data?.message || 'Failed to update job.';
               set({ error: errorMessage, loading: false });
            }
         },

         deleteJob: async (id: string) => {
            try {
               set({ loading: true, error: null });
               await api.delete(`/api/jobs/${id}`);
               set((state) => ({
                  jobs: state.jobs.filter((job) => job._id !== id),
                  currentJob:
                     state.currentJob?._id === id ? null : state.currentJob,
                  loading: false,
               }));
               showToast.success('Job deleted successfully!');
            } catch (error: any) {
               const errorMessage =
                  error.response?.data?.message || 'Failed to delete job.';
               set({ error: errorMessage, loading: false });
            }
         },

         setCurrentJob: (job: Job | null) => {
            set({ currentJob: job });
         },

         clearError: () => {
            set({ error: null });
         },

         setLoading: (loading: boolean) => {
            set({ loading });
         },
      }),
      {
         name: 'job-storage',
         storage: createJSONStorage(() => localStorage),
         partialize: (state) => ({
            jobs: state.jobs,
            currentJob: state.currentJob,
         }),
      }
   )
);
