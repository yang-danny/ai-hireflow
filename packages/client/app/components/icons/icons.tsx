import type { SVGProps } from 'react';
interface IconProps {
   width?: number;
   height?: number;
   color?: string;
   className?: string;
}
const LogoIcon = (props: SVGProps<SVGSVGElement>) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 21.389 21.389"
      {...props}
   >
      <path
         xmlns="http://www.w3.org/2000/svg"
         fill="currentColor"
         d="m17.5 7.775-1.215-2.67-2.674-1.22 2.674-1.21L17.5.005l1.215 2.67 2.674 1.21-2.674 1.22zm0 13.61-1.215-2.67-2.674-1.21 2.674-1.22 1.215-2.67 1.215 2.67 2.674 1.22-2.674 1.21zm-9.722-2.91-2.43-5.35L0 10.695l5.347-2.43 2.43-5.35 2.431 5.35 5.347 2.43-5.347 2.43zm0-4.72.972-2.09 2.09-.97-2.09-.97-.972-2.09-.972 2.09-2.09.97 2.09.97z"
      />
   </svg>
);
const HomeIcon = (props: SVGProps<SVGSVGElement>) => (
   <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
   >
      <path
         d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
         stroke="currentColor"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
      <path
         d="M9 22V12H15V22"
         stroke="currentColor"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
   </svg>
);

const ResumeGeneratorIcon = (props: SVGProps<SVGSVGElement>) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 18.472 17.5"
      {...props}
   >
      <path
         xmlns="http://www.w3.org/2000/svg"
         fill="currentColor"
         fillOpacity={0.6}
         d="M.972 17.5v-4.132L13.781.583q.292-.291.657-.437T15.167 0q.388 0 .741.146t.62.437l1.361 1.361q.291.268.437.62t.146.742q0 .364-.146.729a1.9 1.9 0 0 1-.437.656L5.104 17.5zm1.945-1.944h1.361l9.552-9.528-.681-.705-.705-.681-9.527 9.552zM13.149 5.323l-.705-.681 1.386 1.386zM10.694 17.5q1.8 0 3.33-.899 1.532-.9 1.532-2.504 0-.874-.462-1.507a4.1 4.1 0 0 0-1.24-1.093l-1.434 1.434q.559.243.875.534t.316.632q0 .56-.887 1.009-.887.45-2.03.45a.94.94 0 0 0-.692.279.94.94 0 0 0-.28.693q0 .413.28.692.28.28.692.28m-9.163-7.438L2.99 8.604a3.4 3.4 0 0 1-.766-.401q-.28-.206-.28-.425 0-.292.438-.584.438-.291 1.847-.899 2.139-.924 2.844-1.677t.705-1.701q0-1.337-1.07-2.127Q5.639 0 3.889 0 2.796 0 1.932.389 1.07.777.608 1.337a.88.88 0 0 0-.219.705q.048.389.364.632a.88.88 0 0 0 .705.218q.39-.048.657-.316a2 2 0 0 1 .753-.486q.414-.146 1.021-.146.996 0 1.47.292t.474.681q0 .34-.425.619-.426.28-1.957.985-1.944.85-2.698 1.543A2.24 2.24 0 0 0 0 7.778q0 .778.413 1.324.413.548 1.118.96"
      />
   </svg>
);
const ResumeAnalyzerIcon = (props: SVGProps<SVGSVGElement>) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 15.556 19.444"
      {...props}
   >
      <path
         xmlns="http://www.w3.org/2000/svg"
         fill="currentColor"
         fillOpacity={0.6}
         d="M7.243 14.583q.438 0 .863-.109.426-.11.79-.328l2.382 2.382 1.36-1.362-2.381-2.382q.219-.364.328-.789t.11-.863q0-1.41-.997-2.382-.996-.972-2.406-.972t-2.406.996a3.28 3.28 0 0 0-.997 2.406q0 1.41.972 2.407.972.996 2.382.996m.049-1.944q-.608 0-1.033-.426a1.4 1.4 0 0 1-.425-1.033q-.001-.607.425-1.033a1.4 1.4 0 0 1 1.033-.425q.607 0 1.033.425.425.426.425 1.033 0 .608-.425 1.033a1.4 1.4 0 0 1-1.033.426m-5.347 6.805q-.803 0-1.374-.57A1.88 1.88 0 0 1 0 17.5V1.944Q0 1.142.57.571a1.87 1.87 0 0 1 1.375-.57h7.777l5.834 5.832V17.5q0 .801-.571 1.373a1.87 1.87 0 0 1-1.374.571zM8.75 6.805v-4.86H1.945V17.5H13.61V6.805zm-6.805-4.86V17.5z"
      />
   </svg>
);
const CoverLetterIcon = (props: SVGProps<SVGSVGElement>) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 28.5 30"
      {...props}
   >
      <path
         xmlns="http://www.w3.org/2000/svg"
         fill="currentColor"
         fillOpacity={0.6}
         d="M15 30v-4.613l8.288-8.25q.338-.337.75-.487.413-.15.825-.15a2.25 2.25 0 0 1 1.612.675l1.388 1.387q.3.338.468.75.17.413.169.825 0 .413-.15.844-.15.432-.487.769L19.613 30zm2.25-2.25h1.425l4.538-4.575-.675-.713-.713-.675-4.575 4.538zM3 30a2.9 2.9 0 0 1-2.119-.881A2.9 2.9 0 0 1 0 27V3Q0 1.763.881.881A2.9 2.9 0 0 1 3 0h12l9 9v4.5h-3v-3h-7.5V3H3v24h9v3zm19.538-7.538-.713-.675 1.388 1.388z"
      />
   </svg>
);

