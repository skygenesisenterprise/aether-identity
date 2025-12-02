import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../config/database';
import { AuthenticatedRequest } from '../middlewares/authMiddlewares';

export class AccountController {
  
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
   * POST /api/v1/accounts/authenticate
   */
  public authenticate = async (req: Request, res: Response): Promise<void> => {
    if (this.handleValidationErrors(req, res)) return;

    try {
      const { identifier, password } = req.body;

      // Find user by email, username, or phone
      let user = await prisma.user.findUnique({
        where: { email: identifier },
        include: {
          profile: true,
          memberships: {
            include: {
              organization: true
            }
          }
        }
      });

      // If not found by email, try username (if you have username field)
      if (!user) {
        user = await prisma.user.findFirst({
          where: {
            OR: [
              { profile: { phone: identifier } },
              // Add username search when you implement it
            ]
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
      }

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

      // Generate tokens (reuse from AuthController logic)
      const jwt = require('jsonwebtoken');
      const config = require('../config/database').config;
      
      const accessToken = jwt.sign(
        {
          sub: user.id,
          email: user.email,
          role: user.role,
          permissions: this.getRolePermissions(user.role)
        },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      const refreshToken = jwt.sign(
        { sub: user.id, type: 'refresh' },
        config.jwt.secret,
        { expiresIn: '7d' }
      );

      const idToken = jwt.sign(
        {
          sub: user.id,
          email: user.email,
          name: user.profile?.firstName && user.profile?.lastName 
            ? `${user.profile.firstName} ${user.profile.lastName}`
            : user.email,
          picture: user.profile?.avatar
        },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      });

      res.status(200).json({
        success: true,
        data: {
          account: {
            id: user.id,
            email: user.email,
            fullName: user.profile?.firstName && user.profile?.lastName 
              ? `${user.profile.firstName} ${user.profile.lastName}`
              : user.email,
            avatar: user.profile?.avatar,
            role: user.role,
            status: user.status,
            lastLoginAt: user.lastLoginAt
          },
          memberships: user.memberships.map(membership => ({
            id: membership.id,
            organization: {
              id: membership.organization.id,
              name: membership.organization.name,
              slug: membership.organization.slug
            },
            role: membership.role,
            joinedAt: membership.joinedAt
          })),
          tokens: {
            accessToken,
            refreshToken,
            idToken
          }
        }
      });
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'AUTH_ERROR'
      });
    }
  };

  /**
   * POST /api/v1/accounts/register
   */
  public register = async (req: Request, res: Response): Promise<void> => {
    if (this.handleValidationErrors(req, res)) return;

    try {
      const { email, password, fullName, profile } = req.body;

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

      // Parse full name
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');

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
              firstName,
              lastName: lastName || '',
              phone: profile?.phone || null,
              avatar: profile?.avatar || null
            }
          }
        },
        include: {
          profile: true,
          memberships: true
        }
      });

      // Generate tokens
      const jwt = require('jsonwebtoken');
      const config = require('../config/database').config;
      
      const accessToken = jwt.sign(
        {
          sub: user.id,
          email: user.email,
          role: user.role,
          permissions: this.getRolePermissions(user.role)
        },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      const refreshToken = jwt.sign(
        { sub: user.id, type: 'refresh' },
        config.jwt.secret,
        { expiresIn: '7d' }
      );

      const idToken = jwt.sign(
        {
          sub: user.id,
          email: user.email,
          name: fullName,
          picture: user.profile?.avatar
        },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      res.status(201).json({
        success: true,
        data: {
          account: {
            id: user.id,
            email: user.email,
            fullName: user.profile?.firstName && user.profile?.lastName 
              ? `${user.profile.firstName} ${user.profile.lastName}`
              : user.email,
            avatar: user.profile?.avatar,
            role: user.role,
            status: user.status
          },
          memberships: [],
          tokens: {
            accessToken,
            refreshToken,
            idToken
          }
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
   * GET /api/v1/accounts/profile
   */
  public getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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
          phone: user.profile?.phone,
          role: user.role,
          status: user.status,
          lastLoginAt: user.lastLoginAt,
          createdAt: user.createdAt,
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
      console.error('Get profile error:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'GET_PROFILE_ERROR'
      });
    }
  };

  /**
   * PUT /api/v1/accounts/profile
   */
  public updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (this.handleValidationErrors(req, res)) return;

    try {
      const { fullName, phone, avatar } = req.body;
      const userId = req.user!.id;

      // Parse full name if provided
      let firstName, lastName;
      if (fullName) {
        const nameParts = fullName.split(' ');
        firstName = nameParts[0];
        lastName = nameParts.slice(1).join(' ');
      }

      // Update user profile
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          profile: {
            update: {
              ...(firstName && { firstName }),
              ...(lastName !== undefined && { lastName }),
              ...(phone !== undefined && { phone }),
              ...(avatar !== undefined && { avatar })
            }
          }
        },
        include: {
          profile: true
        }
      });

      res.status(200).json({
        success: true,
        data: {
          id: updatedUser.id,
          email: updatedUser.email,
          fullName: updatedUser.profile?.firstName && updatedUser.profile?.lastName 
            ? `${updatedUser.profile.firstName} ${updatedUser.profile.lastName}`
            : updatedUser.email,
          avatar: updatedUser.profile?.avatar,
          phone: updatedUser.profile?.phone,
          role: updatedUser.role,
          status: updatedUser.status
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'UPDATE_PROFILE_ERROR'
      });
    }
  };

  /**
   * GET /api/v1/accounts/memberships
   */
  public getMemberships = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const memberships = await prisma.membership.findMany({
        where: { userId: req.user!.id },
        include: {
          organization: true
        },
        orderBy: { joinedAt: 'desc' }
      });

      res.status(200).json({
        success: true,
        data: memberships.map(membership => ({
          id: membership.id,
          organization: {
            id: membership.organization.id,
            name: membership.organization.name,
            slug: membership.organization.slug,
            logo: membership.organization.logo
          },
          role: membership.role,
          joinedAt: membership.joinedAt,
          isActive: membership.isActive
        }))
      });
    } catch (error) {
      console.error('Get memberships error:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'GET_MEMBERSHIPS_ERROR'
      });
    }
  };

  /**
   * POST /api/v1/accounts/change-password
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
   * POST /api/v1/accounts/delete
   */
  public deleteAccount = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (this.handleValidationErrors(req, res)) return;

    try {
      const { password } = req.body;
      const userId = req.user!.id;

      // Get user to verify password
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        res.status(404).json({
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        });
        return;
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({
          error: 'Invalid password',
          code: 'INVALID_PASSWORD'
        });
        return;
      }

      // Soft delete - mark as deleted
      await prisma.user.update({
        where: { id: userId },
        data: { 
          status: 'DELETED',
          email: `deleted_${Date.now()}_${user.email}` // Prevent email reuse
        }
      });

      res.status(200).json({
        success: true,
        message: 'Account deleted successfully'
      });
    } catch (error) {
      console.error('Delete account error:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'DELETE_ACCOUNT_ERROR'
      });
    }
  };

  /**
   * GET /api/v1/accounts/sessions
   */
  public getSessions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;

      const sessions = await prisma.session.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20
      });

      res.status(200).json({
        success: true,
        data: sessions.map(session => ({
          id: session.id,
          createdAt: session.createdAt,
          expiresAt: session.expiresAt,
          isActive: session.expiresAt > new Date(),
          userAgent: session.userAgent,
          ipAddress: session.ipAddress
        }))
      });
    } catch (error) {
      console.error('Get sessions error:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'GET_SESSIONS_ERROR'
      });
    }
  };

  /**
   * DELETE /api/v1/accounts/sessions/:sessionId
   */
  public revokeSession = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { sessionId } = req.params;
      const userId = req.user!.id;

      // Delete the specific session
      const deleted = await prisma.session.deleteMany({
        where: {
          id: sessionId,
          userId: userId
        }
      });

      if (deleted.count === 0) {
        res.status(404).json({
          error: 'Session not found',
          code: 'SESSION_NOT_FOUND'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Session revoked successfully'
      });
    } catch (error) {
      console.error('Revoke session error:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'REVOKE_SESSION_ERROR'
      });
    }
  };

  /**
   * DELETE /api/v1/accounts/sessions
   */
  public revokeAllSessions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;

      // Delete all sessions except current
      await prisma.session.deleteMany({
        where: {
          userId: userId,
          // Note: We would need to track current session ID to exclude it
        }
      });

      res.status(200).json({
        success: true,
        message: 'All sessions revoked successfully'
      });
    } catch (error) {
      console.error('Revoke all sessions error:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'REVOKE_ALL_SESSIONS_ERROR'
      });
    }
  };

  // Placeholder methods for 2FA features
  public enable2FA = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    res.status(501).json({
      error: 'Feature not implemented yet',
      code: 'NOT_IMPLEMENTED'
    });
  };

  public disable2FA = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    res.status(501).json({
      error: 'Feature not implemented yet',
      code: 'NOT_IMPLEMENTED'
    });
  };

  public verify2FA = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    res.status(501).json({
      error: 'Feature not implemented yet',
      code: 'NOT_IMPLEMENTED'
    });
  };

  // Admin methods
  public getAllAccounts = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 20, search, status } = req.query;
      
      const where: any = {};
      if (search) {
        where.OR = [
          { email: { contains: search as string, mode: 'insensitive' } },
          { profile: { firstName: { contains: search as string, mode: 'insensitive' } } },
          { profile: { lastName: { contains: search as string, mode: 'insensitive' } } }
        ];
      }
      if (status) {
        where.status = status;
      }

      const [accounts, total] = await Promise.all([
        prisma.user.findMany({
          where,
          include: {
            profile: true
          },
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
          orderBy: { createdAt: 'desc' }
        }),
        prisma.user.count({ where })
      ]);

      res.status(200).json({
        success: true,
        data: {
          accounts: accounts.map(account => ({
            id: account.id,
            email: account.email,
            fullName: account.profile?.firstName && account.profile?.lastName 
              ? `${account.profile.firstName} ${account.profile.lastName}`
              : account.email,
            avatar: account.profile?.avatar,
            role: account.role,
            status: account.status,
            lastLoginAt: account.lastLoginAt,
            createdAt: account.createdAt
          })),
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit))
          }
        }
      });
    } catch (error) {
      console.error('Get all accounts error:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'GET_ALL_ACCOUNTS_ERROR'
      });
    }
  };

  public getAccountById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id },
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
          phone: user.profile?.phone,
          role: user.role,
          status: user.status,
          lastLoginAt: user.lastLoginAt,
          createdAt: user.createdAt,
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
      console.error('Get account by ID error:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'GET_ACCOUNT_ERROR'
      });
    }
  };

  public updateAccountStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (this.handleValidationErrors(req, res)) return;

    try {
      const { id } = req.params;
      const { status } = req.body;

      const updatedUser = await prisma.user.update({
        where: { id },
        data: { status },
        include: {
          profile: true
        }
      });

      res.status(200).json({
        success: true,
        data: {
          id: updatedUser.id,
          email: updatedUser.email,
          fullName: updatedUser.profile?.firstName && updatedUser.profile?.lastName 
            ? `${updatedUser.profile.firstName} ${updatedUser.profile.lastName}`
            : updatedUser.email,
          status: updatedUser.status
        }
      });
    } catch (error) {
      console.error('Update account status error:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'UPDATE_STATUS_ERROR'
      });
    }
  };

  /**
   * POST /api/v1/accounts/create-user (admin only)
   */
  public createUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (this.handleValidationErrors(req, res)) return;

    try {
      const { email, password, fullName, role = 'USER', status = 'ACTIVE', profile } = req.body;

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

      // Parse full name
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');

      // Create user
      const user = await prisma.user.create({
        data: {
          id: uuidv4(),
          email,
          password: hashedPassword,
          role,
          status,
          profile: {
            create: {
              id: uuidv4(),
              firstName,
              lastName: lastName || '',
              phone: profile?.phone || null,
              avatar: profile?.avatar || null,
              bio: profile?.bio || null
            }
          }
        },
        include: {
          profile: true
        }
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          id: uuidv4(),
          userId: req.user!.id,
          action: 'USER_CREATED',
          resourceType: 'USER',
          resourceId: user.id,
          details: {
            targetUserEmail: user.email,
            targetUserRole: user.role,
            targetUserStatus: user.status
          },
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        }
      });

      res.status(201).json({
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
          createdAt: user.createdAt
        }
      });
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'CREATE_USER_ERROR'
      });
    }
  };

  /**
   * PUT /api/v1/accounts/:id (admin only)
   */
  public updateUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (this.handleValidationErrors(req, res)) return;

    try {
      const { id } = req.params;
      const { email, fullName, role, status, profile } = req.body;

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id }
      });

      if (!existingUser) {
        res.status(404).json({
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        });
        return;
      }

      // Check email uniqueness if changing email
      if (email && email !== existingUser.email) {
        const emailExists = await prisma.user.findUnique({
          where: { email }
        });

        if (emailExists) {
          res.status(409).json({
            error: 'Email already exists',
            code: 'EMAIL_EXISTS'
          });
          return;
        }
      }

      // Parse full name if provided
      let firstName, lastName;
      if (fullName) {
        const nameParts = fullName.split(' ');
        firstName = nameParts[0];
        lastName = nameParts.slice(1).join(' ');
      }

      // Update user
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          ...(email && { email }),
          ...(role && { role }),
          ...(status && { status }),
          profile: {
            update: {
              ...(firstName && { firstName }),
              ...(lastName !== undefined && { lastName }),
              ...(profile?.phone !== undefined && { phone: profile.phone }),
              ...(profile?.avatar !== undefined && { avatar: profile.avatar }),
              ...(profile?.bio !== undefined && { bio: profile.bio })
            }
          }
        },
        include: {
          profile: true
        }
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          id: uuidv4(),
          userId: req.user!.id,
          action: 'USER_UPDATED',
          resourceType: 'USER',
          resourceId: updatedUser.id,
          details: {
            changes: {
              ...(email && { email: { from: existingUser.email, to: email } }),
              ...(role && { role: { from: existingUser.role, to: role } }),
              ...(status && { status: { from: existingUser.status, to: status } })
            }
          },
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        }
      });

      res.status(200).json({
        success: true,
        data: {
          id: updatedUser.id,
          email: updatedUser.email,
          fullName: updatedUser.profile?.firstName && updatedUser.profile?.lastName 
            ? `${updatedUser.profile.firstName} ${updatedUser.profile.lastName}`
            : updatedUser.email,
          avatar: updatedUser.profile?.avatar,
          role: updatedUser.role,
          status: updatedUser.status,
          updatedAt: updatedUser.updatedAt
        }
      });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'UPDATE_USER_ERROR'
      });
    }
  };

  /**
   * DELETE /api/v1/accounts/:id (admin only)
   */
  public deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id }
      });

      if (!user) {
        res.status(404).json({
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        });
        return;
      }

      // Prevent self-deletion
      if (id === req.user!.id) {
        res.status(400).json({
          error: 'Cannot delete your own account',
          code: 'CANNOT_DELETE_SELF'
        });
        return;
      }

      // Soft delete
      await prisma.user.update({
        where: { id },
        data: { 
          status: 'DELETED',
          email: `deleted_${Date.now()}_${user.email}`
        }
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          id: uuidv4(),
          userId: req.user!.id,
          action: 'USER_DELETED',
          resourceType: 'USER',
          resourceId: user.id,
          details: {
            deletedUserEmail: user.email,
            deletedUserRole: user.role
          },
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        }
      });

      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'DELETE_USER_ERROR'
      });
    }
  };

  /**
   * GET /api/v1/accounts/:id/permissions (admin only)
   */
  public getUserPermissionsEndpoint = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          userRoles: {
            include: {
              role: {
                include: {
                  rolePermissions: {
                    include: {
                      permission: true
                    }
                  }
                }
              }
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

      // Get all permissions from roles
      const permissions = new Set<string>();
      user.userRoles.forEach(userRole => {
        if (userRole.isActive) {
          userRole.role.rolePermissions.forEach(rolePermission => {
            if (rolePermission.permission.isActive) {
              permissions.add(rolePermission.permission.name);
            }
          });
        }
      });

      // Add role-based permissions
      const rolePermissions = this.getRolePermissions(user.role);
      rolePermissions.forEach(permission => permissions.add(permission));

      res.status(200).json({
        success: true,
        data: {
          userId: user.id,
          email: user.email,
          role: user.role,
          permissions: Array.from(permissions),
          roles: user.userRoles.map(ur => ({
            id: ur.role.id,
            name: ur.role.name,
            isActive: ur.isActive,
            assignedAt: ur.assignedAt,
            expiresAt: ur.expiresAt
          }))
        }
      });
    } catch (error) {
      console.error('Get user permissions error:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'GET_PERMISSIONS_ERROR'
      });
    }
  };

  /**
   * PUT /api/v1/accounts/:id/permissions (admin only)
   */
  public updateUserPermissions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (this.handleValidationErrors(req, res)) return;

    try {
      const { id } = req.params;
      const { permissions } = req.body;

      const user = await prisma.user.findUnique({
        where: { id }
      });

      if (!user) {
        res.status(404).json({
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        });
        return;
      }

      // For now, we'll update the user's role based on permissions
      // In a more complex system, you might want to create custom roles or direct permissions
      let newRole = 'USER';
      if (permissions.includes('admin:access')) {
        newRole = 'ADMIN';
      } else if (permissions.includes('accounts:write')) {
        newRole = 'MANAGER';
      }

      await prisma.user.update({
        where: { id },
        data: { role: newRole }
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          id: uuidv4(),
          userId: req.user!.id,
          action: 'USER_PERMISSIONS_UPDATED',
          resourceType: 'USER',
          resourceId: user.id,
          details: {
            oldRole: user.role,
            newRole,
            permissions
          },
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        }
      });

      res.status(200).json({
        success: true,
        data: {
          userId: user.id,
          role: newRole,
          permissions: this.getRolePermissions(newRole)
        }
      });
    } catch (error) {
      console.error('Update user permissions error:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'UPDATE_PERMISSIONS_ERROR'
      });
    }
  };

  /**
   * GET /api/v1/accounts/:id/audit-log (admin only)
   */
  public getUserAuditLog = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { page = 1, limit = 50 } = req.query;

      const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
          where: {
            OR: [
              { userId: id },
              { resourceId: id }
            ]
          },
          orderBy: { createdAt: 'desc' },
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit)
        }),
        prisma.auditLog.count({
          where: {
            OR: [
              { userId: id },
              { resourceId: id }
            ]
          }
        })
      ]);

      res.status(200).json({
        success: true,
        data: {
          logs: logs.map(log => ({
            id: log.id,
            action: log.action,
            resourceType: log.resourceType,
            resourceId: log.resourceId,
            details: log.details,
            ipAddress: log.ipAddress,
            userAgent: log.userAgent,
            createdAt: log.createdAt
          })),
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit))
          }
        }
      });
    } catch (error) {
      console.error('Get user audit log error:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'GET_AUDIT_LOG_ERROR'
      });
    }
  };

  /**
   * POST /api/v1/accounts/bulk-operations (admin only)
   */
  public bulkOperations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (this.handleValidationErrors(req, res)) return;

    try {
      const { operation, userIds } = req.body;

      // Validate users exist
      const users = await prisma.user.findMany({
        where: { id: { in: userIds } }
      });

      if (users.length !== userIds.length) {
        res.status(400).json({
          error: 'Some users not found',
          code: 'USERS_NOT_FOUND'
        });
        return;
      }

      // Prevent self-operation
      if (userIds.includes(req.user!.id)) {
        res.status(400).json({
          error: 'Cannot perform bulk operations on your own account',
          code: 'CANNOT_OPERATE_ON_SELF'
        });
        return;
      }

      let updateData: any = {};
      let action = '';

      switch (operation) {
        case 'activate':
          updateData = { status: 'ACTIVE' };
          action = 'USERS_BULK_ACTIVATED';
          break;
        case 'deactivate':
          updateData = { status: 'INACTIVE' };
          action = 'USERS_BULK_DEACTIVATED';
          break;
        case 'suspend':
          updateData = { status: 'SUSPENDED' };
          action = 'USERS_BULK_SUSPENDED';
          break;
        case 'delete':
          updateData = { 
            status: 'DELETED',
            email: { 
              push: [`deleted_${Date.now()}_`] 
            }
          };
          action = 'USERS_BULK_DELETED';
          break;
        default:
          res.status(400).json({
            error: 'Invalid operation',
            code: 'INVALID_OPERATION'
          });
          return;
      }

      // Perform bulk update
      const result = await prisma.user.updateMany({
        where: { id: { in: userIds } },
        data: updateData
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          id: uuidv4(),
          userId: req.user!.id,
          action,
          resourceType: 'USER',
          resourceId: userIds.join(','), // Bulk operation
          details: {
            operation,
            userIds,
            affectedCount: result.count
          },
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        }
      });

      res.status(200).json({
        success: true,
        data: {
          operation,
          affectedCount: result.count,
          message: `Successfully ${operation} ${result.count} users`
        }
      });
    } catch (error) {
      console.error('Bulk operations error:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'BULK_OPERATIONS_ERROR'
      });
    }
  };

  /**
   * Get user permissions based on role
   */
  private getRolePermissions(role: string): string[] {
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


}