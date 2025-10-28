// Props types (data passed to components)
export interface HeroProps {
   backgroundImage: string;
}

export interface FeatureItem {
   id: string;
   icon: string;
   title: string;
   description: string;
}

export interface TestimonialItem {
   id: string;
   avatar: string;
   quote: string;
   name: string;
   title: string;
}

export interface PricingPlan {
   id: string;
   name: string;
   price: number;
   period: string;
   cta: string;
   badge?: string;
   features: string[];
   highlighted: boolean;
}

export interface NavigationItem {
   label: string;
   href: string;
   hasDropdown?: boolean;
}

export interface SocialIcon {
   name: string;
   icon: string;
}

export interface FooterData {
   logo: string;
   tagline: string;
   productLinks: string[];
   companyLinks: string[];
   legalLinks: string[];
   socialIcons: SocialIcon[];
}

export interface CompanyLogo {
   id: string;
   name: string;
   logo: string;
}

export interface LandingPageProps {
   hero: HeroProps;
   features: FeatureItem[];
   testimonials: TestimonialItem[];
   pricingPlans: PricingPlan[];
   companyLogos: CompanyLogo[];
   navigation: NavigationItem[];
   footer: FooterData;
}
export interface FeatureCardProps {
   icon: React.ReactNode;
   title: string;
   description: string;
   buttonText: string;
}

export interface TipItemProps {
   icon: React.ReactNode;
   text: string;
}

export interface NavItemProps {
   icon: React.ReactNode;
   label: string;
   active?: boolean;
}
