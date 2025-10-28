import LogoIcon from './icons/LogoIcon';
import TwitterIcon from './icons/TwitterIcon';
import InstagramIcon from './icons/InstagramIcon';
import FacebookIcon from './icons/FacebookIcon';
import LinkedInIcon from './icons/LinkedInIcon';
import YouTubeIcon from './icons/YouTubeIcon';
import GitHubIcon from './icons/GitHubIcon';
import type { FooterData } from '../types/schema';

interface FooterProps {
   footer: FooterData;
}

const socialIconMap = {
   twitter: TwitterIcon,
   instagram: InstagramIcon,
   facebook: FacebookIcon,
   linkedin: LinkedInIcon,
   youtube: YouTubeIcon,
   github: GitHubIcon,
};

export function Footer({ footer }: FooterProps) {
   return (
      <footer className="relative border-t px-16 border-(--color-border) bg-(--color-background-card)/50">
         {/* Gradient Overlay */}
         <div className="absolute inset-0 gradient-footer pointer-events-none" />

         <div className="relative max-w-8xl mx-auto px-12 py-12">
            {/* Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-12 mb-12">
               {/* Brand */}
               <div className="space-y-4 ">
                  <a href="/" className="flex items-center gap-3">
                     <LogoIcon width={21} height={21} color="#00c4cc" />
                     <span className="text-xl font-semibold bg-gradient-to-r from-teal-500 to-indigo-600 bg-clip-text text-transparent">
                        AI HireFlow
                     </span>
                  </a>
                  <p className="text-sm text-(--color-text-light)">
                     {footer.tagline}
                  </p>
               </div>

               {/* Product Links */}
               <div>
                  <h4 className="text-base font-bold text-(--color-text-primary) mb-4 tracking-wide">
                     Product
                  </h4>
                  <ul className="space-y-3">
                     {footer.productLinks.map((link) => (
                        <li key={link}>
                           <a
                              href="#"
                              className="text-sm text-(--color-text-muted) hover:text-(--color-text-primary) transition-colors"
                           >
                              {link}
                           </a>
                        </li>
                     ))}
                  </ul>
               </div>

               {/* Company Links */}
               <div>
                  <h4 className="text-base font-bold text-(--color-text-primary) mb-4 tracking-wide">
                     Company
                  </h4>
                  <ul className="space-y-3">
                     {footer.companyLinks.map((link) => (
                        <li key={link}>
                           <a
                              href="#"
                              className="text-sm text-(--color-text-muted) hover:text-(--color-text-primary) transition-colors"
                           >
                              {link}
                           </a>
                        </li>
                     ))}
                  </ul>
               </div>

               {/* Legal Links */}
               <div>
                  <h4 className="text-base font-bold text-(--color-text-primary) mb-4 tracking-wide">
                     Legal
                  </h4>
                  <ul className="space-y-3">
                     {footer.legalLinks.map((link) => (
                        <li key={link}>
                           <a
                              href="#"
                              className="text-sm text-(--color-text-muted) hover:text-(--color-text-primary) transition-colors"
                           >
                              {link}
                           </a>
                        </li>
                     ))}
                  </ul>
               </div>

               {/* Social Links */}
               <div>
                  <h4 className="text-base font-bold text-(--color-text-primary) mb-4 tracking-wide">
                     Follow Us
                  </h4>
                  <div className="flex items-center gap-4">
                     {footer.socialIcons.map((social) => {
                        const IconComponent =
                           socialIconMap[
                              social.name as keyof typeof socialIconMap
                           ];
                        return (
                           <a
                              key={social.name}
                              href="#"
                              className="hover:opacity-80 transition-opacity"
                           >
                              <IconComponent
                                 width={20}
                                 height={20}
                                 color="rgba(255, 255, 255, 0.6)"
                              />
                           </a>
                        );
                     })}
                  </div>
               </div>
            </div>

            {/* Copyright */}
            <div className="pt-8 border-t border-(--color-border)">
               <p className="text-sm text-(--color-text-light) text-center">
                  © 2025 AI HireFlow. All rights reserved.
               </p>
            </div>
         </div>
      </footer>
   );
}
