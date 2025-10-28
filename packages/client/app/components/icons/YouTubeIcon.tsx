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
         d="M9.745 0c-5.38 0-9.75 4.36-9.75 9.75s4.37 9.75 9.75 9.75c5.39 0 9.75-4.36 9.75-9.75S15.135 0 9.745 0m-2.25 13.13V6.37l6 3.38z"
         clipRule="evenodd"
      />
   </svg>
);
export default Component;
