import { Check, Palette } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from './Button';
interface ColorPickerProps {
   selectedColor: string;
   onChange: (colorValue: string) => void;
}
const ColorPicker: React.FC<ColorPickerProps> = ({
   selectedColor,
   onChange,
}) => {
   const colors = [
      { name: 'Blue', value: '#3b82f6' },
      { name: 'Red', value: '#ef4444' },
      { name: 'Green', value: '#10b981' },
      { name: 'Purple', value: '#8b5cf6' },
      { name: 'Orange', value: '#f97316' },
      { name: 'Teal', value: '#14b8a6' },
      { name: 'Pink', value: '#ec4899' },
      { name: 'Indigo', value: '#6366f1' },
      { name: 'Gray', value: '#6b7280' },
      { name: 'Black', value: '#000000' },
   ];
   const [isOpen, setIsOpen] = useState<boolean>(false);
   return (
      <div className="relative">
         <Button
            className="flex items-center gap-1 text-sm text-white bg-slate-500/50 hover: transition-all font-medium py-2 px-3 rounded-lg"
            onClick={() => setIsOpen(!isOpen)}
         >
            <Palette size={14} /> <span className="max-sm:hidden">Accent</span>
         </Button>
         {isOpen && (
            <div className="absolute grid grid-cols-4 w-70 gap-2 top-full left-0 right-0p-3 z-10 bg-(--color-background-card) rounded-md border-2 border-(--color-border) shadow-sm">
               {colors.map((color) => (
                  <div
                     key={color.value}
                     className="relative cursor-pointer group p-2 flex flex-col"
                     onClick={() => {
                        onChange(color.value);
                        setIsOpen(false);
                     }}
                  >
                     <div
                        className="w-12 h-12 rounded-full border-2 border-transparent group-hover:border-black/25 transition-colors"
                        style={{ backgroundColor: color.value }}
                     ></div>
                     {selectedColor === color.value && (
                        <div className="absolute top-0 left-1 right-0 bottom-4.5 flex items-center justify-center">
                           <Check className="size-5 text-white" />
                        </div>
                     )}
                     <p className="text-xs text-center mt-1 text-gray-200 ">
                        {color.name}
                     </p>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
};

export default ColorPicker;
