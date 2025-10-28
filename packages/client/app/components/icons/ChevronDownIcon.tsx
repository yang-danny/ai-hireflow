import * as React from 'react';
import type { SVGProps } from 'react';
const Component = (props: SVGProps<SVGSVGElement>) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 6.667 4.111"
      {...props}
   >
      <path
         xmlns="http://www.w3.org/2000/svg"
         fill="currentColor"
         fillOpacity={0.8}
         d="M3.333 4.111 0 .778.777 0l2.556 2.556L5.89 0l.777.778z"
      />
   </svg>
);
export default Component;
