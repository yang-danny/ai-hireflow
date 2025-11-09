import DownloadIcon from '../icons/DownloadIcon';
import { ActionButton } from './ActionButton';

export function ResumePreviewPanel() {
   return (
      <div className="flex flex-col gap-6 p-6 bg-(--color-form-background) rounded-xl border-2 border-dashed border-(--color-preview-border) shadow-[0px_4px_6px_rgba(0,0,0,0.1),0px_10px_15px_rgba(0,0,0,0.1)] min-h-[681px]">
         <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center">
            <h2 className="text-lg font-bold text-white tracking-tight">
               Resume Preview
            </h2>
            <p className="text-sm text-(--color-step-inactive) leading-relaxed max-w-md">
               Your resume will be generated here in real-time as you fill in
               your information.
            </p>
         </div>
         <ActionButton
            icon={<DownloadIcon width={16} height={16} color="white" />}
            label="Download"
            variant="primary"
            className="w-fit mx-auto"
         />
      </div>
   );
}
