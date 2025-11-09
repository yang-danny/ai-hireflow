import * as React from 'react';
import type { SVGProps } from 'react';
const Component = (props: SVGProps<SVGSVGElement>) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 21.389 17.5"
      {...props}
   >
      <path
         xmlns="http://www.w3.org/2000/svg"
         fill="currentColor"
         d="M10.694 17.5 3.89 13.806V7.972L0 5.833 10.694 0 21.39 5.833v7.778h-1.945V6.903L17.5 7.972v5.834zm0-8.069 6.66-3.598-6.66-3.597-6.66 3.597zm0 5.857 4.861-2.625v-3.67l-4.86 2.674-4.862-2.674v3.67z"
      />
   </svg>
);
export default Component;
