import {
   type RouteConfig,
   index,
   route,
   layout,
} from '@react-router/dev/routes';

export default [
   index('routes/home.tsx'),

   route('/auth', 'routes/auth.tsx'),

   route('/auth/success', 'routes/authCallback.tsx'),
   route('/auth/error', 'routes/authError.tsx'),
   layout('routes/protected-layout.tsx', [
      route('dashboard', 'routes/dashboard.tsx'),
      route('resume', 'routes/resume.tsx'),
      route('resume-generator', 'routes/resumeGenerator.tsx'),
      route('resume-generator/:id', 'routes/resumeGenerator.tsx', {
         id: 'routes/resumeGeneratorId',
      }),
   ]),
] satisfies RouteConfig;
