import type { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/auth.service.js';
import type { GoogleUserInfo } from '../types/oauth.js';

interface RegisterBody {
   email: string;
   password: string;
   name: string;
}

interface LoginBody {
   email: string;
   password: string;
}

export class AuthController {
   /**
    * Google OAuth callback handler
    */
   static async googleCallback(request: FastifyRequest, reply: FastifyReply) {
      const frontendUrl = request.server.config.FRONTEND_URL;

      try {
         request.log.info('Google OAuth callback received');

         // Get access token from OAuth2
         const token =
            await request.server.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
               request
            );

         request.log.info('Access token obtained');

         // Extract access token (handle both formats)
         const accessToken =
            (token as any).access_token || (token as any).token?.access_token;

         if (!accessToken) {
            throw new Error('No access token received from Google');
         }

         request.log.info('Fetching user info from Google...');

         // Fetch user info from Google
         const response = await fetch(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            {
               headers: {
                  Authorization: `Bearer ${accessToken}`,
               },
            }
         );

         if (!response.ok) {
            const errorText = await response.text();
            request.log.error({ msg: 'Google API error:', errorText });
            throw new Error(
               `Google API returned ${response.status}: ${errorText}`
            );
         }

         const googleUserInfo = (await response.json()) as GoogleUserInfo;
         request.log.info({
            msg: 'User info received from Google:',
            email: googleUserInfo.email,
         });

         // Find or create user
         const user = await AuthService.findOrCreateGoogleUser(googleUserInfo);
         request.log.info({ msg: 'User found/created:', userId: user._id });

         // Generate JWT token
         const jwtToken = request.server.jwt.sign({
            id: user._id.toString(),
            email: user.email,
            role: user.role,
         });

         // Set cookie
         reply.setCookie('token', jwtToken, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 days
         });

         request.log.info('Redirecting to frontend with token');

         // Redirect to frontend with success
         return reply.redirect(`${frontendUrl}/auth/success?token=${jwtToken}`);
      } catch (error: any) {
         request.log.error('OAuth callback error:', error);

         // Redirect to error page with message
         const errorMessage = encodeURIComponent(
            error.message || 'Authentication failed'
         );
         return reply.redirect(
            `${frontendUrl}/auth/error?message=${errorMessage}`
         );
      }
   }

   /**
    * Register with email/password
    */
   static async register(
      request: FastifyRequest<{ Body: RegisterBody }>,
      reply: FastifyReply
   ) {
      try {
         const { email, password, name } = request.body;

         // Validate input
         if (!email || !password || !name) {
            return reply.status(400).send({
               success: false,
               message: 'Email, password, and name are required',
            });
         }

         // Register user
         const user = await AuthService.registerWithEmail(
            email,
            password,
            name
         );

         // Generate JWT token
         const token = request.server.jwt.sign({
            id: user._id.toString(),
            email: user.email,
            role: user.role,
         });

         // Set cookie
         reply.setCookie('token', token, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60,
         });

         return reply.status(201).send({
            success: true,
            message: 'User registered successfully',
            data: {
               user: {
                  id: user._id.toString(),
                  email: user.email,
                  name: user.name,
                  role: user.role,
               },
               token,
            },
         });
      } catch (error: any) {
         return reply.status(400).send({
            success: false,
            message: error.message,
         });
      }
   }

   /**
    * Login with email/password
    */
   static async login(
      request: FastifyRequest<{ Body: LoginBody }>,
      reply: FastifyReply
   ) {
      try {
         const { email, password } = request.body;

         // Validate input
         if (!email || !password) {
            return reply.status(400).send({
               success: false,
               message: 'Email and password are required',
            });
         }

         // Login user
         const user = await AuthService.loginWithEmail(email, password);

         // Generate JWT token
         const token = request.server.jwt.sign({
            id: user._id.toString(),
            email: user.email,
            role: user.role,
         });

         // Set cookie
         reply.setCookie('token', token, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60,
         });

         return reply.status(200).send({
            success: true,
            message: 'Login successful',
            data: {
               user: {
                  id: user._id.toString(),
                  email: user.email,
                  name: user.name,
                  role: user.role,
                  avatar: user.avatar,
               },
               token,
            },
         });
      } catch (error: any) {
         return reply.status(401).send({
            success: false,
            message: error.message,
         });
      }
   }

   /**
    * Get current user
    */
   static async me(request: FastifyRequest, reply: FastifyReply) {
      try {
         const userId = request.user?.id;

         if (!userId) {
            return reply.status(401).send({
               success: false,
               message: 'Unauthorized',
            });
         }

         const user = await AuthService.getUserById(userId);

         if (!user) {
            return reply.status(404).send({
               success: false,
               message: 'User not found',
            });
         }

         return reply.status(200).send({
            success: true,
            data: {
               id: user._id.toString(),
               email: user.email,
               name: user.name,
               role: user.role,
               avatar: user.avatar,
               isEmailVerified: user.isEmailVerified,
            },
         });
      } catch (error: any) {
         return reply.status(500).send({
            success: false,
            message: error.message,
         });
      }
   }

   /**
    * Logout
    */
   static async logout(request: FastifyRequest, reply: FastifyReply) {
      reply.clearCookie('token');
      return reply.status(200).send({
         success: true,
         message: 'Logged out successfully',
      });
   }
}
