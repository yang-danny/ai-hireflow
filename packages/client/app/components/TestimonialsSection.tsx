import { TestimonialCard } from './TestimonialCard';
import type { TestimonialItem } from '../types/schema';

interface TestimonialsSectionProps {
   testimonials: TestimonialItem[];
}

export function TestimonialsSection({
   testimonials,
}: TestimonialsSectionProps) {
   return (
      <section className="py-20 px-6">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 space-y-4">
               <h2 className="text-heading text-(--color-text-primary)">
                  Loved by Job Seekers
               </h2>
               <p className="text-lg text-(--color-text-secondary) max-w-3xl mx-auto">
                  See how AI HireFlow has helped others achieve their career
                  goals.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {testimonials.map((testimonial) => (
                  <TestimonialCard
                     key={testimonial.id}
                     avatar={testimonial.avatar}
                     quote={testimonial.quote}
                     name={testimonial.name}
                     title={testimonial.title}
                  />
               ))}
            </div>
         </div>
      </section>
   );
}
