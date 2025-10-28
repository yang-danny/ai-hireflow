import * as React from 'react';
import type { SVGProps } from 'react';
const Component = (props: SVGProps<SVGSVGElement>) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 19.5 19.5"
      {...props}
   >
      <path
         xmlns="http://www.w3.org/2000/svg"
         fill="currentColor"
         fillOpacity={0.6}
         fillRule="evenodd"
         d="M9.745 0c-5.38 0-9.75 4.36-9.75 9.75s4.37 9.75 9.75 9.75c5.39 0 9.75-4.36 9.75-9.75S15.135 0 9.745 0m-3.75 7.5c0-.99.4-1.95 1.1-2.65.71-.7 1.66-1.1 2.65-1.1 1 0 1.95.4 2.66 1.1.7.7 1.09 1.66 1.09 2.65s-.39 1.95-1.09 2.65c-.71.7-1.66 1.1-2.66 1.1-.99 0-1.94-.4-2.65-1.1-.7-.7-1.1-1.66-1.1-2.65m3.75 5.25c1.2 0 2.34-.47 3.19-1.32.84-.84 1.31-1.99 1.31-3.18h-9c0 1.19.48 2.34 1.32 3.18.85.85 1.99 1.32 3.18 1.32"
         clipRule="evenodd"
      />
   </svg>
);
export default Component;
