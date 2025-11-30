export interface EnvConfig {
   NODE_ENV: string;
   PORT: number;
   HOST: string;
   MONGODB_URI: string;
   JWT_SECRET: string;
   JWT_EXPIRES_IN: string;
   COOKIE_SECRET: string;
   CORS_ORIGIN: string;
   GOOGLE_CLIENT_ID: string;
   GOOGLE_CLIENT_SECRET: string;
   GOOGLE_REDIRECT_URI: string;
   FRONTEND_URL: string;
   REDIS_URL: string;
}

export const envSchema = {
   type: 'object',
   required: [
      'PORT',
      'MONGODB_URI',
      'JWT_SECRET',
      'GOOGLE_CLIENT_ID',
      'GOOGLE_CLIENT_SECRET',
   ],
   properties: {
      NODE_ENV: {
         type: 'string',
         default: 'development',
      },
      PORT: {
         type: 'number',
         default: 5000,
      },
      HOST: {
         type: 'string',
         default: '0.0.0.0',
      },
      MONGODB_URI: {
         type: 'string',
      },
      JWT_SECRET: {
         type: 'string',
      },
      JWT_EXPIRES_IN: {
         type: 'string',
         default: '7d',
      },
      COOKIE_SECRET: {
         type: 'string',
         default: 'cookie-secret',
      },
      CORS_ORIGIN: {
         type: 'string',
         default: 'http://localhost:3001',
      },
      GOOGLE_CLIENT_ID: {
         type: 'string',
      },
      GOOGLE_CLIENT_SECRET: {
         type: 'string',
      },
      GOOGLE_REDIRECT_URI: {
         type: 'string',
         default: 'http://localhost:3000/api/auth/google/callback',
      },
      FRONTEND_URL: {
         type: 'string',
         default: 'http://localhost:3001',
      },
      REDIS_URL: {
         type: 'string',
         default: 'redis://localhost:6379',
      },
   },
};
