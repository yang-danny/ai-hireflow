import { useEffect, useState } from 'react';
import type { CompanyLogo } from '../types/schema';

interface TrustSectionProps {
   companyLogos: CompanyLogo[];
}

export function TrustSection({ companyLogos }: TrustSectionProps) {
   const [highlightedIndex, setHighlightedIndex] = useState(0);

   useEffect(() => {
      const interval = setInterval(() => {
         setHighlightedIndex((prev) => (prev + 1) % companyLogos.length);
      }, 2000);

      return () => clearInterval(interval);
   }, [companyLogos.length]);

   return (
      <section className="py-20 px-6 ">
         <div className="max-w-7xl mx-auto">
            <h2 className="text-center text-3xl font-bold text-white mb-12">
               Trusted by Top Companies
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
               {companyLogos.map((company, index) => (
                  <div
                     key={company.id}
                     className={`
                relative rounded-lg overflow-hidden transition-all duration-500
                ${
                   highlightedIndex === index
                      ? 'bg-white scale-105 shadow-xl'
                      : 'bg-gray-700 scale-100'
                }
              `}
                     style={{
                        aspectRatio: '150/80',
                     }}
                  >
                     <div className="absolute inset-0 flex items-center justify-center p-4">
                        <div
                           className={`
                  w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-500
                  ${highlightedIndex === index ? 'bg-gray-600' : 'bg-gray-500'}
                `}
                        >
                           <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              className={
                                 highlightedIndex === index
                                    ? 'text-white'
                                    : 'text-gray-400'
                              }
                           >
                              <path
                                 d="M13 10V3L4 14h7v7l9-11h-7z"
                                 fill="currentColor"
                              />
                           </svg>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            <p className="text-center text-xs text-gray-500 mt-8">
               Logos provided by Brandfetch
            </p>
         </div>
      </section>
   );
}
