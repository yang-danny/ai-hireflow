import React from 'react';
import MenuItem from './MenuItem';

const SidebarMenu = () => {
   const menuItems = [
      {
         id: 'home',
         icon: '/images/img_component_2.svg',
         text: 'Home',
         isActive: true,
      },
      {
         id: 'resume-generator',
         icon: '/images/img_component_2_white_a700.svg',
         text: 'AI Resume Generator',
         isActive: false,
      },
      {
         id: 'resume-analyzer',
         icon: '/images/img_component_2_white_a700_28x24.svg',
         text: 'AI Resume Analyzer',
         isActive: false,
      },
      {
         id: 'cover-letter',
         icon: '/images/img_component_2_28x24.svg',
         text: 'AI Cover Letter\nGenerator',
         isActive: false,
      },
      {
         id: 'interview-prep',
         icon: '/images/img_component_2_1.svg',
         text: 'AI Interview\nPreparation',
         isActive: false,
      },
   ];

   return (
      <nav className="flex flex-col gap-md">
         {menuItems?.map((item) => (
            <MenuItem
               key={item?.id}
               icon={item?.icon}
               text={item?.text}
               isActive={item?.isActive}
               onClick={() => {}}
            />
         ))}
      </nav>
   );
};

export default SidebarMenu;
