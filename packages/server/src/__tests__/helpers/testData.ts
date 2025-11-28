import { faker } from '@faker-js/faker';

/**
 * Test data factory using Faker.js for realistic test data generation
 */

export const testData = {
   /**
    * Generate a random user
    */
   user: () => ({
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password({ length: 12, memorable: false }),
      name: faker.person.fullName(),
   }),

   /**
    * Generate a user with specific role
    */
   userWithRole: (role: 'admin' | 'recruiter' | 'candidate' = 'candidate') => ({
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password({ length: 12, memorable: false }),
      name: faker.person.fullName(),
      role,
   }),

   /**
    * Generate resume data
    */
   resume: () => ({
      title: `${faker.person.jobTitle()} Resume`,
      personal_info: {
         full_name: faker.person.fullName(),
         email: faker.internet.email().toLowerCase(),
         phone: faker.phone.number(),
         location: `${faker.location.city()}, ${faker.location.state()}`,
         profession: faker.person.jobTitle(),
         linkedin: faker.internet.url(),
         github: faker.internet.url(),
         website: faker.internet.url(),
      },
      professional_summary: faker.lorem.paragraph(3),
      experience: [
         {
            position: faker.person.jobTitle(),
            company: faker.company.name(),
            start_date: '2020-01',
            end_date: '2023-12',
            is_current: false,
            description: faker.lorem.paragraph(2),
         },
      ],
      education: [
         {
            degree: 'Bachelor of Science',
            field: faker.person.jobArea(),
            institution: faker.company.name() + ' University',
            gpa: faker.number
               .float({ min: 2.5, max: 4.0, fractionDigits: 2 })
               .toString(),
            graduation_date: '2020-05',
         },
      ],
      project: [
         {
            name: faker.commerce.productName(),
            type: 'Web Development',
            description: faker.lorem.paragraph(),
         },
      ],
      skills: faker.helpers.arrayElements(
         [
            'JavaScript',
            'TypeScript',
            'React',
            'Node.js',
            'Python',
            'Docker',
            'AWS',
         ],
         { min: 3, max: 7 }
      ),
      template: 'default',
      accent_color: faker.color.rgb({ format: 'hex' }),
      public: false,
   }),

   /**
    * Generate job posting data
    */
   job: () => ({
      title: `${faker.person.jobTitle()} Position`,
      companyName: faker.company.name(),
      jobTitle: faker.person.jobTitle(),
      location: `${faker.location.city()}, ${faker.location.state()}`,
      jobDescription: faker.lorem.paragraphs(3),
   }),

   /**
    * Generate a strong password
    */
   password: () => faker.internet.password({ length: 12, memorable: false }),

   /**
    * Generate a unique email
    */
   email: () => faker.internet.email().toLowerCase(),

   /**
    * Generate OAuth user info (Google)
    */
   googleUserInfo: () => ({
      sub: faker.string.uuid(),
      email: faker.internet.email().toLowerCase(),
      name: faker.person.fullName(),
      picture: faker.image.avatar(),
      email_verified: true,
   }),
};

/**
 * Seed faker for deterministic tests (optional)
 */
export const seedFaker = (seed: number = 123) => {
   faker.seed(seed);
};
