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
            <h3 className="flex items-center text-lg gap-2 font-semibold text-gray-900">
               Skills
            </h3>
            <p className="text-sm text-gray-500">
               Add your technical and soft skills.
            </p>
         </div>
         <div className="flex justify-between gap-2">
            <input
               type="text"
               value={newSkill}
               onChange={(e) => setNewSkill(e.target.value)}
               className="w-full px-3 py-2 text-sm rounded-lg text-gray-500 border border-gray-300"
               placeholder="Enter a skill (e.g., Python, JavaScript)"
               onKeyPress={handleKeyPress}
            />
            <button
               onClick={addSkill}
               disabled={!newSkill.trim()}
               className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
               <Plus className="size-4" /> Add
            </button>
         </div>
         {data.length > 0 ? (
            <div className="flex flex-wrap gap-2">
               {data.map((skill, index) => (
                  <span
                     key={index}
                     className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                     {skill}
                     <button
                        onClick={() => removeSkill(index)}
                        className="ml-1 rounded-full p-0.5 hover:bg-blue-200 transition-colors"
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
         <div className="bg-blue-50 p-3 rouunded-lg">
            <p className="text-sm text-blue-800">
               <strong>Tips:</strong>Add 8-12 relevant skills. Include both
               technical(e.g., Python, JavaScript, React...) and soft skills
               (leadership, teamwork, communication...).
            </p>
         </div>
      </div>
   );
};

export default SkillsForm;
