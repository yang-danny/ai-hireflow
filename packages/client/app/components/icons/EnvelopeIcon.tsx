import * as React from 'react';
import type { SVGProps } from 'react';
const Component = (props: SVGProps<SVGSVGElement>) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 30 24"
      {...props}
   >
      <path
         xmlns="http://www.w3.org/2000/svg"
         fill="currentColor"
         d="M3 24a2.88 2.88 0 0 1-2.119-.88A2.9 2.9 0 0 1 0 21V3C0 2.17.294 1.47.881.88A2.88 2.88 0 0 1 3 0h24c.825 0 1.531.29 2.119.88.587.59.881 1.29.881 2.12v18c0 .82-.294 1.53-.881 2.12A2.88 2.88 0 0 1 27 24zm12-10.5L3 6v15h24V6zm0-3L27 3H3z"
      />
   </svg>
);
export default Component;
