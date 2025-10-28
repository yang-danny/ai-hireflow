interface TestimonialCardProps {
   avatar: string;
   quote: string;
   name: string;
   title: string;
}

export function TestimonialCard({
   avatar,
   quote,
   name,
   title,
}: TestimonialCardProps) {
   return (
      <div className="bg-(--color-background-card) rounded-[20px] border-2 border-(--color-border) p-8 hover:border-(--color-primary) hover:shadow-[var(--shadow-card-highlighted)] hover:translate-y-[-4px] transition-all duration-500">
         <div className="flex flex-col items-center text-center space-y-6">
            <img
               src={avatar}
               alt={name}
               className="w-24 h-24 rounded-full border-2 border-(--color-primary) object-cover"
            />
            <p className="text-base text-(--color-text-muted) leading-relaxed italic">
               {quote}
            </p>
            <div>
               <p className="text-lg font-bold text-(--color-text-primary) mb-1">
                  {name}
               </p>
               <p className="text-sm text-(--color-text-light)">{title}</p>
            </div>
         </div>
      </div>
   );
}
