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
JobSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IJobDocument>('Job', JobSchema);
