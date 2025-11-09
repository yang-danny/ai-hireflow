import * as React from 'react';
import type { SVGProps } from 'react';
const Component = (props: SVGProps<SVGSVGElement>) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 19.444 18.472"
      {...props}
   >
      <path
         xmlns="http://www.w3.org/2000/svg"
         fill="currentColor"
         d="M1.944 18.472q-.801 0-1.373-.57a1.87 1.87 0 0 1-.57-1.374V5.833q0-.802.57-1.373a1.87 1.87 0 0 1 1.373-.57h3.89V1.943q0-.802.57-1.373a1.87 1.87 0 0 1 1.374-.57h3.888q.803 0 1.374.57.571.571.571 1.373V3.89h3.89q.8 0 1.372.571.571.571.571 1.373v10.695q0 .801-.57 1.373a1.87 1.87 0 0 1-1.374.571zm0-1.944H17.5V5.833H1.944zM7.778 3.89h3.888V1.944H7.778z"
      />
   </svg>
);
export default Component;
