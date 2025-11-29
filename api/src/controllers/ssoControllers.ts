import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ssoService, SSOAuthorizeRequest, SSOTokenRequest } from '../services/ssoService';
import { tokenService } from '../services/tokenService';
import { prisma } from '../config/database';

export class SSOController {
  /**
   * GET /api/v1/auth/sso/authorize
   * SSO Authorization endpoint - brokers request to Identity
   */
  public authorize = async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorUrl = new URL(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/error`);
        errorUrl.searchParams.set('error', 'invalid_request');
        errorUrl.searchParams.set('error_description', 'Validation failed');
        if (req.query.state) errorUrl.searchParams.set('state', req.query.state as string);
        return res.redirect(errorUrl.toString());
      }

      const request: SSOAuthorizeRequest = {
        client_id: req.query.client_id as string,
        redirect_uri: req.query.redirect_uri as string,
        response_type: req.query.response_type as string,
        state: req.query.state as string,
        scope: req.query.scope as string,
        code_challenge: req.query.code_challenge as string,
        code_challenge_method: req.query.code_challenge_method as string,
        final_redirect_url: req.query.final_redirect_url as string
      };

      const result = await ssoService.authorize(request, req);
      
      // Redirect to Identity or back to client with tokens
      res.redirect(result.redirectUrl);
    } catch (error) {
      console.error('SSO Authorization error:', error);
      
      const errorUrl = new URL(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/error`);
      errorUrl.searchParams.set('error', 'server_error');
      errorUrl.searchParams.set('error_description', 'Internal server error');
      if (req.query.state) errorUrl.searchParams.set('state', req.query.state as string);
      
