interface ProgressBarProps {
   currentStep: number;
   totalSteps: number;
   stepTitle: string;
}

export function ProgressBar({
   currentStep,
   totalSteps,
   stepTitle,
}: ProgressBarProps) {
   const progressPercentage = (currentStep / totalSteps) * 100;

   return (
      <div className="flex flex-col gap-3">
         <p className="text-base font-medium text-white">
            Step {currentStep} of {totalSteps}: {stepTitle}
         </p>
         <div className="w-full h-2 progress-bar-bg rounded">
            <div
               className="h-full progress-bar-fill rounded transition-all duration-300"
               style={{ width: `${progressPercentage}%` }}
            />
         </div>
      </div>
   );
}