const InterviewPrepIcon = (props: SVGProps<SVGSVGElement>) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 21.389 18.424"
      {...props}
   >
      <path
         xmlns="http://www.w3.org/2000/svg"
         fill="currentColor"
         fillOpacity={0.6}
         d="m18.423 13.514-1.507-1.507a7.2 7.2 0 0 0 1.677-2.357 7 7 0 0 0 .608-2.893q0-1.53-.608-2.868a7.3 7.3 0 0 0-1.677-2.333L18.423 0a9.7 9.7 0 0 1 2.163 3.039 8.8 8.8 0 0 1 .802 3.718 8.8 8.8 0 0 1-.802 3.719 9.7 9.7 0 0 1-2.163 3.038m-3.11-3.111-1.557-1.555q.438-.414.705-.936a2.5 2.5 0 0 0 .268-1.155q0-.632-.268-1.154a3.4 3.4 0 0 0-.705-.936l1.556-1.555a5.1 5.1 0 0 1 1.215 1.64 4.7 4.7 0 0 1 .438 2.005q0 1.07-.438 2.006a5.1 5.1 0 0 1-1.215 1.64m-7.536.243q-1.604 0-2.746-1.142-1.143-1.142-1.143-2.747T5.031 4.01q1.142-1.143 2.746-1.143t2.747 1.143q1.142 1.141 1.142 2.746t-1.142 2.747-2.747 1.142M0 18.424v-2.722q0-.802.413-1.507t1.142-1.07a15.3 15.3 0 0 1 2.795-1.07q1.556-.437 3.427-.437 1.872 0 3.427.438 1.556.438 2.796 1.069.729.365 1.142 1.07t.413 1.507v2.722zm1.944-1.944h11.667v-.778a.95.95 0 0 0-.486-.827q-.875-.437-2.249-.875-1.373-.437-3.099-.437-1.725 0-3.099.437-1.373.438-2.248.875a.94.94 0 0 0-.486.827zm5.833-7.778q.802 0 1.374-.571.57-.572.571-1.374 0-.801-.57-1.373a1.87 1.87 0 0 0-1.375-.571q-.801 0-1.373.57a1.87 1.87 0 0 0-.57 1.374q0 .803.57 1.374.573.57 1.373.57"
      />
   </svg>
);

