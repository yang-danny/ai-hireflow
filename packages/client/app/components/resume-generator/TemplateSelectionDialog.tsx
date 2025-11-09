import React from 'react';

interface TemplateSelectionDialogProps {
   isOpen: boolean;
   onClose: () => void;
   onTemplateSelect: (template: string) => void;
}

export const TemplateSelectionDialog: React.FC<
   TemplateSelectionDialogProps
> = ({ isOpen, onClose, onTemplateSelect }) => {
   const templates = ['Classic', 'Modern', 'Minimal', 'Creative', 'Pro Tech'];

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
         <div className="bg-(--color-form-background) p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">
               Select a Template
            </h3>
            <div className="grid grid-cols-1 gap-4">
               {templates.map((template) => (
                  <button
                     key={template}
                     onClick={() => {
                        onTemplateSelect(
                           template.toLowerCase().replace(' ', '-')
                        );
                        onClose();
                     }}
                     className="text-white bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded-lg"
                  >
                     {template}
                  </button>
               ))}
            </div>
            <button onClick={onClose} className="mt-4 text-white">
               Close
            </button>
         </div>
      </div>
   );
};
