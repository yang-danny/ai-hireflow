import mongoose, { Schema, Document, Types } from 'mongoose';

interface IPersonalInfo {
   image?: string;
   full_name?: string;
   email?: string;
   phone?: string;
   location?: string;
   profession?: string;
   linkedin?: string;
   github?: string;
   website?: string;
}

interface IExperience {
   position: string;
   company: string;
   start_date: string;
   end_date: string;
   is_current: boolean;
   description: string;
}

interface IEducation {
   degree: string;
   field: string;
   institution: string;
   gpa: string;
   graduation_date: string;
}

interface IProject {
   name: string;
   type: string;
   description: string;
}

export interface IResumeDocument extends Document {
   _id: Types.ObjectId;
   userId: Types.ObjectId;
   title: string;
   personal_info: IPersonalInfo;
   professional_summary: string;
   experience: IExperience[];
   education: IEducation[];
   project: IProject[];
   skills: string[];
   template: string;
   accent_color: string;
   public: boolean;
   createdAt: Date;
   updatedAt: Date;
}

const PersonalInfoSchema = new Schema<IPersonalInfo>(
   {
      image: { type: String },
      full_name: { type: String },
      email: { type: String },
      phone: { type: String },
      location: { type: String },
      profession: { type: String },
      linkedin: { type: String },
      github: { type: String },
      website: { type: String },
   },
   { _id: false }
);

const ExperienceSchema = new Schema<IExperience>(
   {
      position: { type: String, required: true },
      company: { type: String, required: true },
      start_date: { type: String, required: true },
      end_date: { type: String },
      is_current: { type: Boolean, default: false },
      description: { type: String },
   },
   { _id: false }
);

const EducationSchema = new Schema<IEducation>(
   {
      degree: { type: String, required: true },
      field: { type: String, required: true },
      institution: { type: String, required: true },
      gpa: { type: String },
      graduation_date: { type: String },
   },
   { _id: false }
);

const ProjectSchema = new Schema<IProject>(
   {
      name: { type: String, required: true },
      type: { type: String, required: true },
      description: { type: String },
   },
   { _id: false }
);

const ResumeSchema = new Schema<IResumeDocument>(
   {
      userId: {
         type: Schema.Types.ObjectId,
         ref: 'User',
         required: true,
         index: true,
      },
      title: {
         type: String,
         required: [true, 'Resume title is required'],
         trim: true,
      },
      personal_info: {
         type: PersonalInfoSchema,
         default: {},
      },
      professional_summary: {
         type: String,
         default: '',
      },
      experience: {
         type: [ExperienceSchema],
         default: [],
      },
      education: {
         type: [EducationSchema],
         default: [],
      },
      project: {
         type: [ProjectSchema],
         default: [],
      },
      skills: {
         type: [String],
         default: [],
      },
      template: {
         type: String,
         default: 'default',
      },
      accent_color: {
         type: String,
         default: '#00c4cc',
      },
      public: {
         type: Boolean,
         default: false,
         index: true,
      },
   },
   {
      timestamps: true,
   }
);

// Indexes for better query performance
// Compound index for user's resumes sorted by update date (most common query)
ResumeSchema.index({ userId: 1, updatedAt: -1 });
// Index for public resumes
ResumeSchema.index({ public: 1, createdAt: -1 });
// Text index for searching resume titles
ResumeSchema.index({ title: 'text' });

export default mongoose.model<IResumeDocument>('Resume', ResumeSchema);