const SettingsIcon = (props: SVGProps<SVGSVGElement>) => (
   <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
   >
      <path
         d="M19.14 12.94C19.76 12.55 19.76 11.45 19.14 11.06L17.71 10.06C17.43 9.87 17.22 9.6 17.09 9.29L16.41 7.86C16.13 7.24 15.48 6.88 14.83 6.99L13.2 7.31C12.89 7.37 12.57 7.34 12.28 7.23L10.93 6.7C10.32 6.48 9.6 6.89 9.36 7.52L8.5 9.64C8.41 9.88 8.26 10.1 8.07 10.29L6.72 11.64C6.33 12.03 6.33 12.67 6.72 13.06L8.07 14.41C8.26 14.6 8.41 14.82 8.5 15.06L9.36 17.18C9.6 17.81 10.32 18.22 10.93 18L12.28 17.47C12.57 17.36 12.89 17.33 13.2 17.39L14.83 17.71C15.48 17.82 16.13 17.46 16.41 16.84L17.09 15.41C17.22 15.1 17.43 14.83 17.71 14.64L19.14 13.64V12.94Z"
         stroke="currentColor"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
      <path
         d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
         stroke="currentColor"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
   </svg>
);

const BellIcon = (props: SVGProps<SVGSVGElement>) => (
   <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
   >
      <path
         d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
         stroke="#E0E0E0"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
      <path
         d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
         stroke="#E0E0E0"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
   </svg>
);

const LightbulbIcon = (props: SVGProps<SVGSVGElement>) => (
   <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
   >
      <path
         d="M9 21C9 21.5304 9.21071 22.0391 9.58579 22.4142C9.96086 22.7893 10.4696 23 11 23H13C13.5304 23 14.0391 22.7893 14.4142 22.4142C14.7893 22.0391 15 21.5304 15 21"
         stroke="#00F5D4"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
      <path
         d="M12 18V21"
         stroke="#00F5D4"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
      <path
         d="M12 2C10.1435 2 8.36301 2.7375 7.05025 4.05025C5.7375 5.36301 5 7.14348 5 9C5 12.333 7 14 12 18C17 14 19 12.333 19 9C19 7.14348 18.2625 5.36301 16.9497 4.05025C15.637 2.7375 13.8565 2 12 2Z"
         stroke="#00F5D4"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
   </svg>
);

const CheckIcon = (props: SVGProps<SVGSVGElement>) => (
   <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
   >
      <path
         d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
         stroke="#00F5D4"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
      <path
         d="M9 12L11 14L15 10"
         stroke="#00F5D4"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
   </svg>
);

const StarIcon = (props: SVGProps<SVGSVGElement>) => (
   <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
   >
      <path
         d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
         stroke="#00F5D4"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
   </svg>
);

const SearchIcon = (props: SVGProps<SVGSVGElement>) => (
   <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
   >
      <path
         d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
         stroke="#00F5D4"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
      <path
         d="M21 21L16.65 16.65"
         stroke="#00F5D4"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
   </svg>
);

const MicIcon = (props: SVGProps<SVGSVGElement>) => (
   <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
   >
      <path
         d="M12 1C10.3431 1 9 2.34315 9 4V10C9 11.6569 10.3431 13 12 13C13.6569 13 15 11.6569 15 10V4C15 2.34315 13.6569 1 12 1Z"
         stroke="currentColor"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
      <path
         d="M19 10V11C19 14.866 15.866 18 12 18C8.13401 18 5 14.866 5 11V10"
         stroke="currentColor"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
      <path
         d="M12 18V23"
         stroke="currentColor"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
      <path
         d="M8 23H16"
         stroke="currentColor"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
   </svg>
);

