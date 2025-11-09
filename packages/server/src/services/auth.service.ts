import User, { IUserDocument } from '../models/User.model.js';
import bcrypt from 'bcrypt';
import type { GoogleUserInfo } from '../types/oauth.js';

export class AuthService {
   /**
    * Find or create user from Google OAuth
    */
   static async findOrCreateGoogleUser(
      googleUserInfo: GoogleUserInfo
   ): Promise<IUserDocument> {
      const {
         sub: googleId,
         email,
         name,
         picture,
         email_verified,
      } = googleUserInfo;

      // Try to find user by Google ID
      let user = await User.findOne({ googleId });

      if (user) {
         // Update last login
         user.lastLogin = new Date();
         await user.save();
         return user;
      }

      // Try to find user by email (link existing account)
      user = await User.findOne({ email });

      if (user) {
         // Link Google account to existing user
         user.googleId = googleId;
         user.avatar = picture || user.avatar;
         user.isEmailVerified = email_verified || user.isEmailVerified;
         user.lastLogin = new Date();
         await user.save();
         return user;
      }

      // Create new user
      user = await User.create({
         email,
         name,
         googleId,
         avatar: picture,
         isEmailVerified: email_verified || false,
         lastLogin: new Date(),
         role: 'candidate',
      });

      return user;
   }

   /**
    * Register user with email/password
    */
   static async registerWithEmail(
      email: string,
      password: string,
      name: string
   ): Promise<IUserDocument> {
      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
         throw new Error('User already exists with this email');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await User.create({
         email,
         password: hashedPassword,
         name,
         role: 'candidate',
         isEmailVerified: false,
      });

      return user;
   }

   /**
    * Login user with email/password
    */
   static async loginWithEmail(
      email: string,
      password: string
   ): Promise<IUserDocument> {
      // Find user with password field
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
         throw new Error('Invalid email or password');
      }

      if (!user.password) {
         throw new Error('Please login with Google');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
         throw new Error('Invalid email or password');
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      return user;
   }

   /**
    * Get user by ID
    */
   static async getUserById(userId: string): Promise<IUserDocument | null> {
      return User.findById(userId);
   }
}
