import api from './api';
import type {
   Resume,
   ApiResponse,
   GetResumesData,
} from '../types/resume.types';

export const uploadResume = async (formData: FormData): Promise<Resume> => {
   const response = await api.post<ApiResponse<Resume>>(
      '/api/resumes/upload',
      formData,
      {
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      }
   );
   return response.data.data;
};

export const getResumes = async (): Promise<Resume[]> => {
   const response = await api.get<ApiResponse<GetResumesData>>('/api/resumes');
   return response.data.data.resumes;
};

export const getResumeById = async (id: string): Promise<Resume> => {
   const response = await api.get<ApiResponse<Resume>>(`/api/resumes/${id}`);
   return response.data.data;
};

export const deleteResume = async (id: string): Promise<void> => {
   await api.delete(`/api/resumes/${id}`);
};
