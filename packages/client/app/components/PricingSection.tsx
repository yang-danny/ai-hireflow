import { PricingCard } from './PricingCard';
import type { PricingPlan } from '../types/schema';

interface PricingSectionProps {
   pricingPlans: PricingPlan[];
}

export function PricingSection({ pricingPlans }: PricingSectionProps) {
   return (
      <section id="pricing" className="py-20 px-6">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 space-y-4">
               <h2 className="text-heading text-(--color-text-primary)">
                  Find the Plan That's Right for You
               </h2>
               <p className="text-lg text-(--color-text-secondary) max-w-3xl mx-auto">
                  Start for free, and scale up as your career ambitions grow.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {pricingPlans.map((plan) => (
                  <PricingCard key={plan.id} {...plan} />
               ))}
            </div>
         </div>
      </section>
   );
}
