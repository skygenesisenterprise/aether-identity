import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { tokenService } from './tokenService';

import { v4 as uuidv4 } from 'uuid';

export interface IdentitySessionData {
  userId: string;
  email: string;
  role: string;
  sessionId: string;
  createdAt: Date;
  expiresAt: Date;
}

export class IdentitySessionService {
  private readonly cookieName = 'AETHER_IDENTITY_SESSION';
  private readonly cookieDomain = 'sso.skygenesisenterprise.com';
  private readonly sessionExpiry = 30 * 24 * 60 * 60 * 1000; // 30 days

  /**
   * Create Identity session cookie after successful authentication
   */
  createIdentitySession(res: Response, user: any): string {
    const sessionId = uuidv4();
    const sessionToken = this.generateSessionToken(user, sessionId);
    
    // Store session in database
    const expiresAt = new Date(Date.now() + this.sessionExpiry);
    
    // This would typically be stored in Redis or a session store
    // For now, we'll use the AuthSession table as a proxy
    prisma.authSession.create({
      data: {
        id: uuidv4(),
        sessionId: `identity_${sessionId}`,
        clientId: 'identity_system',
        userId: user.id,
        scope: 'identity_session',
        responseType: 'session',
        authCode: sessionToken,
        authCodeExpiresAt: expiresAt,
        isCompleted: true
      }
    }).catch(error => {
      console.error('Failed to store identity session:', error);
    });

    // Set HttpOnly, Secure, SameSite=Lax cookie
    res.cookie(this.cookieName, sessionToken, {
      domain: this.cookieDomain,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      expires: expiresAt,
      path: '/'
    });

    return sessionToken;
  }

  /**
   * Validate Identity session from cookie
   */
  async validateIdentitySession(req: Request): Promise<IdentitySessionData | null> {
    try {
      const sessionToken = req.cookies[this.cookieName];
      
      if (!sessionToken) {
        return null;
      }

      // Verify session token
      const decoded = tokenService.verifyAccessToken(sessionToken);
      
      // Check if session exists in database
      const session = await prisma.authSession.findFirst({
        where: {
          sessionId: { startsWith: 'identity_' },
          userId: decoded.sub,
          isCompleted: true,
          authCodeExpiresAt: { gt: new Date() }
        },
        include: {
          user: {
            include: {
              profile: true,
              memberships: {
                include: { organization: true }
              }
            }
          }
        }
      });

      if (!session || !session.user) {
        return null;
      }

      return {
        userId: session.user.id,
        email: session.user.email,
        role: session.user.role,
        sessionId: session.sessionId.replace('identity_', ''),
        createdAt: session.createdAt,
        expiresAt: session.authCodeExpiresAt
      };
    } catch (error) {
      console.error('Identity session validation error:', error);
      return null;
    }
  }

  /**
   * Clear Identity session cookie
   */
  clearIdentitySession(res: Response): void {
    res.clearCookie(this.cookieName, {
      domain: this.cookieDomain,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/'
    });
  }

  /**
   * Refresh Identity session
   */
  refreshIdentitySession(req: Request, res: Response, sessionData: IdentitySessionData): void {
    const newSessionToken = this.generateSessionToken(
      { id: sessionData.userId, email: sessionData.email, role: sessionData.role },
      sessionData.sessionId
    );

    const expiresAt = new Date(Date.now() + this.sessionExpiry);

    // Update session in database
    prisma.authSession.updateMany({
      where: {
        sessionId: `identity_${sessionData.sessionId}`,
        userId: sessionData.userId
      },
      data: {
        authCode: newSessionToken,
        authCodeExpiresAt: expiresAt
      }
    }).catch(error => {
      console.error('Failed to refresh identity session:', error);
    });

    // Set new cookie
    res.cookie(this.cookieName, newSessionToken, {
      domain: this.cookieDomain,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      expires: expiresAt,
      path: '/'
    });
  }

  /**
   * Generate session token for Identity
   */
  private generateSessionToken(user: any, sessionId: string): string {
    const claims = {
      sub: user.id,
      email: user.email,
      role: user.role,
      session_id: sessionId,
      type: 'identity_session',
      iss: 'https://sso.skygenesisenterprise.com',
      aud: 'aether_ecosystem',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days
    };

    return tokenService.generateAccessToken(user, claims);
  }

