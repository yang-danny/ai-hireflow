import React from 'react';

interface AccentColorDialogProps {
   isOpen: boolean;
   onClose: () => void;
   onColorSelect: (color: string) => void;
}

export const AccentColorDialog: React.FC<AccentColorDialogProps> = ({
   isOpen,
   onClose,
   onColorSelect,
}) => {
   const colors = [
      'Blue',
      'Indigo',
      'Purple',
      'Green',
      'Red',
      'Orange',
      'Teal',
      'Pink',
      'Gray',
      'Black',
   ];

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
         <div className="bg-(--color-form-background) p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">
               Select an Accent Color
            </h3>
            <div className="grid grid-cols-5 gap-4">
               {colors.map((color) => (
                  <button
                     key={color}
                     onClick={() => {
                        onColorSelect(color.toLowerCase());
                        onClose();
                     }}
                     className="w-12 h-12 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                     style={{ backgroundColor: color.toLowerCase() }}
                  />
               ))}
            </div>
            <button onClick={onClose} className="mt-4 text-white">
               Close
            </button>
         </div>
      </div>
   );
};
