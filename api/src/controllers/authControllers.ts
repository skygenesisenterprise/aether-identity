import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { config, prisma } from '../config/database';
import { AuthenticatedRequest } from '../middlewares/authMiddlewares';

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
      const { email, password } = req.body;

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
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
          error: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS'
        });
        return;
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({
          error: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS'
        });
        return;
      }

      // Check if user is active
      if (user.status !== 'ACTIVE') {
        res.status(401).json({
          error: 'Account is not active',
          code: 'ACCOUNT_INACTIVE'
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

      // Store refresh token (in a real app, you'd store this in a separate table)
      // For now, we'll just return it

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
   * POST /api/v1/auth/register
   */
  public register = async (req: Request, res: Response): Promise<void> => {
    if (this.handleValidationErrors(req, res)) return;

    try {
      const { email, password, fullName } = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
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

      // Create user
      const user = await prisma.user.create({
        data: {
          id: uuidv4(),
          email,
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
}