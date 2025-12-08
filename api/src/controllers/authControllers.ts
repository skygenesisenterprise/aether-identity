import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { config, prisma } from '../config/database';
import { AuthenticatedRequest } from '../middlewares/authMiddlewares';
import { mfaService } from '../services/mfaService';

export class AuthController {
  
  /**
   * Generate JWT tokens for user
   */
  private generateTokens(user: any) {
    const accessTokenOptions: SignOptions = {
      expiresIn: config.jwt.expiresIn as any
    };

    const accessToken = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        permissions: this.getUserPermissions(user.role)
      },
      config.jwt.secret,
      accessTokenOptions
    );

    const refreshTokenOptions: SignOptions = {
      expiresIn: '7d'
    };

    const refreshToken = jwt.sign(
      { sub: user.id, type: 'refresh' },
      config.jwt.secret,
      refreshTokenOptions
    );

    const idTokenOptions: SignOptions = {
      expiresIn: config.jwt.expiresIn as any
    };

    const idToken = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        name: user.fullName,
        picture: user.avatar
      },
      config.jwt.secret,
      idTokenOptions
    );

    return { accessToken, refreshToken, idToken };
  }

  /**
   * Get user permissions based on role
   */
  private getUserPermissions(role: string): string[] {
    switch (role) {
      case 'ADMIN':
        return [
          'users:read', 'users:write', 'users:delete',
          'accounts:read', 'accounts:write', 'accounts:delete',
          'organizations:read', 'organizations:write', 'organizations:delete',
          'projects:read', 'projects:write', 'projects:delete',
          'admin:access'
        ];
      case 'MANAGER':
        return [
          'users:read',
          'accounts:read', 'accounts:write',
          'organizations:read',
          'projects:read', 'projects:write'
        ];
      case 'USER':
        return [
          'accounts:read',
          'projects:read'
        ];
      default:
        return ['accounts:read'];
    }
  }

  /**
   * Handle validation errors
   */
  private handleValidationErrors(req: Request, res: Response): boolean {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        error: 'Validation failed',
        details: errors.array().map(err => ({
          field: err.type === 'field' ? (err as any).path : 'unknown',
          message: err.msg,
          value: err.type === 'field' ? (err as any).value : undefined
        }))
      });
      return true;
    }
    return false;
  }

  /**
   * POST /api/v1/auth/login
   */
  public login = async (req: Request, res: Response): Promise<void> => {
    if (this.handleValidationErrors(req, res)) return;

    try {
      const { email, password, sessionId } = req.body;

      // Find user by email (case-insensitive for SQLite)
      const user = await prisma.user.findFirst({
        where: { 
          email: {
            equals: email.toLowerCase()
          }
        },
        include: {
          profile: true,
          memberships: {
            include: {
              organization: true
            }
          }
        }
      });

      if (!user) {
        console.log(`❌ Login failed: User not found`);
        res.status(401).json({
          error: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS'
        });
        return;
      }

      console.log(`✅ User found, Status: ${user.status}`);

      // Check password
      console.log(`🔍 Debug - Stored hash: "${user.password.substring(0, 20)}..."`);
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log(`🔍 Debug - Password comparison result: ${isPasswordValid}`);
      
      if (!isPasswordValid) {
        console.log(`❌ Login failed: Invalid password`);
        
        // Test with a new hash to verify bcrypt works
        const testHash = await bcrypt.hash(password, 12);
        const testComparison = await bcrypt.compare(password, testHash);
        console.log(`🔍 Debug - New hash test: ${testComparison}`);
        
        res.status(401).json({
          error: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS'
        });
        return;
      }

      console.log(`✅ Password validated`);

      // Check if user is active
      if (user.status !== 'ACTIVE') {
        console.log(`❌ Login failed: Account not active, Status: ${user.status}`);
        res.status(401).json({
          error: 'Account is not active',
          code: 'ACCOUNT_INACTIVE'
        });
        return;
      }

      console.log(`✅ User status validated: ${user.status}`);

      // Check if MFA is required
      if (user.mfaEnabled) {
        if (!sessionId) {
          // Create temporary session for MFA verification
          const tempSessionId = uuidv4();
          
          res.status(200).json({
            success: true,
            requiresMFA: true,
            data: {
              userId: user.id,
              sessionId: tempSessionId,
              mfaMethod: user.mfaMethod,
              message: 'MFA verification required'
            }
          });
          return;
        }

        // MFA flow - user has provided sessionId
        res.status(200).json({
          success: true,
          requiresMFA: true,
          data: {
            userId: user.id,
            sessionId,
            mfaMethod: user.mfaMethod,
            message: 'Please complete MFA verification'
          }
        });
        return;
      }

      // No MFA required - generate tokens
      const tokens = this.generateTokens(user);

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      });

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            fullName: user.profile?.firstName && user.profile?.lastName 
              ? `${user.profile.firstName} ${user.profile.lastName}`
              : user.email,
            avatar: user.profile?.avatar,
            role: user.role,
            status: user.status,
            lastLoginAt: user.lastLoginAt,
            memberships: user.memberships.map(membership => ({
              id: membership.id,
              organization: {
                id: membership.organization.id,
                name: membership.organization.name,
                slug: membership.organization.slug
              },
              role: membership.role,
              joinedAt: membership.joinedAt
            }))
          },
          tokens
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'LOGIN_ERROR'
      });
    }
  };

  /**
   * POST /api/v1/auth/login-complete
   * Complete login after MFA verification
   */
  public completeLogin = async (req: Request, res: Response): Promise<void> => {
    if (this.handleValidationErrors(req, res)) return;

    try {
      const { userId, sessionId } = req.body;

      // Find user
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
          memberships: {
            include: {
              organization: true
            }
          }
        }
      });

      if (!user) {
        res.status(401).json({
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        });
        return;
      }

      // Generate tokens
      const tokens = this.generateTokens(user);

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      });

      // Clean up MFA session
      await prisma.mfaSession.deleteMany({
        where: { sessionId }
      });

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            fullName: user.profile?.firstName && user.profile?.lastName 
              ? `${user.profile.firstName} ${user.profile.lastName}`
              : user.email,
            avatar: user.profile?.avatar,
            role: user.role,
            status: user.status,
            lastLoginAt: user.lastLoginAt,
            memberships: user.memberships.map(membership => ({
              id: membership.id,
              organization: {
                id: membership.organization.id,
                name: membership.organization.name,
                slug: membership.organization.slug
              },
              role: membership.role,
              joinedAt: membership.joinedAt
            }))
          },
          tokens
        }
      });
    } catch (error) {
      console.error('Complete login error:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'COMPLETE_LOGIN_ERROR'
      });
    }
  };

  /**
   * POST /api/v1/auth/register
   */
  public register = async (req: Request, res: Response): Promise<void> => {
    if (this.handleValidationErrors(req, res)) return;

    try {
      const { email, password, fullName } = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      });

      if (existingUser) {
        res.status(409).json({
          error: 'User already exists',
          code: 'USER_EXISTS'
        });
        return;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);
      console.log(`🔍 Debug - Generated hash: "${hashedPassword.substring(0, 20)}..."`);
      
      // Test hash immediately
      const testComparison = await bcrypt.compare(password, hashedPassword);
      console.log(`🔍 Debug - Hash test during registration: ${testComparison}`);

      // Create user
      const user = await prisma.user.create({
        data: {
          id: uuidv4(),
          email: email.toLowerCase(),
          password: hashedPassword,
          role: 'USER',
          status: 'ACTIVE',
          profile: {
            create: {
              id: uuidv4(),
              firstName: fullName.split(' ')[0],
              lastName: fullName.split(' ').slice(1).join(' '),
              avatar: null
            }
          }
        },
        include: {
          profile: true,
          memberships: true
        }
      });

      console.log(`✅ User created successfully, ID: ${user.id}, Status: ${user.status}`);

      // Generate tokens
      const tokens = this.generateTokens(user);

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            fullName: user.profile?.firstName && user.profile?.lastName 
              ? `${user.profile.firstName} ${user.profile.lastName}`
              : user.email,
            avatar: user.profile?.avatar,
            role: user.role,
            status: user.status,
            memberships: []
          },
          tokens
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'REGISTRATION_ERROR'
      });
    }
  };

  /**
   * POST /api/v1/auth/refresh
   */
  public refreshToken = async (req: Request, res: Response): Promise<void> => {
    if (this.handleValidationErrors(req, res)) return;

    try {
      const { refreshToken } = req.body;

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, config.jwt.secret) as any;
      
      if (decoded.type !== 'refresh') {
        res.status(401).json({
          error: 'Invalid refresh token',
          code: 'INVALID_TOKEN'
        });
        return;
      }

      // Find user
      const user = await prisma.user.findUnique({
        where: { id: decoded.sub },
        include: { profile: true }
      });

      if (!user || user.status !== 'ACTIVE') {
        res.status(401).json({
          error: 'User not found or inactive',
          code: 'USER_INACTIVE'
        });
        return;
      }

      // Generate new tokens
      const tokens = this.generateTokens(user);

      res.status(200).json({
        success: true,
        data: { tokens }
      });
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(401).json({
        error: 'Invalid or expired refresh token',
        code: 'TOKEN_EXPIRED'
      });
    }
  };

  /**
   * POST /api/v1/auth/logout
   */
  public logout = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      // In a real implementation, you would:
      // 1. Add the token to a blacklist
      // 2. Remove the refresh token from the database
      // 3. Clear any session data
      
      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'LOGOUT_ERROR'
      });
    }
  };

  /**
   * GET /api/v1/auth/me
   */
  public getCurrentUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
        include: {
          profile: true,
          memberships: {
            include: {
              organization: true
            }
          }
        }
      });

      if (!user) {
        res.status(404).json({
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          fullName: user.profile?.firstName && user.profile?.lastName 
            ? `${user.profile.firstName} ${user.profile.lastName}`
            : user.email,
          avatar: user.profile?.avatar,
          role: user.role,
          status: user.status,
          lastLoginAt: user.lastLoginAt,
          memberships: user.memberships.map(membership => ({
            id: membership.id,
            organization: {
              id: membership.organization.id,
              name: membership.organization.name,
              slug: membership.organization.slug
            },
            role: membership.role,
            joinedAt: membership.joinedAt
          }))
        }
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'GET_USER_ERROR'
      });
    }
  };

  /**
   * POST /api/v1/auth/forgot-password
   */
  public forgotPassword = async (req: Request, res: Response): Promise<void> => {
    if (this.handleValidationErrors(req, res)) return;

    try {
      const { email } = req.body;

      const user = await prisma.user.findUnique({
        where: { email }
      });

      // Always return success to prevent email enumeration
      if (!user) {
        res.status(200).json({
          success: true,
          message: 'If an account with that email exists, a password reset link has been sent'
        });
        return;
      }

      // Generate reset token
      const resetToken = jwt.sign(
        { sub: user.id, type: 'password_reset' },
        config.jwt.secret,
        { expiresIn: '1h' }
      );

      // In a real implementation, send email with reset link
      console.log(`Password reset token for ${email}: ${resetToken}`);

      res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent'
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'FORGOT_PASSWORD_ERROR'
      });
    }
  };

  /**
   * POST /api/v1/auth/reset-password
   */
  public resetPassword = async (req: Request, res: Response): Promise<void> => {
    if (this.handleValidationErrors(req, res)) return;

    try {
      const { token, password } = req.body;

      // Verify reset token
      const decoded = jwt.verify(token, config.jwt.secret) as any;
      
      if (decoded.type !== 'password_reset') {
        res.status(401).json({
          error: 'Invalid reset token',
          code: 'INVALID_TOKEN'
        });
        return;
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Update user password
      await prisma.user.update({
        where: { id: decoded.sub },
        data: { password: hashedPassword }
      });

      res.status(200).json({
        success: true,
        message: 'Password reset successfully'
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(401).json({
        error: 'Invalid or expired reset token',
        code: 'TOKEN_EXPIRED'
      });
    }
  };

  /**
   * POST /api/v1/auth/verify-email
   */
  public verifyEmail = async (req: Request, res: Response): Promise<void> => {
    if (this.handleValidationErrors(req, res)) return;

    try {
      const { token } = req.body;

      // Verify email token
      const decoded = jwt.verify(token, config.jwt.secret) as any;
      
      if (decoded.type !== 'email_verification') {
        res.status(401).json({
          error: 'Invalid verification token',
          code: 'INVALID_TOKEN'
        });
        return;
      }

      // Update user email verification status
      await prisma.user.update({
        where: { id: decoded.sub },
        data: { emailVerified: true }
      });

      res.status(200).json({
        success: true,
        message: 'Email verified successfully'
      });
    } catch (error) {
      console.error('Email verification error:', error);
      res.status(401).json({
        error: 'Invalid or expired verification token',
        code: 'TOKEN_EXPIRED'
      });
    }
  };

  /**
   * POST /api/v1/auth/change-password
   */
  public changePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (this.handleValidationErrors(req, res)) return;

    try {
      const { currentPassword, newPassword } = req.body;

      // Get user with current password
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id }
      });

      if (!user) {
        res.status(404).json({
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        });
        return;
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        res.status(401).json({
          error: 'Current password is incorrect',
          code: 'INVALID_CURRENT_PASSWORD'
        });
        return;
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      // Update password
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedNewPassword }
      });

      res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'CHANGE_PASSWORD_ERROR'
      });
    }
  };

  /**
   * GET /api/v1/auth/authorize
   * OAuth2 Authorization endpoint with dynamic client validation and redirect URLs
   */
  public authorize = async (req: Request, res: Response): Promise<void> => {
    try {
      const { 
        client_id, 
        redirect_uri, 
        response_type, 
        state, 
        scope, 
        code_challenge, 
        code_challenge_method,
        final_redirect_url // Dynamic final redirect URL
      } = req.query;

      // Validate required parameters
      if (!client_id || response_type !== 'code') {
        const errorUrl = new URL(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/error`);
        errorUrl.searchParams.set('error', 'invalid_request');
        errorUrl.searchParams.set('error_description', 'Missing required parameters');
        if (state) errorUrl.searchParams.set('state', state as string);
        return res.redirect(errorUrl.toString());
      }

      // Validate client application
      const client = await prisma.clientApplication.findUnique({
        where: { clientId: client_id as string }
      });

      if (!client || !client.isActive) {
        const errorUrl = new URL(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/error`);
        errorUrl.searchParams.set('error', 'invalid_client');
        errorUrl.searchParams.set('error_description', 'Client not found or inactive');
        if (state) errorUrl.searchParams.set('state', state as string);
        return res.redirect(errorUrl.toString());
      }

      // Determine redirect URI with priority:
      // 1. final_redirect_url (highest priority - dynamic)
      // 2. redirect_uri (OAuth2 standard)
      // 3. client.defaultRedirectUrl (fallback)
      let finalRedirectUri: string;
      
      if (final_redirect_url) {
        // Validate dynamic final redirect URL
        try {
          const url = new URL(final_redirect_url as string);
          finalRedirectUri = url.toString();
        } catch {
          const errorUrl = new URL(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/error`);
          errorUrl.searchParams.set('error', 'invalid_redirect_uri');
          errorUrl.searchParams.set('error_description', 'Invalid final redirect URL format');
          if (state) errorUrl.searchParams.set('state', state as string);
          return res.redirect(errorUrl.toString());
        }
      } else if (redirect_uri) {
        // Validate standard redirect URI against allowed URIs
        const allowedUris = JSON.parse(client.redirectUris);
        if (!allowedUris.includes(redirect_uri as string)) {
          const errorUrl = new URL(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/error`);
          errorUrl.searchParams.set('error', 'invalid_redirect_uri');
          errorUrl.searchParams.set('error_description', 'Redirect URI not allowed');
          if (state) errorUrl.searchParams.set('state', state as string);
          return res.redirect(errorUrl.toString());
        }
        finalRedirectUri = redirect_uri as string;
      } else if (client.defaultRedirectUrl) {
        // Use client's default redirect URL
        finalRedirectUri = client.defaultRedirectUrl;
      } else {
        const errorUrl = new URL(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/error`);
        errorUrl.searchParams.set('error', 'invalid_redirect_uri');
        errorUrl.searchParams.set('error_description', 'No redirect URI specified');
        if (state) errorUrl.searchParams.set('state', state as string);
        return res.redirect(errorUrl.toString());
      }

      // Validate scope
      const allowedScopes = JSON.parse(client.allowedScopes);
      const requestedScopes = (scope as string || '').split(' ').filter(s => s);
      const validScopes = requestedScopes.filter(s => allowedScopes.includes(s));
      const finalScopes = validScopes.length > 0 ? validScopes : JSON.parse(client.defaultScopes);

      // Create authorization session
      const sessionId = uuidv4();
      const authCode = crypto.randomBytes(32).toString('hex');
      
      await prisma.authSession.create({
        data: {
          id: uuidv4(),
          sessionId,
          clientId: client.id,
          userId: '', // Will be set after authentication
          state: state as string || undefined,
          redirectUri: redirect_uri as string || client.defaultRedirectUrl || '',
          finalRedirectUrl: final_redirect_url as string || undefined,
          scope: finalScopes.join(' '),
          responseType: response_type as string,
          codeChallenge: code_challenge as string || undefined,
          codeChallengeMethod: code_challenge_method as string || undefined,
          authCode,
          authCodeExpiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
        }
      });

      // Redirect to login page with OAuth2 parameters
      const loginUrl = new URL(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`);
      loginUrl.searchParams.set('session_id', sessionId);
      loginUrl.searchParams.set('client_id', client_id as string);
      loginUrl.searchParams.set('redirect_uri', finalRedirectUri);
      loginUrl.searchParams.set('response_type', response_type as string);
      loginUrl.searchParams.set('scope', finalScopes.join(' '));
      if (state) loginUrl.searchParams.set('state', state as string);
      if (final_redirect_url) loginUrl.searchParams.set('final_redirect_url', final_redirect_url as string);
      
      // Add client info for display
      loginUrl.searchParams.set('client_name', client.name);
      loginUrl.searchParams.set('client_logo', client.logoUrl || '');
      loginUrl.searchParams.set('skip_consent', client.skipConsent.toString());

      res.redirect(loginUrl.toString());
    } catch (error) {
      console.error('Authorization error:', error);
      const errorUrl = new URL(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/error`);
      errorUrl.searchParams.set('error', 'server_error');
      errorUrl.searchParams.set('error_description', 'Internal server error');
      return res.redirect(errorUrl.toString());
    }
  };

  /**
   * POST /api/v1/auth/token
   * OAuth2 Token endpoint - exchange authorization code for tokens
   */
  public exchangeToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { grant_type, code, client_id, client_secret, redirect_uri } = req.body;

      if (grant_type !== 'authorization_code' || !code || !client_id) {
        res.status(400).json({
          error: 'invalid_request',
          error_description: 'Missing required parameters'
        });
        return;
      }

      // Decode and validate authorization code
      let authData;
      try {
        authData = JSON.parse(Buffer.from(code, 'base64').toString());
      } catch (error) {
        res.status(400).json({
          error: 'invalid_grant',
          error_description: 'Invalid authorization code'
        });
        return;
      }

      // Check if code is expired (5 minutes)
      if (Date.now() - authData.timestamp > 5 * 60 * 1000) {
        res.status(400).json({
          error: 'invalid_grant',
          error_description: 'Authorization code expired'
        });
        return;
      }

      // In a real implementation, validate client_id and client_secret
      // against registered applications in database
      const validClients = {
        'demo-app': 'demo-secret',
        'test-app': 'test-secret',
      };

      if (client_secret && validClients[client_id as keyof typeof validClients] !== client_secret) {
        res.status(401).json({
          error: 'invalid_client',
          error_description: 'Invalid client credentials'
        });
        return;
      }

      // Return tokens to client application
      res.status(200).json({
        access_token: authData.tokens.accessToken,
        refresh_token: authData.tokens.refreshToken,
        id_token: authData.tokens.idToken,
        token_type: 'Bearer',
        expires_in: 86400, // 24 hours
        scope: authData.scope || 'read write'
      });

    } catch (error) {
      console.error('Token exchange error:', error);
      res.status(500).json({
        error: 'server_error',
        error_description: 'Internal server error'
      });
    }
  };

  /**
   * POST /api/v1/auth/revoke
   * OAuth2 Token revocation endpoint
   */
  public revokeToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token, token_type_hint } = req.body;

      if (!token) {
        res.status(400).json({
          error: 'invalid_request',
          error_description: 'Token is required'
        });
        return;
      }

      // In a real implementation, add token to blacklist
      // or remove from database/session store
      
      res.status(200).json({});
    } catch (error) {
      console.error('Token revocation error:', error);
      res.status(500).json({
        error: 'server_error',
        error_description: 'Internal server error'
      });
    }
  };

  /**
   * GET /api/v1/auth/userinfo
   * OAuth2 Userinfo endpoint
   */
  public getUserInfo = async (req: Request, res: Response): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          error: 'invalid_token',
          error_description: 'Access token is required'
        });
        return;
      }

      const token = authHeader.substring(7);
      
      // Verify access token
      const decoded = jwt.verify(token, config.jwt.secret) as any;
      
      // Get user information
      const user = await prisma.user.findUnique({
        where: { id: decoded.sub },
        include: { profile: true }
      });

      if (!user || user.status !== 'ACTIVE') {
        res.status(401).json({
          error: 'invalid_token',
          error_description: 'User not found or inactive'
        });
        return;
      }

      // Return user info according to OAuth2 userinfo endpoint spec
      res.status(200).json({
        sub: user.id,
        email: user.email,
        email_verified: user.emailVerified || false,
        name: user.profile?.firstName && user.profile?.lastName 
          ? `${user.profile.firstName} ${user.profile.lastName}`
          : user.email,
        given_name: user.profile?.firstName,
        family_name: user.profile?.lastName,
        picture: user.profile?.avatar,
        role: user.role,
        updated_at: user.updatedAt
      });

    } catch (error) {
      console.error('Userinfo error:', error);
      res.status(401).json({
        error: 'invalid_token',
        error_description: 'Invalid or expired access token'
      });
    }
  };
}