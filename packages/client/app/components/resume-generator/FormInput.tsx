import { useState } from 'react';

interface FormInputProps {
   label: string;
   placeholder: string;
   value: string;
   onChange: (value: string) => void;
   type?: 'text' | 'email' | 'tel';
   error?: string;
}

export function FormInput({
   label,
   placeholder,
   value,
   onChange,
   type = 'text',
   error,
}: FormInputProps) {
   const [isFocused, setIsFocused] = useState(false);

   return (
      <div className="flex flex-col gap-1.5">
         <label className="text-sm font-medium text-(--color-form-label)">
            {label}
         </label>
         <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className={`w-full px-4 py-3 bg-(--color-form-input-bg) text-white text-base rounded-lg border-2 transition-colors outline-none ${
               error
                  ? 'border-red-500'
                  : isFocused
                    ? 'border-(--color-primary)'
                    : 'border-transparent'
            } placeholder:text-(--color-form-placeholder)`}
         />
         {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
   );
}
