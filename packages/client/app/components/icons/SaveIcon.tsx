import * as React from 'react';
import type { SVGProps } from 'react';
const Component = (props: SVGProps<SVGSVGElement>) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 17.5 17.5"
      {...props}
   >
      <path
         xmlns="http://www.w3.org/2000/svg"
         fill="currentColor"
         d="M17.5 3.889v11.667q0 .801-.571 1.373a1.87 1.87 0 0 1-1.374.571H1.944q-.801 0-1.373-.571A1.87 1.87 0 0 1 0 15.556V1.944Q0 1.143.571.571A1.87 1.87 0 0 1 1.944 0h11.667zm-1.945.826-2.77-2.771H1.944v13.612h13.611zM8.75 14.583q1.215 0 2.066-.85a2.81 2.81 0 0 0 .851-2.066q0-1.216-.851-2.066A2.81 2.81 0 0 0 8.75 8.75q-1.215 0-2.066.851a2.81 2.81 0 0 0-.851 2.066q0 1.215.851 2.066.85.85 2.066.85M2.917 6.806h8.75V2.917h-8.75zm-.973-2.091v10.841V1.944z"
      />
   </svg>
);
export default Component;
