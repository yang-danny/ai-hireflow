import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUserDocument extends Document {
   _id: Types.ObjectId;
   email: string;
   name: string;
   avatar?: string;
   googleId?: string;
   linkedinId?: string;
   password?: string;
   role: 'admin' | 'recruiter' | 'candidate';
   isEmailVerified: boolean;
   lastLogin?: Date;
   createdAt: Date;
   updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
   {
      email: {
         type: String,
         required: [true, 'Email is required'],
         unique: true,
         lowercase: true,
         trim: true,
         index: true,
      },
      name: {
         type: String,
         required: [true, 'Name is required'],
         trim: true,
      },
      avatar: {
         type: String,
         default: null,
      },
      googleId: {
         type: String,
         sparse: true,
         unique: true,
         index: true,
      },
      linkedinId: {
         type: String,
         sparse: true,
         unique: true,
         index: true,
      },
      password: {
         type: String,
         select: false,
      },
      role: {
         type: String,
         enum: ['admin', 'recruiter', 'candidate'],
         default: 'candidate',
      },
      isEmailVerified: {
         type: Boolean,
         default: false,
      },
      lastLogin: {
         type: Date,
         default: null,
      },
   },
   {
      timestamps: true,
   }
);

export default mongoose.model<IUserDocument>('User', UserSchema);
