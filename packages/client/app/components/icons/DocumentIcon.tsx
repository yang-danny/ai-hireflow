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
         d="M3.889 13.611h6.806v-1.944H3.889zm0-3.889h9.722V7.778H3.889zm0-3.889h9.722V3.889H3.889zM1.945 17.5q-.802 0-1.374-.571A1.88 1.88 0 0 1 0 15.556V1.944Q0 1.143.571.571A1.87 1.87 0 0 1 1.945 0h13.611q.801 0 1.373.571.571.572.571 1.373v13.612q0 .801-.571 1.373a1.87 1.87 0 0 1-1.373.571zm0-1.944h13.611V1.944H1.945z"
      />
   </svg>
);
export default Component;
