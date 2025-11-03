import { CheckIcon } from './icons/icons';
import { Button } from './Button';
import type { PricingPlan } from '../types/schema';

export function PricingCard({
   name,
   price,
   period,
   cta,
   badge,
   features,
   highlighted,
}: PricingPlan) {
   return (
      <div
         className={`relative bg-(--color-background-card) rounded-[20px] p-8 transition-all duration-300 border-1 border-gray-600 border-2 hover:border-(--color-primary) hover:shadow-[var(--shadow-card-highlighted)] hover:translate-y-[-4px] transition-all duration-500 `}
      >
         {/* Badge */}
         {badge && (
            <div className="absolute top-8 right-8">
               <span className="bg-(--color-primary) text-white text-xs font-bold px-3 py-1 rounded-lg tracking-wide">
                  {badge}
               </span>
            </div>
         )}

         {/* Header */}
         <div className="mb-8 space-y-2">
            <h3 className="text-2xl font-bold text-(--color-text-primary)">
               {name}
            </h3>
            <div className="flex items-baseline gap-1">
               <span className="text-price text-(--color-text-primary)">
                  ${price}
               </span>
               <span className="text-lg font-bold text-(--color-text-secondary)">
                  {period}
               </span>
            </div>
         </div>

         {/* CTA Button */}
         <div className="mb-8">
            <Button
               // variant={highlighted ? 'primary' : 'secondary'}
               className="w-full bg-slate-500/50 hover:text-white font-bold py-3 rounded-lg transition-colors"
            >
               {cta}
            </Button>
         </div>

         {/* Features */}
         <div className="space-y-3">
            {features.map((feature, index) => (
               <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                     <CheckIcon width={20} height={20} color="#00c4cc" />
                  </div>
                  <span className="text-base text-(--color-text-muted)">
                     {feature}
                  </span>
               </div>
            ))}
         </div>
      </div>
   );
}
