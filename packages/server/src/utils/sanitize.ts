import xss from 'xss';

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
   if (!input) return '';

   return xss(input, {
      whiteList: {
         // Allow basic formatting tags if needed
         b: [],
         i: [],
         em: [],
         strong: [],
         br: [],
         p: [],
      },
      stripIgnoreTag: true,
      stripIgnoreTagBody: ['script', 'style'],
   });
}

/**
 * Sanitize an object's string properties recursively
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
   const sanitized = {} as T;

   for (const key in obj) {
      const value = obj[key];

      if (typeof value === 'string') {
         sanitized[key] = sanitizeInput(value) as any;
      } else if (Array.isArray(value)) {
         sanitized[key] = value.map((item: any) =>
            typeof item === 'string' ? sanitizeInput(item) : item
         ) as any;
      } else if (typeof value === 'object' && value !== null) {
         sanitized[key] = sanitizeObject(value);
      } else {
         sanitized[key] = value;
      }
   }

   return sanitized;
}

/**
 * Sanitize user data before storing in database
 */
export function sanitizeUserData(data: {
   name?: string;
   email?: string;
   [key: string]: any;
}) {
   return {
      ...data,
      name: data.name ? sanitizeInput(data.name) : data.name,
      // Email doesn't need XSS sanitization, just validation
      email: data.email,
   };
}

/**
 * Sanitize resume data
 */
export function sanitizeResumeData(data: any) {
   const fieldsToSanitize = [
      'title',
      'summary',
      'company',
      'position',
      'description',
      'school',
      'degree',
      'skills',
   ];

   const sanitized = { ...data };

   for (const field of fieldsToSanitize) {
      if (sanitized[field]) {
         if (typeof sanitized[field] === 'string') {
            sanitized[field] = sanitizeInput(sanitized[field]);
         } else if (Array.isArray(sanitized[field])) {
            sanitized[field] = sanitized[field].map((item: any) =>
               typeof item === 'string'
                  ? sanitizeInput(item)
                  : sanitizeObject(item)
            );
         } else if (typeof sanitized[field] === 'object') {
            sanitized[field] = sanitizeObject(sanitized[field]);
         }
      }
   }

   return sanitized;
}
