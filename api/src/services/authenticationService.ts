import { PrismaClient, User, AuthSession } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { tokenService } from './tokenService';
import { mfaService } from './mfaService';
import { totpService } from './totpService';

// Extend PrismaClient to include missing models
interface ExtendedPrismaClient extends PrismaClient {
  ssoSession: any;
  refreshToken: any;
  auditLog: any;
  role: any;
  permission: any;
  userRole: any;
  rolePermission: any;
  mfaSession: any;
}

// Define types
type SsoSession = any;
type RefreshToken = any;
type AuditLog = any;
type Role = any;
type Permission = any;
type UserRole = any;
type RolePermission = any;
type MfaSession = any;

// Extended User type with additional fields
type ExtendedUser = User & {
  failedLoginAttempts: number;
  lockedUntil?: Date;
  passwordChangedAt: Date;
  lastPasswordChange?: Date;
  mfaEnabled: boolean;
  mfaMethod?: string;
  mfaSecret?: string;
  phoneNumber?: string;
  backupCodes?: string;
  mfaCreatedAt?: Date;
  lastMfaUsed?: Date;
  userRoles?: UserRole[];
  memberships?: any[];
};

export interface LoginCredentials {
  email: string;
  password: string;
  mfaCode?: string;
  sessionId?: string;
  clientInfo?: {
    clientId: string;
    clientIp: string;
    userAgent: string;
  };
}

export interface AuthResult {
  success: boolean;
  user?: ExtendedUser;
  tokens?: {
    accessToken: string;
    refreshToken: string;
    idToken: string;
    expiresIn: number;
  };
  requiresMFA?: boolean;
  mfaSessionId?: string;
  error?: string;
  errorType?: 'INVALID_CREDENTIALS' | 'ACCOUNT_LOCKED' | 'ACCOUNT_DISABLED' | 'MFA_REQUIRED' | 'MFA_INVALID' | 'SESSION_EXPIRED';
}

export interface SessionValidationResult {
  valid: boolean;
  user?: ExtendedUser;
  session?: SsoSession;
  error?: string;
}

export class AuthenticationService {
  private prisma: ExtendedPrismaClient;
  private readonly maxFailedAttempts = 5;
  private readonly lockoutDuration = 15 * 60 * 1000; // 15 minutes
  private readonly sessionExpiry = 30 * 24 * 60 * 60 * 1000; // 30 days

  constructor(prisma: PrismaClient) {
    this.prisma = prisma as ExtendedPrismaClient;
  }

