import type { LandingPageProps } from '../types/schema';

// Mock data for the landing page

// Data passed as props to the root component
export const mockRootProps: LandingPageProps = {
   hero: {
      backgroundImage: '/images/hero-background.png',
   },
   features: [
      {
         id: 'resume-generator',
         icon: 'document',
         title: 'AI Resume Generator',
         description:
            'Create a professional, ATS-friendly resume that stands out to recruiters.',
      },
      {
         id: 'resume-analyzer',
         icon: 'analysis',
         title: 'AI Resume Analyzer',
         description:
            'Get instant feedback on your resume and optimize it for ATS systems.',
      },
      {
         id: 'cover-letter',
         icon: 'envelope',
         title: 'AI Cover Letter Generator',
         description:
            'Generate compelling cover letters tailored to each job application in seconds.',
      },
      {
         id: 'interview-prep',
         icon: 'coaching',
         title: 'AI Interview Preparation',
         description:
            'Practice and get instant feedback on your interview skills with our AI coach.',
      },
   ],
   testimonials: [
      {
         id: 'john-doe',
         avatar: '/images/avatars/john-doe.png',
         quote: '"AI HireFlow helped me land my dream job at a top tech company! The resume builder is pure magic."',
         name: 'John Doe',
         title: 'Software Engineer',
      },
      {
         id: 'jane-smith',
         avatar: '/images/avatars/jane-smith.png',
         quote: '"The AI-powered cover letter generator is a game-changer. It saved me hours of work."',
         name: 'Jane Smith',
         title: 'Product Manager',
      },
      {
         id: 'sam-wilson',
         avatar: '/images/avatars/sam-wilson.png',
         quote: '"I felt so much more confident in my interviews after using the prep tool. Highly recommended!"',
         name: 'Sam Wilson',
         title: 'Data Analyst',
      },
      {
         id: 'alex-ray',
         avatar: '/images/avatars/alex-ray.png',
         quote: '"The resume analyzer pointed out mistakes I would have never caught. Got more interviews instantly."',
         name: 'Alex Ray',
         title: 'UX Designer',
      },
   ],
   pricingPlans: [
      {
         id: 'free',
         name: 'Free',
         price: 0,
         period: '/month',
         cta: 'Get Started',
         features: [
            'AI Resume Builder (1 resume)',
            'AI Cover Letter (1 letter)',
            'Basic Interview Questions',
         ],
         highlighted: false,
      },
      {
         id: 'pro',
         name: 'Pro',
         price: 29,
         period: '/month',
         cta: 'Upgrade to Pro',
         badge: 'Most Popular',
         features: [
            'Unlimited Resumes & Letters',
            'Advanced Interview Prep',
            'AI-Powered Job Matching',
            'Priority Support',
         ],
         highlighted: true,
      },
      {
         id: 'business',
         name: 'Business',
         price: 99,
         period: '/month',
         cta: 'Contact Sales',
         features: [
            'Team Collaboration Tools',
            'Custom Branding Options',
            'Dedicated Account Manager',
         ],
         highlighted: false,
      },
      {
         id: 'ultimate',
         name: 'Ultimate',
         price: 149,
         period: '/month',
         cta: 'Get Ultimate',
         features: [
            'All Business Features',
            'Personalized Career Coaching',
            '1-on-1 Mock Interviews',
         ],
         highlighted: false,
      },
   ],
   companyLogos: [
      {
         id: 'company-1',
         name: 'Company 1',
         logo: 'https://via.placeholder.com/150x80/4a5568/ffffff?text=Logo+1',
      },
      {
         id: 'company-2',
         name: 'Company 2',
         logo: 'https://via.placeholder.com/150x80/4a5568/ffffff?text=Logo+2',
      },
      {
         id: 'company-3',
         name: 'Company 3',
         logo: 'https://via.placeholder.com/150x80/4a5568/ffffff?text=Logo+3',
      },
      {
         id: 'company-4',
         name: 'Company 4',
         logo: 'https://via.placeholder.com/150x80/4a5568/ffffff?text=Logo+4',
      },
      {
         id: 'company-5',
         name: 'Company 5',
         logo: 'https://via.placeholder.com/150x80/4a5568/ffffff?text=Logo+5',
      },
      {
         id: 'company-6',
         name: 'Company 6',
         logo: 'https://via.placeholder.com/150x80/4a5568/ffffff?text=Logo+6',
      },
      {
         id: 'company-7',
         name: 'Company 7',
         logo: 'https://via.placeholder.com/150x80/4a5568/ffffff?text=Logo+7',
      },
      {
         id: 'company-8',
         name: 'Company 8',
         logo: 'https://via.placeholder.com/150x80/4a5568/ffffff?text=Logo+8',
      },
      {
         id: 'company-9',
         name: 'Company 9',
         logo: 'https://via.placeholder.com/150x80/4a5568/ffffff?text=Logo+9',
      },
      {
         id: 'company-10',
         name: 'Company 10',
         logo: 'https://via.placeholder.com/150x80/4a5568/ffffff?text=Logo+10',
      },
   ],
   navigation: [
      { label: 'Home', href: '/' },
      { label: 'Features', href: '#features', hasDropdown: true },
      { label: 'Pricing', href: '#pricing' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Contact', href: '#contact' },
   ],
   footer: {
      logo: 'logo',
      tagline: 'Your AI-powered career assistant.',
      productLinks: [
         'AI Resume Generator',
         'AI Resume Analyzer',
         'AI Cover Letter Generator',
         'AI Interview Prep',
      ],
      companyLinks: ['About Us', 'Contact', 'FAQ'],
      legalLinks: ['Privacy Policy', 'Terms of Service'],
      socialIcons: [
         { name: 'twitter', icon: 'twitter' },
         { name: 'instagram', icon: 'instagram' },
         { name: 'facebook', icon: 'facebook' },
         { name: 'linkedin', icon: 'linkedin' },
         { name: 'youtube', icon: 'youtube' },
      ],
   },
};