      res.redirect(errorUrl.toString());
    }
  };

  /**
   * POST /api/v1/auth/sso/token
   * SSO Token endpoint - exchange authorization code for tokens
   */
  public token = async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          error: 'invalid_request',
          error_description: 'Validation failed',
          details: errors.array()
        });
        return;
      }

      const request: SSOTokenRequest = {
        grant_type: req.body.grant_type,
        code: req.body.code,
        client_id: req.body.client_id,
        client_secret: req.body.client_secret,
        redirect_uri: req.body.redirect_uri,
        code_verifier: req.body.code_verifier
      };

      const tokens = await ssoService.exchangeToken(request);
      
      res.status(200).json(tokens);
    } catch (error) {
      console.error('SSO Token exchange error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Invalid client')) {
          res.status(401).json({
            error: 'invalid_client',
            error_description: error.message
          });
        } else if (error.message.includes('authorization code')) {
          res.status(400).json({
            error: 'invalid_grant',
            error_description: error.message
          });
        } else {
          res.status(400).json({
            error: 'invalid_request',
            error_description: error.message
          });
        }
      } else {
        res.status(500).json({
          error: 'server_error',
          error_description: 'Internal server error'
        });
      }
    }
  };

  /**
   * POST /api/v1/auth/sso/refresh
   * SSO Refresh token endpoint
   */
  public refresh = async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          error: 'invalid_request',
          error_description: 'Validation failed',
          details: errors.array()
        });
        return;
      }

      const { refresh_token } = req.body;
      
      if (!refresh_token) {
        res.status(400).json({
          error: 'invalid_request',
          error_description: 'Refresh token is required'
        });
        return;
      }

      const tokens = await ssoService.refreshToken(refresh_token);
      
      res.status(200).json(tokens);
    } catch (error) {
      console.error('SSO Token refresh error:', error);
      
      res.status(401).json({
        error: 'invalid_grant',
        error_description: 'Invalid or expired refresh token'
      });
    }
  };

  /**
   * POST /api/v1/auth/sso/logout
   * SSO Logout endpoint - clears API session and forwards to Identity
   */
  public logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      let accessToken: string | undefined;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        accessToken = authHeader.substring(7);
      }

      const result = await ssoService.logout(accessToken);
      
      // Redirect to Identity for session logout
      res.redirect(result.identityLogoutUrl);
    } catch (error) {
      console.error('SSO Logout error:', error);
      
      // Even on error, redirect to Identity
      const identityLogoutUrl = 'https://sso.skygenesisenterprise.com/api/v1/oauth/logout?redirect_uri=https://api.skygenesisenterprise.com/api/v1/auth/sso/logout/callback';
      res.redirect(identityLogoutUrl);
    }
  };

  /**
   * GET /api/v1/auth/sso/logout/callback
   * SSO Logout callback from Identity
   */
  public logoutCallback = async (req: Request, res: Response): Promise<void> => {
    try {
      const { logout_id, success } = req.query;
      
      // In a real implementation, you would:
      // 1. Verify logout_id and mark logout session as completed
      // 2. Clear any local API session data
      // 3. Optionally redirect back to the original application
      
      res.status(200).json({
        success: true,
        message: 'Logged out successfully from Aether Identity',
        logout_id
      });
    } catch (error) {
      console.error('SSO Logout callback error:', error);
      
      res.status(500).json({
        success: false,
        message: 'Logout callback processing failed'
      });
    }
  };

  /**
   * GET /api/v1/auth/sso/callback
   * SSO callback from Identity - handles authentication result
   */
  public callback = async (req: Request, res: Response): Promise<void> => {
    try {
      const { session_id, user_id, error, error_description } = req.query;
      
      if (error) {
        // Authentication failed - redirect back to client with error
        const errorUrl = new URL(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/error`);
        errorUrl.searchParams.set('error', error as string);
        if (error_description) errorUrl.searchParams.set('error_description', error_description as string);
        
        return res.redirect(errorUrl.toString());
      }

      if (!session_id || !user_id) {
        throw new Error('Missing required parameters from Identity');
      }

      // Get auth session
      const authSession = await prisma.authSession.findUnique({
        where: { sessionId: session_id as string },
        include: { client: true }
      });

      if (!authSession) {
        throw new Error('Invalid authorization session');
      }

      // Update session with user info
      await prisma.authSession.update({
        where: { id: authSession.id },
        data: {
          userId: user_id as string,
          isCompleted: true
        }
      });

      // Get user data for token generation
      const user = await prisma.user.findUnique({
        where: { id: user_id as string },
        include: {
          profile: true,
          memberships: { include: { organization: true } }
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Generate tokens
      const accessToken = tokenService.generateAccessToken(user);
      const refreshToken = tokenService.generateRefreshToken(user);
      const idToken = tokenService.generateIdToken(user, authSession.client.clientId);

      // Create authorization code with tokens
      const codeData = {
        sessionId: authSession.sessionId,
        tokens: { accessToken, refreshToken, idToken },
        scope: authSession.scope,
        timestamp: Date.now()
      };

      const authCode = tokenService.generateAuthorizationCode(codeData);

      // Build redirect URL with authorization code
      const redirectUrl = new URL(authSession.finalRedirectUrl || authSession.redirectUri);
      redirectUrl.searchParams.set('code', authCode);
      redirectUrl.searchParams.set('state', authSession.state || '');
      
      // Redirect back to client application
      res.redirect(redirectUrl.toString());
    } catch (error) {
      console.error('SSO Callback error:', error);
      
      const errorUrl = new URL(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/error`);
      errorUrl.searchParams.set('error', 'server_error');
      errorUrl.searchParams.set('error_description', 'Internal server error');
      
      res.redirect(errorUrl.toString());
    }
  };

  /**
   * GET /api/v1/auth/sso/.well-known/openid_configuration
   * OpenID Connect discovery endpoint
   */
  public openidConfiguration = async (req: Request, res: Response): Promise<void> => {
    try {
      const configuration = {
        issuer: 'https://sso.skygenesisenterprise.com',
        authorization_endpoint: 'https://api.skygenesisenterprise.com/api/v1/auth/sso/authorize',
        token_endpoint: 'https://api.skygenesisenterprise.com/api/v1/auth/sso/token',
        userinfo_endpoint: 'https://api.skygenesisenterprise.com/api/v1/auth/userinfo',
        jwks_uri: 'https://sso.skygenesisenterprise.com/.well-known/jwks.json',
        end_session_endpoint: 'https://api.skygenesisenterprise.com/api/v1/auth/sso/logout',
        registration_endpoint: 'https://api.skygenesisenterprise.com/api/v1/clients',
        scopes_supported: [
          'openid', 'profile', 'email', 'address', 'phone',
          'offline_access', 'read', 'write', 'delete', 'admin',
          'organizations', 'projects'
        ],
        response_types_supported: ['code'],
        grant_types_supported: [
          'authorization_code', 'refresh_token'
        ],
        subject_types_supported: ['public'],
        id_token_signing_alg_values_supported: ['RS256'],
        token_endpoint_auth_methods_supported: [
          'client_secret_basic', 'client_secret_post', 'none'
        ],
        claims_supported: [
          'sub', 'email', 'email_verified', 'name', 'picture',
          'given_name', 'family_name', 'role', 'organization_id',
          'tenant_id', 'plan', 'permissions'
        ]
      };

      res.status(200).json(configuration);
    } catch (error) {
      console.error('OpenID Configuration error:', error);
      res.status(500).json({
        error: 'server_error',
        error_description: 'Internal server error'
      });
    }
  };

  /**
   * GET /api/v1/auth/sso/.well-known/jwks.json
   * JSON Web Key Set endpoint
   */
  public jwks = async (req: Request, res: Response): Promise<void> => {
    try {
      // In production, this would return the actual public keys
      // For now, we'll return a placeholder
      const jwks = {
        keys: [
          {
            kty: 'RSA',
            use: 'sig',
            alg: 'RS256',
            kid: process.env.JWT_KEY_ID || 'default-key',
            n: process.env.JWT_RSA_N || 'placeholder_n',
            e: process.env.JWT_RSA_E || 'AQAB'
          }
        ]
      };

      res.status(200).json(jwks);
    } catch (error) {
      console.error('JWKS error:', error);
      res.status(500).json({
        error: 'server_error',
        error_description: 'Internal server error'
      });
    }
  };
}