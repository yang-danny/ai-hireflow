import Job, { IJobDocument } from '../models/Job.model.js';

export class JobService {
   /**
    * Get all jobs for a user
    */
   static async getUserJobs(
      userId: string,
      page: number = 1,
      limit: number = 10
   ): Promise<{ jobs: IJobDocument[]; total: number; pages: number }> {
      const skip = (page - 1) * limit;

      const jobs = await Job.find({ userId })
         .sort({ updatedAt: -1 })
         .limit(limit)
         .skip(skip);

      const total = await Job.countDocuments({ userId });
      const pages = Math.ceil(total / limit);

      return { jobs, total, pages };
   }

   /**
    * Get single job by ID
    */
   static async getJobById(
      jobId: string,
      userId: string
   ): Promise<IJobDocument | null> {
      const job = await Job.findOne({
         _id: jobId,
         userId,
      });

      return job;
   }

   /**
    * Create new job
    */
   static async createJob(
      userId: string,
      jobData: Partial<IJobDocument>
   ): Promise<IJobDocument> {
      const job = await Job.create({
         ...jobData,
         userId,
      });

      return job;
   }

   /**
    * Update job
    */
   static async updateJob(
      jobId: string,
      userId: string,
      updateData: Partial<IJobDocument>
   ): Promise<IJobDocument | null> {
      const job = await Job.findOne({
         _id: jobId,
         userId,
      });

      if (!job) {
         throw new Error('Job not found or not authorized');
      }

      // Update fields
      Object.assign(job, updateData);
      await job.save();

      return job;
   }

   /**
    * Delete job
    */
   static async deleteJob(jobId: string, userId: string): Promise<boolean> {
      const result = await Job.deleteOne({
         _id: jobId,
         userId,
      });

      if (result.deletedCount === 0) {
         throw new Error('Job not found or not authorized');
      }

      return true;
   }
}
