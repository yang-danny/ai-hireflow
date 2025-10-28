import { FeatureCard } from './FeatureCard';
import type { FeatureItem } from '../types/schema';

interface FeaturesSectionProps {
   features: FeatureItem[];
}

export function FeaturesSection({ features }: FeaturesSectionProps) {
   return (
      <section id="features" className="py-20 px-6">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 space-y-4">
               <h2 className="text-heading text-(--color-text-primary)">
                  Key Features
               </h2>
               <p className="text-lg text-(--color-text-secondary) max-w-3xl mx-auto">
                  Discover how our AI-powered tools can help you land your dream
                  job.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {features.map((feature) => (
                  <FeatureCard
                     key={feature.id}
                     icon={feature.icon}
                     title={feature.title}
                     description={feature.description}
                  />
               ))}
            </div>
         </div>
      </section>
   );
}
