import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IJobDocument extends Document {
   _id: Types.ObjectId;
   userId: Types.ObjectId;
   title: string;
   companyName: string;
   jobTitle: string;
   location: string;
   jobDescription: string;
   createdAt: Date;
   updatedAt: Date;
}

const JobSchema = new Schema<IJobDocument>(
   {
      userId: {
         type: Schema.Types.ObjectId,
         ref: 'User',
         required: true,
         index: true,
      },
      title: {
         type: String,
         required: [true, 'Job title is required'],
         trim: true,
      },
      companyName: {
         type: String,
         required: [true, 'Company name is required'],
         trim: true,
      },
      jobTitle: {
         type: String,
         required: [true, 'Job title/position is required'],
         trim: true,
      },
      location: {
         type: String,
         default: '',
         trim: true,
      },
      jobDescription: {
         type: String,
         required: [true, 'Job description is required'],
      },
   },
   {
      timestamps: true,
   }
);

// Indexes for better query performance
// Compound index for user's jobs sorted by creation date
JobSchema.index({ userId: 1, createdAt: -1 });
// Compound index for user's jobs sorted by update date (most recently used)
JobSchema.index({ userId: 1, updatedAt: -1 });
// Text indexes for searching jobs
JobSchema.index({ title: 'text', companyName: 'text', jobTitle: 'text' });

export default mongoose.model<IJobDocument>('Job', JobSchema);
