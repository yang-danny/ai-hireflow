import { ResumeGeneratorIcon } from './icons/icons';
import { ResumeAnalyzerIcon } from './icons/icons';
import { CoverLetterIcon } from './icons/icons';
import { InterviewPrepIcon } from './icons/icons';

interface FeatureCardProps {
   icon: string;
   title: string;
   description: string;
}

const iconMap = {
   document: ResumeGeneratorIcon,
   analysis: ResumeAnalyzerIcon,
   envelope: CoverLetterIcon,
   coaching: InterviewPrepIcon,
};

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
   const IconComponent =
      iconMap[icon as keyof typeof iconMap] || ResumeGeneratorIcon;

   return (
      <div className="bg-(--color-background-card) rounded-[20px] border-2 border-(--color-border) p-8 hover:border-(--color-primary) hover:shadow-[var(--shadow-card-highlighted)] transition-all duration-500 hover:translate-y-[-4px]">
         <div className="mb-4">
            <IconComponent width={30} height={30} color="#00c4cc" />
         </div>
         <h3 className="text-xl font-bold text-(--color-text-primary) mb-2">
            {title}
         </h3>
         <p className="text-sm text-(--color-text-muted) leading-relaxed">
            {description}
         </p>
      </div>
   );
}
