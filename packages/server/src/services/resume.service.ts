import Resume, { IResumeDocument } from '../models/Resume.model.js';

export class ResumeService {
   /**
    * Get all resumes for a user
    */
   static async getUserResumes(
      userId: string,
      page: number = 1,
      limit: number = 10
   ): Promise<{ resumes: IResumeDocument[]; total: number; pages: number }> {
      const skip = (page - 1) * limit;

      const resumes = await Resume.find({ userId })
         .sort({ updatedAt: -1 })
         .limit(limit)
         .skip(skip);

      const total = await Resume.countDocuments({ userId });
      const pages = Math.ceil(total / limit);

      return { resumes, total, pages };
   }

   /**
    * Get single resume by ID
    */
   static async getResumeById(
      resumeId: string,
      userId?: string
   ): Promise<IResumeDocument | null> {
      const resume = await Resume.findById(resumeId);

      if (!resume) {
         return null;
      }

      // If userId provided, check ownership or public status
      if (userId) {
         if (resume.userId.toString() !== userId && !resume.public) {
            throw new Error('Not authorized to view this resume');
         }
      } else {
         // If no userId (public access), must be public
         if (!resume.public) {
            throw new Error('Resume is not public');
         }
      }

      return resume;
   }

   /**
    * Create new resume
    */
   static async createResume(
      userId: string,
      resumeData: Partial<IResumeDocument>
   ): Promise<IResumeDocument> {
      const resume = await Resume.create({
         ...resumeData,
         userId,
      });

      return resume;
   }

   /**
    * Update resume
    */
   static async updateResume(
      resumeId: string,
      userId: string,
      updateData: Partial<IResumeDocument>
   ): Promise<IResumeDocument | null> {
      const resume = await Resume.findOne({
         _id: resumeId,
         userId,
      });

      if (!resume) {
         throw new Error('Resume not found or not authorized');
      }

      // Update fields
      Object.assign(resume, updateData);
      await resume.save();

      return resume;
   }

   /**
    * Delete resume
    */
   static async deleteResume(
      resumeId: string,
      userId: string
   ): Promise<boolean> {
      const result = await Resume.deleteOne({
         _id: resumeId,
         userId,
      });

      if (result.deletedCount === 0) {
         throw new Error('Resume not found or not authorized');
      }

      return true;
   }

   /**
    * Toggle public status
    */
   static async togglePublicStatus(
      resumeId: string,
      userId: string
   ): Promise<IResumeDocument | null> {
      const resume = await Resume.findOne({
         _id: resumeId,
         userId,
      });

      if (!resume) {
         throw new Error('Resume not found or not authorized');
      }

      resume.public = !resume.public;
      await resume.save();

      return resume;
   }

   /**
    * Get public resumes (for showcase/templates)
    */
   static async getPublicResumes(
      page: number = 1,
      limit: number = 10
   ): Promise<{ resumes: IResumeDocument[]; total: number; pages: number }> {
      const skip = (page - 1) * limit;

      const resumes = await Resume.find({ public: true })
         .sort({ updatedAt: -1 })
         .limit(limit)
         .skip(skip)
         .populate('userId', 'name email');

      const total = await Resume.countDocuments({ public: true });
      const pages = Math.ceil(total / limit);

      return { resumes, total, pages };
   }

   /**
    * Duplicate resume
    */
   // static async duplicateResume(
   //    resumeId: string,
   //    userId: string
   // ): Promise<IResumeDocument> {
   //    const originalResume = await Resume.findOne({
   //       _id: resumeId,
   //       userId,
   //    });

   //    if (!originalResume) {
   //       throw new Error('Resume not found or not authorized');
   //    }

   //    const resumeObject = originalResume.toObject();
   //    delete resumeObject._id;
   //    delete resumeObject.createdAt;
   //    delete resumeObject.updatedAt;

   //    const newResume = await Resume.create({
   //       ...resumeObject,
   //       title: `${resumeObject.title} (Copy)`,
   //       public: false,
   //       userId,
   //    });

   //    return newResume;
   // }
}
