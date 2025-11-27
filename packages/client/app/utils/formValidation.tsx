import { useState } from 'react';

export interface FieldError {
   type: 'required' | 'pattern' | 'minLength' | 'maxLength' | 'custom';
   message: string;
}

export interface FormField {
   value: string;
   error?: FieldError;
   touched: boolean;
}

/**
 * Form validation helper hook
 */
export function useFormValidation<T extends Record<string, any>>(
   initialValues: T
) {
   const [values, setValues] = useState<T>(initialValues);
   const [errors, setErrors] = useState<Partial<Record<keyof T, FieldError>>>(
      {}
   );
   const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>(
      {}
   );

   const handleChange = (name: keyof T, value: any) => {
      setValues((prev) => ({ ...prev, [name]: value }));
      // Clear error when user starts typing
      if (errors[name]) {
         setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
         });
      }
   };

   const handleBlur = (name: keyof T) => {
      setTouched((prev) => ({ ...prev, [name]: true }));
   };

   const setFieldError = (name: keyof T, error: FieldError) => {
      setErrors((prev) => ({ ...prev, [name]: error }));
   };

   const clearErrors = () => {
      setErrors({});
   };

   const reset = () => {
      setValues(initialValues);
      setErrors({});
      setTouched({});
   };

   const isValid = Object.keys(errors).length === 0;

   return {
      values,
      errors,
      touched,
      handleChange,
      handleBlur,
      setFieldError,
      clearErrors,
      reset,
      isValid,
   };
}

/**
 * Common validation rules
 */
export const validators = {
   required: (value: any): FieldError | undefined => {
      if (!value || (typeof value === 'string' && !value.trim())) {
         return {
            type: 'required',
            message: 'This field is required',
         };
      }
   },

   email: (value: string): FieldError | undefined => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
         return {
            type: 'pattern',
            message: 'Please enter a valid email address',
         };
      }
   },

   minLength:
      (min: number) =>
      (value: string): FieldError | undefined => {
         if (value && value.length < min) {
            return {
               type: 'minLength',
               message: `Must be at least ${min} characters`,
            };
         }
      },

   maxLength:
      (max: number) =>
      (value: string): FieldError | undefined => {
         if (value && value.length > max) {
            return {
               type: 'maxLength',
               message: `Must be at most ${max} characters`,
            };
         }
      },

   pattern:
      (regex: RegExp, message: string) =>
      (value: string): FieldError | undefined => {
         if (value && !regex.test(value)) {
            return {
               type: 'pattern',
               message,
            };
         }
      },

   url: (value: string): FieldError | undefined => {
      try {
         new URL(value);
      } catch {
         return {
            type: 'pattern',
            message: 'Please enter a valid URL',
         };
      }
   },

   phone: (value: string): FieldError | undefined => {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (value && !phoneRegex.test(value)) {
         return {
            type: 'pattern',
            message: 'Please enter a valid phone number',
         };
      }
   },
};

/**
 * Combine multiple validators
 */
export function combineValidators(
   ...validators: ((value: any) => FieldError | undefined)[]
) {
   return (value: any): FieldError | undefined => {
      for (const validator of validators) {
         const error = validator(value);
         if (error) return error;
      }
   };
}

/**
 * Input field with validation
 */
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
   label: string;
   error?: FieldError;
   touched?: boolean;
   showSuccess?: boolean;
}

export function InputField({
   label,
   error,
   touched,
   showSuccess,
   ...props
}: InputFieldProps) {
   const hasError = touched && error;
   const isSuccess = touched && !error && showSuccess && props.value;

   return (
      <div className="space-y-1">
         <label
            className="block text-sm font-medium text-(--color-text-primary)"
            htmlFor={props.id}
         >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
         </label>
         <input
            {...props}
            className={`w-full px-3 py-2 bg-(--color-background-input) border rounded-lg text-(--color-text-primary) transition-colors
               ${
                  hasError
                     ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                     : isSuccess
                       ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                       : 'border-(--color-border) focus:border-primary focus:ring-primary'
               }
               focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-dark
               disabled:opacity-50 disabled:cursor-not-allowed
            `}
         />
         {hasError && (
            <p className="text-sm text-red-500 flex items-center gap-1">
               <span>⚠️</span>
               {error.message}
            </p>
         )}
         {isSuccess && (
            <p className="text-sm text-green-500 flex items-center gap-1">
               <span>✓</span>
               Looks good!
            </p>
         )}
      </div>
   );
}

/**
 * Textarea field with validation
 */
interface TextareaFieldProps
   extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
   label: string;
   error?: FieldError;
   touched?: boolean;
   showCharCount?: boolean;
}

export function TextareaField({
   label,
   error,
   touched,
   showCharCount,
   maxLength,
   ...props
}: TextareaFieldProps) {
   const hasError = touched && error;
   const charCount = (props.value as string)?.length || 0;

   return (
      <div className="space-y-1">
         <div className="flex justify-between items-center">
            <label
               className="block text-sm font-medium text-(--color-text-primary)"
               htmlFor={props.id}
            >
               {label}
               {props.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {showCharCount && maxLength && (
               <span className="text-xs text-(--color-text-secondary)">
                  {charCount}/{maxLength}
               </span>
            )}
         </div>
         <textarea
            {...props}
            maxLength={maxLength}
            className={`w-full px-3 py-2 bg-(--color-background-input) border rounded-lg text-(--color-text-primary) transition-colors resize-none
               ${
                  hasError
                     ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                     : 'border-(--color-border) focus:border-primary focus:ring-primary'
               }
               focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-dark
               disabled:opacity-50 disabled:cursor-not-allowed
            `}
         />
         {hasError && (
            <p className="text-sm text-red-500 flex items-center gap-1">
               <span>⚠️</span>
               {error.message}
            </p>
         )}
      </div>
   );
}
