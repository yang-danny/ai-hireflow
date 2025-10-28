import * as React from 'react';
import type { SVGProps } from 'react';
const Component = (props: SVGProps<SVGSVGElement>) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 30"
      {...props}
   >
      <path
         xmlns="http://www.w3.org/2000/svg"
         fill="currentColor"
         d="M6 24h12v-3H6zm0-6h12v-3H6zM3 30c-.825 0-1.531-.29-2.119-.88A2.9 2.9 0 0 1 0 27V3C0 2.17.294 1.47.881.88A2.88 2.88 0 0 1 3 0h12l9 9v18c0 .82-.294 1.53-.881 2.12-.588.59-1.294.88-2.119.88zm10.5-19.5V3H3v24h18V10.5zM3 3v24z"
      />
   </svg>
);
export default Component;
