import { Plus, Trash2, Wrench } from 'lucide-react';
import React from 'react';
import type { Project } from 'types/resume.types';
interface ProjectFormProps {
   data: Project[];
   onChange: (data: Project[]) => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ data, onChange }) => {
   const addProject = () => {
      const newProject = {
         name: '',
         type: '',
         description: '',
      };
      onChange([...data, newProject]);
   };
   const removeProject = (index: number) => {
      const updatedProject = data.filter((_, i) => i !== index);
      onChange(updatedProject);
   };
   const updateProject = (
      index: number,
      field: keyof Project,
      value: string | boolean
   ) => {
      const updatedProjects = [...data];
      updatedProjects[index] = {
         ...updatedProjects[index],
         [field]: value,
      };
      onChange(updatedProjects);
   };
   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h3 className="flex items-center text-lg gap-2 font-semibold text-gray-200">
                  Projects
               </h3>
               <p className="text-sm text-gray-300">
                  Add your project details.
               </p>
            </div>
            <button
               onClick={addProject}
               className="flex items-center gap-1 text-sm font-bold border-2 px-2 py-2 rounded-lg text-(--color-primary) hover:cursor-pointer hover:text-purple-600 transition-colors disabled:opacity-50"
            >
               <Plus className="size-4" /> Add Project
            </button>
         </div>
         {data.length === 0 ? (
            <div className="text-center py-8 text-gray-300">
               <Wrench className="w-12 h-12 mx-auto mb-3 text-gray-300" />
               <p>No project added yet.</p>
               <p className="text-sm">
                  Click "Add Project" to add your project
               </p>
            </div>
         ) : (
            <div className="space-y-4">
               {data.map((project, index) => (
                  <div
                     key={index}
                     className="p-4 border grid  border-gray-600 rounded-lg space-y-3"
                  >
                     <div className="flex justify-between items-start">
                        <h4 className="text-md font-medium text-gray-300">
                           Education {index + 1}
                        </h4>
                        <button
                           onClick={() => removeProject(index)}
                           className="text-red-500 text-sm hover:text-red-700 transition-colors"
                        >
                           <Trash2 className="size-4" />
                        </button>
                     </div>
                     <div className="grid gap-3">
                        <input
                           type="text"
                           value={project.name || ''}
                           onChange={(e) =>
                              updateProject(index, 'name', e.target.value)
                           }
                           className="px-3 py-2 text-sm rounded-lg text-gray-300 border border-gray-600 focus:ring focus:ring-(--color-primary) focus:border-(--color-primary) outline-none"
                           placeholder="Project Name"
                        />
                        <input
                           type="text"
                           value={project.type || ''}
                           onChange={(e) =>
                              updateProject(index, 'type', e.target.value)
                           }
                           className="px-3 py-2 text-sm rounded-lg text-gray-300 border border-gray-600 focus:ring focus:ring-(--color-primary) focus:border-(--color-primary) outline-none"
                           placeholder="Project type"
                        />

                        <textarea
                           value={project.description || ''}
                           rows={4}
                           onChange={(e) =>
                              updateProject(
                                 index,
                                 'description',
                                 e.target.value
                              )
                           }
                           className="w-full text-sm text-gray-300 p-2 border border-gray-600 rounded-md focus:ring focus:ring-(--color-primary) focus:border-(--color-primary) outline-none transition-colors"
                           placeholder="Describe your project tech stacks and role..."
                        />
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
};

export default ProjectForm;
