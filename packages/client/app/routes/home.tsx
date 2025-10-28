import type { Route } from './+types/home';
import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { PricingSection } from '../components/PricingSection';
import { TrustSection } from '../components/TrustSection';
import { Footer } from '../components/Footer';
import { mockRootProps } from '../data/landingPageMockData';

export function meta({}: Route.MetaArgs) {
   return [
      { title: 'AI HireFlow - Your AI Career Assistant' },
      {
         name: 'description',
         content:
            'Leverage artificial intelligence to craft the perfect resume, write compelling cover letters, and ace your next interview.',
      },
   ];
}

export default function Home() {
   return (
      <div className="min-h-screen gradient-radial-hero">
         <Header navigation={mockRootProps.navigation} />
         <HeroSection {...mockRootProps.hero} />
         <FeaturesSection features={mockRootProps.features} />
         <TestimonialsSection testimonials={mockRootProps.testimonials} />
         <PricingSection pricingPlans={mockRootProps.pricingPlans} />
         <TrustSection companyLogos={mockRootProps.companyLogos} />
         <Footer footer={mockRootProps.footer} />
      </div>
   );
}