const GoogleIcon = (props: SVGProps<SVGSVGElement>) => (
   <svg
      width="20"
      height="20"
      viewBox="0 0 294 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
   >
      <path
         d="M150 122.729V180.82H230.727C227.183 199.502 216.545 215.321 200.59 225.957L249.272 263.731C277.636 237.55 294 199.094 294 153.412C294 142.776 293.046 132.548 291.273 122.73L150 122.729Z"
         fill="#4285F4"
      />
      <path
         d="M65.9342 178.553L54.9546 186.958L16.0898 217.23C40.7719 266.185 91.3596 300.004 149.996 300.004C190.496 300.004 224.45 286.64 249.269 263.731L200.587 225.958C187.223 234.958 170.177 240.413 149.996 240.413C110.996 240.413 77.8602 214.095 65.9955 178.639L65.9342 178.553Z"
         fill="#34A853"
      />
      <path
         d="M16.0899 82.7734C5.86309 102.955 0 125.728 0 150.001C0 174.273 5.86309 197.047 16.0899 217.228C16.0899 217.363 66.0004 178.5 66.0004 178.5C63.0004 169.5 61.2272 159.955 61.2272 149.999C61.2272 140.043 63.0004 130.498 66.0004 121.498L16.0899 82.7734Z"
         fill="#FBBC05"
      />
      <path
         d="M149.999 59.7279C172.091 59.7279 191.727 67.3642 207.409 82.0918L250.364 39.1373C224.318 14.8647 190.5 0 149.999 0C91.3627 0 40.7719 33.6821 16.0898 82.7738L65.9988 121.502C77.8619 86.0462 110.999 59.7279 149.999 59.7279Z"
         fill="#EA4335"
      />
   </svg>
);
const GithubIcon = (props: SVGProps<SVGSVGElement>) => (
   <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
   >
      <path
         fillRule="evenodd"
         clipRule="evenodd"
         d="M24 4C12.954 4 4 12.954 4 24C4 32.995 9.627 40.559 17.481 43.244C18.481 43.427 18.852 42.821 18.852 42.296C18.852 41.822 18.835 40.337 18.826 38.764C13.216 39.968 12.052 36.347 12.052 36.347C11.139 33.989 9.843 33.385 9.843 33.385C8.035 32.155 9.983 32.178 9.983 32.178C11.983 32.317 13.028 34.216 13.028 34.216C14.804 37.221 17.647 36.345 18.889 35.837C19.067 34.554 19.583 33.679 20.156 33.181C15.903 32.678 11.428 31.002 11.428 23.098C11.428 20.864 12.212 19.041 13.069 17.608C12.868 17.105 12.189 15.137 13.258 12.459C13.258 12.459 14.933 11.926 18.806 14.568C20.414 14.131 22.114 13.912 23.806 13.904C25.498 13.912 27.199 14.131 28.809 14.568C32.68 11.926 34.353 12.459 34.353 12.459C35.424 15.137 34.745 17.105 34.544 17.608C35.403 19.041 36.184 20.864 36.184 23.098C36.184 31.021 31.703 32.673 27.44 33.166C28.157 33.787 28.784 35.015 28.784 36.889C28.784 39.545 28.761 41.685 28.761 42.296C28.761 42.825 29.126 43.435 30.141 43.242C37.992 40.554 43.613 32.993 43.613 24C43.613 12.954 34.659 4 23.613 4H24Z"
         fill="#181717"
      />
   </svg>
);

