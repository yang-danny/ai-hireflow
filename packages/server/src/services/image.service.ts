import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
   processImageBuffer,
   deleteProcessedImages,
} from '../utils/imageProcessor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ImageService {
   private static readonly UPLOADS_DIR = path.join(
      __dirname,
      '../../uploads/avatars'
   );

   /**
    * Initialize uploads directory
    */
   static async init(): Promise<void> {
      try {
         await fs.mkdir(this.UPLOADS_DIR, { recursive: true });
      } catch (error) {
         console.error('Failed to create uploads directory:', error);
      }
   }

   /**
    * Save and process user avatar
    * Generates multiple sizes (thumbnail, medium, large) and WebP variants
    */
   static async saveAvatar(userId: string, buffer: Buffer): Promise<string> {
      const results = await processImageBuffer(buffer, `avatar-${userId}`, {
         outputDir: this.UPLOADS_DIR,
         generateSizes: true, // Generate thumbnail, medium, large
         convertToWebP: true, // Generate WebP versions
         compress: true,
      });

      // Return the original WebP filename (or fallback to JPEG)
      const webpOriginal = results.find(
         (r) => r.size === 'original' && r.format === 'webp'
      );
      const jpegOriginal = results.find(
         (r) => r.size === 'original' && r.format === 'jpeg'
      );

      return (
         webpOriginal?.filename || jpegOriginal?.filename || results[0].filename
      );
   }

   /**
    * Delete user avatar and all its variants
    */
   static async deleteAvatar(filename: string): Promise<void> {
      await deleteProcessedImages(filename, this.UPLOADS_DIR);
   }

   /**
    * Fetch and optimize external image URL (e.g., Google OAuth avatar)
    */
   static async fetchAndOptimize(url: string): Promise<Buffer> {
      const response = await fetch(url);
      if (!response.ok) {
         throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Use image processor for optimization
      const results = await processImageBuffer(buffer, 'oauth-avatar', {
         outputDir: this.UPLOADS_DIR,
         generateSizes: false, // Just optimize, don't generate sizes for external images
         convertToWebP: true,
         compress: true,
      });

      // Read the optimized buffer back
      const optimizedPath =
         results.find((r) => r.format === 'webp')?.path || results[0].path;
      return fs.readFile(optimizedPath);
   }

   /**
    * Get avatar variants for srcset (responsive images)
    */
   static getAvatarSrcSet(filename: string): string {
      const baseName = path.basename(filename, path.extname(filename));
      const ext = path.extname(filename);

      // Generate srcset with different sizes
      const sizes = [
         { size: 'thumbnail', width: 150 },
         { size: 'medium', width: 500 },
         { size: 'original', width: 1200 },
      ];

      return sizes
         .map(({ size, width }) => {
            const name = size === 'original' ? baseName : `${baseName}-${size}`;
            return `/uploads/avatars/${name}${ext} ${width}w`;
         })
         .join(', ');
   }

   /**
    * Get WebP variant filename
    */
   static getWebPVariant(filename: string): string {
      const baseName = path.basename(filename, path.extname(filename));
      return `/uploads/avatars/${baseName}.webp`;
   }

   /**
    * Get thumbnail URL
    */
   static getThumbnailUrl(filename: string): string {
      const baseName = path.basename(filename, path.extname(filename));
      const ext = path.extname(filename);
      return `/uploads/avatars/${baseName}-thumbnail${ext}`;
   }
}
