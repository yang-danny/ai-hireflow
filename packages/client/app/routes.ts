import {
   type RouteConfig,
   index,
   route,
   layout,
} from '@react-router/dev/routes';

export default [
   index('routes/home.tsx'),

   route('/auth', 'routes/auth.tsx'),

   route('/auth/success', 'routes/AuthCallback.tsx'),
   route('/auth/error', 'routes/AuthError.tsx'),
   layout('routes/protected-layout.tsx', [
      route('dashboard', 'routes/dashboard.tsx'),
   ]),
] satisfies RouteConfig;
