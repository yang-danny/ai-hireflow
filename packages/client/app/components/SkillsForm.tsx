import { Plus, Sparkles, X } from 'lucide-react';
import React, { useState } from 'react';

interface SkillsFormProps {
   data: string[];
   onChange: (skills: string[]) => void;
}

const SkillsForm: React.FC<SkillsFormProps> = ({ data, onChange }) => {
   const [newSkill, setNewSkill] = useState('');
   const addSkill = () => {
      if (newSkill.trim() && !data.includes(newSkill.trim())) {
         onChange([...data, newSkill.trim()]);
         setNewSkill('');
      }
   };
   const removeSkill = (index: number) => {
      const updatedSkills = data.filter((_, i) => i !== index);
      onChange(updatedSkills);
   };
   const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
         e.preventDefault();
         addSkill();
      }
   };

   return (
      <div className="space-y-4">
         <div>
            <h3 className="flex items-center text-lg gap-2 font-semibold text-gray-200">
               Skills
            </h3>
            <p className="text-sm text-gray-300">
               Add your technical and soft skills.
            </p>
         </div>
         <div className="flex justify-between gap-2">
            <input
               type="text"
               value={newSkill}
               onChange={(e) => setNewSkill(e.target.value)}
               className="w-full px-3 py-2 text-sm rounded-lg text-gray-300 border border-gray-600 focus:ring focus:ring-(--color-primary) focus:border-(--color-primary) outline-none"
               placeholder="Enter a skill (e.g., Python, JavaScript)"
               onKeyPress={handleKeyPress}
            />
            <button
               onClick={addSkill}
               disabled={!newSkill.trim()}
               className="flex items-center gap-1 text-sm font-bold border-2 px-2 py-2 rounded-lg text-(--color-primary) hover:cursor-pointer hover:text-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
               <Plus className="size-4" /> Add
            </button>
         </div>
         {data.length > 0 ? (
            <div className="flex flex-wrap gap-2">
               {data.map((skill, index) => (
                  <span
                     key={index}
                     className="flex items-center gap-1 px-3 py-1 border border-(--color-primary) text-(--color-primary) cursor-pointer hover:text-(--color-primary)/50 hover:border-(--color-primary)/50 transition-colors rounded-full text-sm"
                  >
                     {skill}
                     <button
                        onClick={() => removeSkill(index)}
                        className="ml-1 rounded-full hover:bg-(--color-primary)/50 hover:text-white cursor-pointer p-0.5 transition-colors"
                     >
                        <X className="w-3 h-3" />
                     </button>
                  </span>
               ))}
            </div>
         ) : (
            <div className="text-center py-6 text-gray-500">
               <Sparkles className="w-10 h-10 mx-auto mb-2 text-gray-300" />
               <p>No skills added yet.</p>
               <p className="text-sm">Click "Add Skill" to add your skills</p>
            </div>
         )}
         <div className="bg-gray-600 p-3 rounded-lg">
            <p className="text-sm text-gray-300">
               <strong>Tips:</strong>Add 8-12 relevant skills. Include both
               technical(e.g., Python, JavaScript, React...) and soft skills
               (leadership, teamwork, communication...).
            </p>
         </div>
      </div>
   );
};

export default SkillsForm;