  /**
   * Handle OAuth2 authorization at Identity
   */
  async handleIdentityAuthorization(req: Request, res: Response): Promise<void> {
    try {
      const { session_id, client_id, redirect_uri, response_type, scope, state, api_callback } = req.query;

      // Check for existing Identity session
      const existingSession = await this.validateIdentitySession(req);
      
      if (existingSession) {
        // User already authenticated - seamless SSO
        await this.handleExistingIdentitySession(existingSession, req.query, res);
      } else {
        // Redirect to login page
        const loginUrl = new URL(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`);
        loginUrl.searchParams.set('session_id', session_id as string);
        loginUrl.searchParams.set('client_id', client_id as string);
        loginUrl.searchParams.set('redirect_uri', redirect_uri as string);
        loginUrl.searchParams.set('response_type', response_type as string);
        loginUrl.searchParams.set('scope', scope as string);
        loginUrl.searchParams.set('api_callback', api_callback as string);
        if (state) loginUrl.searchParams.set('state', state as string);
        
        res.redirect(loginUrl.toString());
      }
    } catch (error) {
      console.error('Identity authorization error:', error);
      
      const errorUrl = new URL(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/error`);
      errorUrl.searchParams.set('error', 'server_error');
      errorUrl.searchParams.set('error_description', 'Internal server error');
      
      res.redirect(errorUrl.toString());
    }
  }

  /**
   * Handle existing Identity session - seamless SSO
   */
  private async handleExistingIdentitySession(
    sessionData: IdentitySessionData,
    query: any,
    res: Response
  ): Promise<void> {
    try {
      const { session_id, api_callback, state } = query;

      // Get user data
      const user = await prisma.user.findUnique({
        where: { id: sessionData.userId },
        include: {
          profile: true,
          memberships: { include: { organization: true } }
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Update auth session with user info
      if (session_id) {
        await prisma.authSession.updateMany({
          where: { sessionId: session_id },
          data: {
            userId: user.id,
            isCompleted: true
          }
        });
      }

      // Build callback URL to API
      const callbackUrl = new URL(api_callback as string);
      callbackUrl.searchParams.set('session_id', session_id as string);
      callbackUrl.searchParams.set('user_id', user.id);
      if (state) callbackUrl.searchParams.set('state', state as string);

      // Redirect back to API
      res.redirect(callbackUrl.toString());
    } catch (error) {
      console.error('Handle existing session error:', error);
      
      const errorUrl = new URL(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/error`);
      errorUrl.searchParams.set('error', 'server_error');
      errorUrl.searchParams.set('error_description', 'Internal server error');
      
      res.redirect(errorUrl.toString());
    }
  }

  /**
   * Handle Identity logout
   */
  async handleIdentityLogout(req: Request, res: Response): Promise<void> {
    try {
      const { user_id, logout_id, redirect_uri } = req.query;

      // Clear Identity session
      this.clearIdentitySession(res);

      // In a real implementation, you would:
      // 1. Invalidate the session in your session store
      // 2. Log the logout event for auditing
      // 3. Notify other services about the logout

      if (user_id) {
        // Mark all user sessions as inactive
        await prisma.authSession.updateMany({
          where: {
            userId: user_id as string,
            isCompleted: true
          },
          data: {
            isCompleted: false
          }
        });
      }

      // Redirect back to API
      if (redirect_uri) {
        const callbackUrl = new URL(redirect_uri as string);
        if (logout_id) callbackUrl.searchParams.set('logout_id', logout_id as string);
        callbackUrl.searchParams.set('success', 'true');
        
        res.redirect(callbackUrl.toString());
      } else {
        res.status(200).json({
          success: true,
          message: 'Logged out successfully from Aether Identity'
        });
      }
    } catch (error) {
      console.error('Identity logout error:', error);
      
      // Even on error, try to redirect
      if (req.query.redirect_uri) {
        const callbackUrl = new URL(req.query.redirect_uri as string);
        callbackUrl.searchParams.set('success', 'false');
        callbackUrl.searchParams.set('error', 'logout_failed');
        
        res.redirect(callbackUrl.toString());
      } else {
        res.status(500).json({
          success: false,
          message: 'Logout failed'
        });
      }
    }
  }
}

export const identitySessionService = new IdentitySessionService();