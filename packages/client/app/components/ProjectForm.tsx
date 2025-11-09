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
               <h3 className="flex items-center text-lg gap-2 font-semibold text-gray-900">
                  Projects
               </h3>
               <p className="text-sm text-gray-500">
                  Add your project details.
               </p>
            </div>
            <button
               onClick={addProject}
               className="flex items-centergap-2 px-3 py-1  bg-green-100 text-green-700 rounded text-sm font-medium hover:bg-green-200 transition-colors disabled:opacity-50"
            >
               <Plus className="size-4" /> Add Project
            </button>
         </div>
         {data.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
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
                     className="p-4 border grid  border-gray-200 rounded-lg space-y-3"
                  >
                     <div className="flex justify-between items-start">
                        <h4 className="text-md font-medium text-gray-500">
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
                           className="px-3 py-2 text-sm rounded-lg text-gray-500 border border-gray-300"
                           placeholder="Project Name"
                        />
                        <input
                           type="text"
                           value={project.type || ''}
                           onChange={(e) =>
                              updateProject(index, 'type', e.target.value)
                           }
                           className="px-3 py-2 text-sm rounded-lg text-gray-500 border border-gray-300"
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
                           className="w-full text-sm p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
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