  /**
   * Authenticate user with credentials and optional MFA
   */
  async authenticate(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      // Step 1: Find user
      const user = await this.findUserByEmail(credentials.email);
      if (!user) {
        await this.logAuthEvent(credentials.clientInfo, 'LOGIN_FAILED', 'INVALID_CREDENTIALS', 'User not found');
        return { success: false, error: 'Invalid credentials', errorType: 'INVALID_CREDENTIALS' };
      }

      // Step 2: Check account status
      if (user.status !== 'ACTIVE') {
        await this.logAuthEvent(credentials.clientInfo, 'LOGIN_FAILED', 'ACCOUNT_DISABLED', `Account status: ${user.status}`);
        return { success: false, error: 'Account is not active', errorType: 'ACCOUNT_DISABLED' };
      }

      // Step 3: Check account lockout
      if (user.lockedUntil && user.lockedUntil > new Date()) {
        await this.logAuthEvent(credentials.clientInfo, 'LOGIN_FAILED', 'ACCOUNT_LOCKED', 'Account is locked');
        return { success: false, error: 'Account is temporarily locked', errorType: 'ACCOUNT_LOCKED' };
      }

      // Step 4: Verify password
      const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
      if (!isPasswordValid) {
        await this.handleFailedLogin(user, credentials.clientInfo);
        return { success: false, error: 'Invalid credentials', errorType: 'INVALID_CREDENTIALS' };
      }

      // Step 5: Check MFA requirement
      if (user.mfaEnabled) {
        if (!credentials.mfaCode) {
          // MFA is enabled but no code provided
          const mfaSessionId = await this.createMfaSession(user, credentials.clientInfo);
          return { 
            success: false, 
            requiresMFA: true, 
            mfaSessionId,
            error: 'MFA verification required',
            errorType: 'MFA_REQUIRED'
          };
        }

        // Verify MFA code
        const mfaValid = await this.verifyMFA(user, credentials.mfaCode, credentials.sessionId);
        if (!mfaValid) {
          await this.logAuthEvent(credentials.clientInfo, 'LOGIN_FAILED', 'MFA_INVALID', 'Invalid MFA code');
          return { 
            success: false, 
            error: 'Invalid MFA code',
            errorType: 'MFA_INVALID'
          };
        }
      }

      // Step 6: Successful authentication
      await this.handleSuccessfulLogin(user, credentials.clientInfo);
      
      // Step 7: Generate tokens
      const tokens = await this.generateTokens(user, credentials.clientInfo?.clientId);

      return {
        success: true,
        user: this.sanitizeUser(user),
        tokens
      };

    } catch (error) {
      console.error('Authentication error:', error);
      await this.logAuthEvent(credentials.clientInfo, 'LOGIN_FAILED', 'SYSTEM_ERROR', error.message);
      return { 
        success: false, 
        error: 'Authentication service error',
        errorType: 'INVALID_CREDENTIALS'
      };
    }
  }

  /**
   * Validate SSO session
   */
  async validateSsoSession(sessionId: string): Promise<SessionValidationResult> {
    try {
      const session = await this.prisma.ssoSession.findUnique({
        where: { sessionId },
        include: { user: true }
      });

      if (!session || !session.isActive || session.expiresAt < new Date()) {
        return { valid: false, error: 'Invalid or expired session' };
      }

      if (!session.user || session.user.status !== 'ACTIVE') {
        return { valid: false, error: 'User not found or inactive' };
      }

      // Update last access time
      await this.prisma.ssoSession.update({
        where: { id: session.id },
        data: { lastAccessAt: new Date() }
      });

      return { 
        valid: true, 
        user: this.sanitizeUser(session.user),
        session
      };

    } catch (error) {
      console.error('Session validation error:', error);
      return { valid: false, error: 'Session validation failed' };
    }
  }

  /**
   * Create SSO session
   */
  async createSsoSession(userId: string, clientInfo: any): Promise<SsoSession> {
    const sessionId = uuidv4();
    const expiresAt = new Date(Date.now() + this.sessionExpiry);

    return await this.prisma.ssoSession.create({
      data: {
        id: uuidv4(),
        sessionId,
        userId,
        clientIp: clientInfo.clientIp,
        userAgent: clientInfo.userAgent,
        isActive: true,
        expiresAt,
        lastAccessAt: new Date()
      }
    });
  }

  /**
   * Invalidate SSO session
   */
  async invalidateSsoSession(sessionId: string): Promise<void> {
    await this.prisma.ssoSession.updateMany({
      where: { sessionId },
      data: { isActive: false }
    });
  }

  /**
   * Invalidate all user sessions
   */
  async invalidateAllUserSessions(userId: string): Promise<void> {
    await this.prisma.ssoSession.updateMany({
      where: { userId },
      data: { isActive: false }
    });
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string, clientInfo?: any): Promise<AuthResult> {
    try {
      // Verify refresh token
      const tokenData = tokenService.verifyRefreshToken(refreshToken);
      
      // Check if token is revoked
      const storedToken = await this.prisma.refreshToken.findUnique({
        where: { 
          token: refreshToken,
          isRevoked: false,
          userId: tokenData.sub
        },
        include: { user: true }
      });

      if (!storedToken || storedToken.expiresAt < new Date() || storedToken.isRevoked) {
        return { success: false, error: 'Invalid or expired refresh token' };
      }

      if (!storedToken.user || storedToken.user.status !== 'ACTIVE') {
        return { success: false, error: 'User not found or inactive' };
      }

      // Revoke old refresh token
      await this.prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { isRevoked: true, revokedAt: new Date() }
      });

      // Generate new tokens
      const tokens = await this.generateTokens(storedToken.user, clientInfo?.clientId);

      await this.logAuthEvent(clientInfo, 'TOKEN_REFRESH', 'SUCCESS', 'Token refreshed successfully');

      return {
        success: true,
        user: this.sanitizeUser(storedToken.user),
        tokens
      };

    } catch (error) {
      console.error('Token refresh error:', error);
      return { success: false, error: 'Token refresh failed' };
    }
  }

  /**
   * Revoke refresh token
   */
  async revokeRefreshToken(refreshToken: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { isRevoked: true, revokedAt: new Date() }
    });
  }

  /**
   * Get user permissions and roles
   */
  async getUserPermissions(userId: string): Promise<{
    roles: string[];
    permissions: string[];
    organizationId?: string;
  }> {
    const user = await (this.prisma.user.findUnique as any)({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: { permission: true }
                }
              }
            }
          }
        },
        memberships: {
          include: { organization: true }
        }
      }
    });

    if (!user) {
      return { roles: [], permissions: [] };
    }

    const roles = user.userRoles.map(ur => ur.role.name);
    const permissions = user.userRoles.flatMap(ur => 
      ur.role.rolePermissions.map(rp => rp.permission.name)
    );
    const organizationId = user.memberships[0]?.organizationId;

    return { roles, permissions, organizationId };
  }

  /**
   * Private helper methods
   */
  private async findUserByEmail(email: string): Promise<ExtendedUser | null> {
    const user = await (this.prisma.user.findUnique as any)({
      where: { email: email.toLowerCase() },
      include: {
        profile: true,
        memberships: { include: { organization: true } },
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: { permission: true }
                }
              }
            }
          }
        }
      }
    });
    return user;
  }

  private async handleFailedLogin(user: ExtendedUser, clientInfo: any): Promise<void> {
    const newFailedAttempts = user.failedLoginAttempts + 1;
    const shouldLock = newFailedAttempts >= this.maxFailedAttempts;

    const updateData: any = {
      failedLoginAttempts: newFailedAttempts,
      lastFailedLoginAt: new Date()
    };

    if (shouldLock) {
      updateData.lockedUntil = new Date(Date.now() + this.lockoutDuration);
    }

    await (this.prisma.user.update as any)({
      where: { id: user.id },
      data: updateData
    });

    await this.logAuthEvent(clientInfo, 'LOGIN_FAILED', 'INVALID_CREDENTIALS', 
      `Failed attempts: ${newFailedAttempts}, Locked: ${shouldLock}`);
  }

  private async handleSuccessfulLogin(user: ExtendedUser, clientInfo: any): Promise<void> {
    await (this.prisma.user.update as any)({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
        lastPasswordChange: user.lastPasswordChange || new Date()
      }
    });

    await this.logAuthEvent(clientInfo, 'LOGIN_SUCCESS', 'SUCCESS', 'User logged in successfully');
  }

  private async createMfaSession(user: ExtendedUser, clientInfo: any): Promise<string> {
    const mfaSession = await (this.prisma.mfaSession.create as any)({
      data: {
        id: uuidv4(),
        userId: user.id,
        sessionId: uuidv4(),
        method: user.mfaMethod!,
        attempts: 0,
        maxAttempts: 3,
        ipAddress: clientInfo?.clientIp,
        userAgent: clientInfo?.userAgent,
        codeExpiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
      }
    });

    return mfaSession.sessionId;
  }

  private async verifyMFA(user: any, code: string, sessionId?: string): Promise<boolean> {
    if (user.mfaMethod === 'TOTP') {
      const result = await totpService.verifyTOTPToken(user.id, code);
      return result.success && result.valid;
    } else if (user.mfaMethod === 'SMS' || user.mfaMethod === 'EMAIL') {
      const result = await mfaService.verifyMFA({
        userId: user.id,
        sessionId: sessionId!,
        code,
        method: user.mfaMethod!
      });
      return result.success;
    } else if (user.mfaMethod === 'BACKUP_CODES') {
      return await totpService.verifyBackupCode(user.id, code);
    }

    return false;
  }

  private async generateTokens(user: any, clientId?: string): Promise<any> {
    const { roles, permissions, organizationId } = await this.getUserPermissions(user.id);

    const accessToken = tokenService.generateAccessToken(user, {
      role: roles[0] || user.role, // Use first role or fallback to user.role
      permissions,
      organization_id: organizationId,
      tenant_id: organizationId
    });

    const refreshToken = tokenService.generateRefreshToken(user);
    const idToken = tokenService.generateIdToken(user, clientId || 'default');

    // Store refresh token
    await (this.prisma.refreshToken.create as any)({
      data: {
        id: uuidv4(),
        userId: user.id,
        token: refreshToken,
        jti: crypto.randomUUID(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }
    });

    return {
      accessToken,
      refreshToken,
      idToken,
      expiresIn: 900 // 15 minutes
    };
  }

  private sanitizeUser(user: ExtendedUser): any {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  private async logAuthEvent(clientInfo: any, action: string, status: string, details?: string): Promise<void> {
    if (!clientInfo) return;

    try {
      await (this.prisma.auditLog.create as any)({
        data: {
          id: uuidv4(),
          userId: clientInfo.userId,
          action,
          resource: 'authentication',
          details: details || status,
          ipAddress: clientInfo.clientIp,
          userAgent: clientInfo.userAgent,
          success: status === 'SUCCESS',
          errorMessage: status !== 'SUCCESS' ? details : undefined
        }
      });
    } catch (error) {
      console.error('Failed to log auth event:', error);
    }
  }
}