// LinkedIn Icon
const LinkedInIcon = (props: SVGProps<SVGSVGElement>) => (
   <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
   >
      <path
         d="M41.7 4H6.3C5.03 4 4 5.03 4 6.3V41.7C4 42.97 5.03 44 6.3 44H41.7C42.97 44 44 42.97 44 41.7V6.3C44 5.03 42.97 4 41.7 4Z"
         fill="#0A66C2"
      />
      <path d="M13.2 18.6H8.4V39.6H13.2V18.6Z" fill="white" />
      <path
         d="M10.8 8.4C9.13 8.4 7.8 9.73 7.8 11.4C7.8 13.07 9.13 14.4 10.8 14.4C12.47 14.4 13.8 13.07 13.8 11.4C13.8 9.73 12.47 8.4 10.8 8.4Z"
         fill="white"
      />
      <path
         d="M34.8 18C31.67 18 29.47 19.43 28.5 20.82V18.6H23.7V39.6H28.5V28.5C28.5 26.13 29.1 23.88 32.1 23.88C35.07 23.88 35.1 26.55 35.1 28.68V39.6H39.9V27.57C39.9 23.28 38.97 18 34.8 18Z"
         fill="white"
      />
   </svg>
);

const LogoutIcon = (props: SVGProps<SVGSVGElement>) => (
   <svg
      viewBox="0 0 24 24"
      fill="none"
      fillOpacity={0.6}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
   >
      <path
         d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
         stroke="currentColor"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
      <path
         d="M10 17l5-5-5-5"
         stroke="currentColor"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
      <path
         d="M15 12H3"
         stroke="currentColor"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
   </svg>
);
const TwitterIcon = (props: SVGProps<SVGSVGElement>) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 21.573 19.5"
      {...props}
   >
      <path
         xmlns="http://www.w3.org/2000/svg"
         fill="currentColor"
         fillOpacity={0.6}
         d="M16.991 0h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H.421l7.73-8.84L.001 0h3.42l4.71 6.23zm-1.16 17.52h1.83L5.831 1.88h-1.97z"
      />
   </svg>
);
const InstagramIcon = ({
   width = 20,
   height = 20,
   color = 'currentColor',
   className = '',
}: IconProps) => (
   <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
   >
      <path
         d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
         fill={color}
      />
   </svg>
);
const FacebookIcon = ({
   width = 20,
   height = 20,
   color = 'currentColor',
   className = '',
}: IconProps) => (
   <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
   >
      <path
         d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
         fill={color}
      />
   </svg>
);
const LinkedInIconLight = (props: SVGProps<SVGSVGElement>) => (
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
const YouTubeIcon = (props: SVGProps<SVGSVGElement>) => (
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
const BellNotificationIcon = (props: SVGProps<SVGSVGElement>) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 15.556 19.444"
      {...props}
   >
      <path
         xmlns="http://www.w3.org/2000/svg"
         fill="currentColor"
         fillOpacity={0.9}
         d="M-.002 16.528v-1.945h1.95V7.778c0-1.345.4-2.54 1.21-3.586s1.87-1.729 3.16-2.053v-.68c0-.406.14-.75.43-1.034.28-.283.62-.425 1.03-.425s.75.142 1.03.425c.29.284.43.628.43 1.033v.681c1.29.324 2.35 1.008 3.16 2.053.81 1.046 1.21 2.241 1.21 3.586v6.805h1.95v1.945zm7.78 2.916c-.53 0-.99-.19-1.37-.57a1.88 1.88 0 0 1-.57-1.374h3.88q0 .801-.57 1.373a1.87 1.87 0 0 1-1.37.571m-3.89-4.86h7.78V7.777q0-1.604-1.14-2.747c-.77-.762-1.68-1.142-2.75-1.142s-1.99.38-2.75 1.142q-1.14 1.143-1.14 2.747z"
      />
   </svg>
);
const LightbulbTipIcon = (props: SVGProps<SVGSVGElement>) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 14.583 19.444"
      {...props}
   >
      <path
         xmlns="http://www.w3.org/2000/svg"
         fill="currentColor"
         d="M7.292 19.444c-.53 0-.99-.19-1.37-.57a1.88 1.88 0 0 1-.57-1.374h3.88q0 .801-.57 1.373a1.87 1.87 0 0 1-1.37.571m-3.89-2.916v-1.945h7.78v1.945zm.24-2.917a7.55 7.55 0 0 1-2.66-2.674 7.13 7.13 0 0 1-.98-3.646c0-2.025.71-3.747 2.12-5.165C3.542.71 5.262 0 7.292 0q3.045.001 5.16 2.126 2.13 2.127 2.13 5.165c0 1.313-.33 2.528-.98 3.646a7.55 7.55 0 0 1-2.66 2.674zm.59-1.945h6.12a5.4 5.4 0 0 0 1.69-1.92q.6-1.141.6-2.455 0-2.235-1.56-3.79c-1.04-1.038-2.3-1.557-3.79-1.557s-2.75.52-3.79 1.556q-1.56 1.556-1.56 3.791 0 1.313.6 2.455c.4.762.96 1.402 1.69 1.92"
      />
   </svg>
);
const HomeNavIcon = (props: SVGProps<SVGSVGElement>) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 15.556 17.5"
      {...props}
   >
      <path
         xmlns="http://www.w3.org/2000/svg"
         fill="currentColor"
         d="M1.945 15.556H4.86V9.722h5.834v5.834h2.916v-8.75L7.778 2.431 1.945 6.806zM0 17.5V5.833L7.778 0l7.778 5.833V17.5H8.75v-5.833H6.806V17.5z"
      />
   </svg>
);
const StarTipIcon = (props: SVGProps<SVGSVGElement>) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 19.444 18.472"
      {...props}
   >
      <path
         xmlns="http://www.w3.org/2000/svg"
         fill="currentColor"
         d="m6.662 14.413 3.06-1.847 3.06 1.871-.8-3.5 2.7-2.333-3.55-.316-1.41-3.306-1.41 3.282-3.55.316 2.7 2.357zm-2.94 4.06 1.58-6.83-5.3-4.595 7-.607 2.72-6.44 2.72 6.44 7 .607-5.3 4.594 1.58 6.83-6-3.622z"
      />
   </svg>
);
const SearchTipIcon = (props: SVGProps<SVGSVGElement>) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 17.5 17.5"
      {...props}
   >
      <path
         xmlns="http://www.w3.org/2000/svg"
         fill="currentColor"
         d="m16.14 17.5-6.13-6.125c-.48.389-1.04.697-1.67.924-.64.226-1.31.34-2.02.34-1.77 0-3.26-.612-4.48-1.835C.61 9.58 0 8.086 0 6.319c0-1.766.61-3.261 1.84-4.484C3.06.612 4.55 0 6.32 0s3.26.612 4.48 1.835c1.23 1.223 1.84 2.718 1.84 4.484a5.85 5.85 0 0 1-1.27 3.695l6.13 6.125zm-9.82-6.806c1.21 0 2.25-.425 3.1-1.276.85-.85 1.27-1.883 1.27-3.099 0-1.215-.42-2.248-1.27-3.099-.85-.85-1.89-1.276-3.1-1.276-1.22 0-2.25.426-3.1 1.276S1.94 5.104 1.94 6.319s.43 2.249 1.28 3.099 1.88 1.276 3.1 1.276"
      />
   </svg>
);

export {
   LogoIcon,
   HomeIcon,
   ResumeGeneratorIcon,
   ResumeAnalyzerIcon,
   CoverLetterIcon,
   InterviewPrepIcon,
   SettingsIcon,
   BellIcon,
   LightbulbIcon,
   CheckIcon,
   StarIcon,
   SearchIcon,
   MicIcon,
   GoogleIcon,
   GithubIcon,
   LinkedInIcon,
   LogoutIcon,
   TwitterIcon,
   InstagramIcon,
   FacebookIcon,
   LinkedInIconLight,
   YouTubeIcon,
   BellNotificationIcon,
   LightbulbTipIcon,
   HomeNavIcon,
   StarTipIcon,
   SearchTipIcon,
};
