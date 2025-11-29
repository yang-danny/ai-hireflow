import { useState, useEffect, useRef, type ImgHTMLAttributes } from 'react';

interface LazyImageProps
   extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
   /** Image source URL */
   src: string;
   /** Alternative text for accessibility */
   alt: string;
   /** Placeholder image (low-res or data URL) */
   placeholder?: string;
   /** Srcset for responsive images */
   srcSet?: string;
   /** Sizes attribute for responsive images */
   sizes?: string;
   /** WebP source for modern browsers */
   webpSrc?: string;
   /** Root margin for intersection observer */
   rootMargin?: string;
   /** Threshold for intersection observer */
   threshold?: number;
}

/**
 * Lazy Loading Image Component
 * Uses Intersection Observer to load images only when they're visible
 * Supports WebP format with fallback, srcset for responsive images, and placeholders
 */
export function LazyImage({
   src,
   alt,
   placeholder,
   srcSet,
   sizes,
   webpSrc,
   rootMargin = '50px',
   threshold = 0.01,
   className = '',
   onLoad,
   onError,
   ...props
}: LazyImageProps) {
   const [currentSrc, setCurrentSrc] = useState<string | undefined>(
      placeholder
   );
   const [isLoaded, setIsLoaded] = useState(false);
   const [hasError, setHasError] = useState(false);
   const imgRef = useRef<HTMLImageElement>(null);
   const observerRef = useRef<IntersectionObserver | null>(null);

   useEffect(() => {
      // If no intersection observer support, load immediately
      if (!('IntersectionObserver' in window)) {
         setCurrentSrc(src);
         return;
      }

      // Create intersection observer
      observerRef.current = new IntersectionObserver(
         (entries) => {
            entries.forEach((entry) => {
               if (entry.isIntersecting) {
                  // Image is visible, load it
                  setCurrentSrc(src);

                  // Stop observing once image is loaded
                  if (observerRef.current && imgRef.current) {
                     observerRef.current.unobserve(imgRef.current);
                  }
               }
            });
         },
         {
            rootMargin,
            threshold,
         }
      );

      // Start observing
      if (imgRef.current) {
         observerRef.current.observe(imgRef.current);
      }

      // Cleanup
      return () => {
         if (observerRef.current) {
            observerRef.current.disconnect();
         }
      };
   }, [src, rootMargin, threshold]);

   const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
      setIsLoaded(true);
      onLoad?.(e);
   };

   const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
      setHasError(true);
      onError?.(e);
   };

   return (
      <picture>
         {/* WebP source for modern browsers */}
         {webpSrc && currentSrc && (
            <source srcSet={webpSrc} type="image/webp" sizes={sizes} />
         )}

         {/* Regular image with optional srcset */}
         <img
            ref={imgRef}
            src={currentSrc}
            srcSet={currentSrc ? srcSet : undefined}
            sizes={sizes}
            alt={alt}
            loading="lazy" // Native lazy loading as fallback
            onLoad={handleLoad}
            onError={handleError}
            className={`${className} ${
               isLoaded ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-300 ${hasError ? 'bg-gray-200' : ''}`}
            {...props}
         />
      </picture>
   );
}

/**
 * Avatar Image Component
 * Specialized lazy image for user avatars with automatic srcset and WebP support
 */
interface AvatarImageProps
   extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
   /** Avatar filename from server */
   filename: string;
   /** Alt text (defaults to "User avatar") */
   alt?: string;
   /** Size variant: thumbnail (150px), medium (500px), or large (1200px) */
   size?: 'thumbnail' | 'medium' | 'large';
}

export function AvatarImage({
   filename,
   alt = 'User avatar',
   size = 'thumbnail',
   className = '',
   ...props
}: AvatarImageProps) {
   const baseName = filename.replace(/\.[^/.]+$/, ''); // Remove extension
   const ext = filename.match(/\.[^/.]+$/)?.[0] || '.jpg';

   // Get size-specific filename
   const sizeFilename =
      size === 'thumbnail' ? `${baseName}-thumbnail${ext}` : filename;

   // Generate src
   const src = `/uploads/avatars/${sizeFilename}`;

   // Generate WebP source
   const webpSrc = `/uploads/avatars/${baseName}${size === 'thumbnail' ? '-thumbnail' : ''}.webp`;

   // Generate srcset for responsive images
   const srcSet = [
      `/uploads/avatars/${baseName}-thumbnail${ext} 150w`,
      `/uploads/avatars/${baseName}-medium${ext} 500w`,
      `/uploads/avatars/${baseName}${ext} 1200w`,
   ].join(', ');

   // Default sizes based on size prop
   const sizes =
      size === 'thumbnail'
         ? '150px'
         : size === 'medium'
           ? '500px'
           : '(max-width: 768px) 100vw, 1200px';

   return (
      <LazyImage
         src={src}
         webpSrc={webpSrc}
         srcSet={srcSet}
         sizes={sizes}
         alt={alt}
         className={`rounded-full object-cover ${className}`}
         {...props}
      />
   );
}
