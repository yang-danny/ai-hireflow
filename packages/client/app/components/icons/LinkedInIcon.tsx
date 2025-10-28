import * as React from 'react';
import type { SVGProps } from 'react';
const Component = (props: SVGProps<SVGSVGElement>) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 18 18"
      {...props}
   >
      <path
         xmlns="http://www.w3.org/2000/svg"
         fill="currentColor"
         fillOpacity={0.6}
         fillRule="evenodd"
         d="M15.995 0h-14c-.53 0-1.03.21-1.41.59-.37.37-.59.88-.59 1.41v14c0 .53.22 1.04.59 1.41.38.38.88.59 1.41.59h14a1.998 1.998 0 0 0 2-2V2a2 2 0 0 0-2-2m-10.5 15h-2.5V6h2.5zM4.245 4.5c0 .25-.07.49-.21.69-.13.21-.33.37-.56.46-.23.1-.48.12-.72.08a1.27 1.27 0 0 1-.98-.99c-.05-.24-.02-.49.07-.72s.25-.42.46-.56.45-.21.69-.21a1.249 1.249 0 0 1 1.25 1.25M15.495 15h-2.5v-4.25c0-1.5-.5-2.5-1.75-2.5-.75 0-1.25.75-1.25 2.25V15h-2.5V6h2.5v1.5c.5-.75 1.5-1.5 2.75-1.5 1.75 0 2.75 1.5 2.75 4.25z"
         clipRule="evenodd"
      />
   </svg>
);
export default Component;
