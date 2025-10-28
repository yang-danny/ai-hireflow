import { Button } from './Button';
import type { HeroProps } from '../types/schema';

export function HeroSection({ backgroundImage }: HeroProps) {
   return (
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-36 pb-20">
         <div className="max-w-7xl mx-auto w-full">
            {/* Hero Content */}
            <div className="text-center mb-16 space-y-6">
               <h1 className="text-7xl text-(--color-text-primary) max-w-5xl mx-auto">
                  Your AI career assistant — Hire smarter with AI HireFlow
               </h1>
               <p className="text-xl text-(--color-text-secondary) max-w-3xl mx-auto leading-relaxed">
                  Leverage artificial intelligence to craft the perfect resume,
                  write compelling cover letters, and ace your next interview.
               </p>
               <div className="flex items-center justify-center gap-4 pt-4">
                  <Button variant="primary" href="#features">
                     Start Now
                  </Button>
                  <Button variant="secondary" href="#features">
                     See Features
                  </Button>
               </div>
            </div>

            {/* Hero Image */}
            <div className="max-w-5xl mx-auto">
               <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img
                     src={backgroundImage}
                     alt="AI-powered career tools visualization"
                     className="w-full h-auto object-cover"
                  />
               </div>
            </div>
         </div>
      </section>
   );
}
