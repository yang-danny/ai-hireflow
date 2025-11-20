import { Check, Layout } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from './Button';

interface TemplateSelectorProps {
   selectedTemplete: string;
   onChange: (templateId: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
   selectedTemplete,
   onChange,
}) => {
   const [isOpen, setIsOpen] = useState<boolean>(false);
   const templates = [
      {
         id: 'classic',
         name: 'Classic',
         preview:
            'A Clear, traditional layout emphasizing structure and readability.',
      },
      {
         id: 'modern',
         name: 'Modern',
         preview:
            'Sleek design with strategic use of color and modern font choices.',
      },
      {
         id: 'minimal',
         name: 'Minimal',
         preview: 'Ultra-clean design that puts your content front and center.',
      },
      {
         id: 'minimal-image',
         name: 'Minimal Image',
         preview: 'Minimal design with a single image and clear typography.',
      },
   ];
   return (
      <div className="relative ">
         <Button
            className="flex items-center gap-1 text-sm text-white bg-slate-500/50 hover: transition-all font-medium py-2 px-3 rounded-lg"
            onClick={() => setIsOpen(!isOpen)}
         >
            <Layout size={14} /> <span className="max-sm:hidden">Template</span>
         </Button>
         {isOpen && (
            <div className="absolute top-full p-2 w-xs space-y-3 z-10 bg-(--color-background-card) rounded-md border-2 border-(--color-border) shadow-sm">
               {templates.map((template) => (
                  <div
                     key={template.id}
                     className={`relative p-3 border border-(--color-primary) rounded-md transition-all cursor-pointer ${selectedTemplete === template.id ? 'hover:bg-(--color-background-card) ' : ' bg-slate-500/50'}`}
                     onClick={() => {
                        onChange(template.id);
                        setIsOpen(false);
                     }}
                  >
                     {selectedTemplete === template.id && (
                        <div className="absolute top-2 right-2 bg-(--color-primary) rounded-full p-1">
                           <Check className="w-3 h-3 text-white" />
                        </div>
                     )}
                     <div>
                        <h4 className="font-medium text-gray-200">
                           {template.name}
                        </h4>
                        <div className="mt-2 p-2 bg-slate-500/50 rounded text-xs text-gray-200 italic">
                           {template.preview}
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
};

export default TemplateSelector;
