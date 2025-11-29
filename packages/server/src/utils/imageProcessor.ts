import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

/**
 * Image size configurations
 */
export const IMAGE_SIZES = {
   thumbnail: { width: 150, height: 150 },
   medium: { width: 500, height: 500 },
   large: { width: 1200, height: 1200 },
} as const;

/**
 * Image quality settings
 */
const QUALITY = {
   webp: 85,
   jpeg: 90,
   png: 90,
} as const;

/**
 * Image processing options
 */
export interface ImageProcessOptions {
   /** Generate multiple sizes (thumbnail, medium, large) */
   generateSizes?: boolean;
   /** Convert to WebP format */
   convertToWebP?: boolean;
   /** Compress the image */
   compress?: boolean;
   /** Maximum file size in bytes (will adjust quality to meet) */
   maxFileSize?: number;
   /** Output directory */
   outputDir: string;
   /** Original filename (for metadata) */
   originalName?: string;
}

/**
 * Processed image result
 */
export interface ProcessedImage {
   filename: string;
   path: string;
   size: keyof typeof IMAGE_SIZES | 'original';
   format: string;
   width: number;
   height: number;
   filesize: number;
}

/**
 * Generate a unique filename for processed images
 */
function generateFilename(originalName?: string): string {
   const timestamp = Date.now();
   const random = crypto.randomBytes(8).toString('hex');
   const ext = originalName ? path.extname(originalName) : '';
   const baseName = originalName
      ? path.basename(originalName, ext).slice(0, 20)
      : 'image';

   return `${baseName}-${timestamp}-${random}`;
}

/**
 * Ensure directory exists
 */
async function ensureDir(dir: string): Promise<void> {
   try {
      await fs.access(dir);
   } catch {
      await fs.mkdir(dir, { recursive: true });
   }
}

/**
 * Process a single image variant
 */
async function processVariant(
   inputBuffer: Buffer,
   outputPath: string,
   width?: number,
   height?: number,
   format?: 'webp' | 'jpeg' | 'png'
): Promise<ProcessedImage> {
   let image = sharp(inputBuffer);

   // Resize if dimensions specified
   if (width || height) {
      image = image.resize(width, height, {
         fit: 'cover',
         position: 'center',
         withoutEnlargement: true, // Don't upscale images
      });
   }

   // Auto-rotate based on EXIF orientation
   image = image.rotate();

   // Convert format and compress
   if (format === 'webp') {
      image = image.webp({ quality: QUALITY.webp, effort: 6 });
   } else if (format === 'jpeg') {
      image = image.jpeg({
         quality: QUALITY.jpeg,
         progressive: true,
         mozjpeg: true,
      });
   } else if (format === 'png') {
      image = image.png({ quality: QUALITY.png, compressionLevel: 9 });
   }

   // Write to file
   const info = await image.toFile(outputPath);

   return {
      filename: path.basename(outputPath),
      path: outputPath,
      size: width ? ('thumbnail' as const) : ('original' as const),
      format: info.format,
      width: info.width,
      height: info.height,
      filesize: info.size,
   };
}

/**
 * Main image processing function
 * Handles compression, resizing, format conversion, and multiple size generation
 */
export async function processImage(
   inputPath: string,
   options: ImageProcessOptions
): Promise<ProcessedImage[]> {
   const results: ProcessedImage[] = [];

   // Ensure output directory exists
   await ensureDir(options.outputDir);

   // Read input image
   const inputBuffer = await fs.readFile(inputPath);
   const metadata = await sharp(inputBuffer).metadata();

   // Generate base filename
   const baseFilename = generateFilename(options.originalName);

   // Determine formats to generate
   const formats: Array<'webp' | 'jpeg' | 'png'> = [];
   if (options.convertToWebP) {
      formats.push('webp');
   }
   // Always keep original format as fallback
   if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
      formats.push('jpeg');
   } else if (metadata.format === 'png') {
      formats.push('png');
   }

   // Process original size
   for (const format of formats) {
      const ext = format === 'jpeg' ? 'jpg' : format;
      const outputPath = path.join(options.outputDir, `${baseFilename}.${ext}`);

      const result = await processVariant(
         inputBuffer,
         outputPath,
         undefined,
         undefined,
         format
      );

      results.push({ ...result, size: 'original' });
   }

   // Generate multiple sizes if requested
   if (options.generateSizes) {
      for (const [sizeName, dimensions] of Object.entries(IMAGE_SIZES)) {
         for (const format of formats) {
            const ext = format === 'jpeg' ? 'jpg' : format;
            const outputPath = path.join(
               options.outputDir,
               `${baseFilename}-${sizeName}.${ext}`
            );

            const result = await processVariant(
               inputBuffer,
               outputPath,
               dimensions.width,
               dimensions.height,
               format
            );

            results.push({
               ...result,
               size: sizeName as keyof typeof IMAGE_SIZES,
            });
         }
      }
   }

   return results;
}

/**
 * Process image from buffer (useful for multipart uploads)
 */
export async function processImageBuffer(
   buffer: Buffer,
   filename: string,
   options: Omit<ImageProcessOptions, 'originalName'>
): Promise<ProcessedImage[]> {
   // Write buffer to temp file
   const tempPath = path.join(options.outputDir, `temp-${Date.now()}`);
   await fs.writeFile(tempPath, buffer);

   try {
      // Process the image
      const results = await processImage(tempPath, {
         ...options,
         originalName: filename,
      });

      return results;
   } finally {
      // Clean up temp file
      try {
         await fs.unlink(tempPath);
      } catch (error) {
         // Ignore cleanup errors
      }
   }
}

/**
 * Delete processed images (all variants)
 */
export async function deleteProcessedImages(
   imagePath: string,
   outputDir: string
): Promise<void> {
   const basename = path.basename(imagePath, path.extname(imagePath));

   try {
      const files = await fs.readdir(outputDir);
      const imagesToDelete = files.filter((file) => file.startsWith(basename));

      await Promise.all(
         imagesToDelete.map((file) =>
            fs.unlink(path.join(outputDir, file)).catch(() => {
               // Ignore errors for non-existent files
            })
         )
      );
   } catch (error) {
      // Directory might not exist, ignore
   }
}

/**
 * Get image metadata without processing
 */
export async function getImageMetadata(inputPath: string) {
   const metadata = await sharp(inputPath).metadata();
   return {
      format: metadata.format,
      width: metadata.width,
      height: metadata.height,
      space: metadata.space,
      channels: metadata.channels,
      depth: metadata.depth,
      density: metadata.density,
      hasAlpha: metadata.hasAlpha,
      orientation: metadata.orientation,
   };
}
