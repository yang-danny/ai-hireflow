import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ImageService {
   private static readonly AVATAR_SIZE = 200;
   private static readonly AVATAR_QUALITY = 85;
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
    * Optimize avatar image
    * Resizes to 200x200 and converts to WebP format
    */
   static async optimizeAvatar(buffer: Buffer): Promise<Buffer> {
      return sharp(buffer)
         .resize(this.AVATAR_SIZE, this.AVATAR_SIZE, {
            fit: 'cover',
            position: 'center',
         })
         .webp({ quality: this.AVATAR_QUALITY })
         .toBuffer();
   }

   /**
    * Save avatar to disk and return filename
    */
   static async saveAvatar(userId: string, buffer: Buffer): Promise<string> {
      const optimized = await this.optimizeAvatar(buffer);
      const filename = `${userId}-${Date.now()}.webp`;
      const filepath = path.join(this.UPLOADS_DIR, filename);

      await fs.writeFile(filepath, optimized);

      return filename;
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

      return this.optimizeAvatar(buffer);
   }

   /**
    * Delete avatar file
    */
   static async deleteAvatar(filename: string): Promise<void> {
      try {
         const filepath = path.join(this.UPLOADS_DIR, filename);
         await fs.unlink(filepath);
      } catch (error) {
         console.error('Failed to delete avatar:', error);
      }
   }
}
