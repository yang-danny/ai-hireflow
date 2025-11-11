export interface PersonalInfo {
   image?: File | string;
   full_name?: string;
   email?: string;
   phone?: string;
   location?: string;
   profession?: string;
   linkedin?: string;
   github?: string;
   website?: string;
}

export interface Experience {
   _id?: string;
   position: string;
   company: string;
   start_date: string;
   end_date: string;
   is_current: boolean;
   description: string;
}

export interface Education {
   _id?: string;
   degree: string;
   field: string;
   institution: string;
   gpa: string;
   graduation_date: string;
}

export interface Project {
   _id?: string;
   name: string;
   type: string;
   description: string;
}

export interface Resume {
   _id: string;
   userId?: string;
   title: string;
   personal_info: PersonalInfo;
   professional_summary: string;
   experience: Experience[];
   education: Education[];
   project: Project[];
   skills: string[];
   template: string;
   accent_color: string;
   public: boolean;
   updatedAt?: string;
   createdAt?: string;
}
