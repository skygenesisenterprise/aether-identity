import { prisma } from '../config/database';
import { tokenService } from './tokenService';

export class TokenCleanupService {
  private readonly cleanupInterval = 60 * 60 * 1000; // Run every hour
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.startCleanup();
  }

  /**
   * Start automatic cleanup
   */
  private startCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    this.cleanupTimer = setInterval(async () => {
      await this.performCleanup();
    }, this.cleanupInterval);

    console.log('Token cleanup service started');
  }

  /**
   * Perform cleanup of expired tokens
   */
  private async performCleanup(): Promise<void> {
    try {
      console.log('Starting token cleanup...');
      
      const results = await Promise.allSettled([
        this.cleanupExpiredRefreshTokens(),
        this.cleanupExpiredSessions(),
        this.cleanupExpiredAuthSessions(),
        this.cleanupExpiredMfaSessions(),
        this.cleanupOldAuditLogs()
      ]);

      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`Cleanup task ${index} failed:`, result.reason);
        }
      });

      console.log('Token cleanup completed');
    } catch (error) {
      console.error('Token cleanup failed:', error);
    }
  }

  /**
   * Clean up expired refresh tokens
   */
  private async cleanupExpiredRefreshTokens(): Promise<void> {
    const result = await prisma.refreshToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { isRevoked: true, revokedAt: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } // Revoke tokens older than 7 days
        ]
      }
    });

    if (result.count > 0) {
      console.log(`Cleaned up ${result.count} expired/revoked refresh tokens`);
    }
  }

  /**
   * Clean up expired sessions
   */
  private async cleanupExpiredSessions(): Promise<void> {
    const result = await prisma.session.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { isActive: false }
        ]
      }
    });

    if (result.count > 0) {
      console.log(`Cleaned up ${result.count} expired/inactive sessions`);
    }
  }

  /**
   * Clean up expired SSO sessions
   */
  private async cleanupExpiredSsoSessions(): Promise<void> {
    const result = await prisma.ssoSession.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { isActive: false }
        ]
      }
    });

    if (result.count > 0) {
      console.log(`Cleaned up ${result.count} expired/inactive SSO sessions`);
    }
  }

  /**
   * Clean up expired auth sessions
   */
  private async cleanupExpiredAuthSessions(): Promise<void> {
    const result = await prisma.authSession.deleteMany({
      where: {
        OR: [
          { authCodeExpiresAt: { lt: new Date() } },
          { isCompleted: true, updatedAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } } // Completed sessions older than 24h
        ]
      }
    });

    if (result.count > 0) {
      console.log(`Cleaned up ${result.count} expired auth sessions`);
    }
  }

  /**
   * Clean up expired MFA sessions
   */
  private async cleanupExpiredMfaSessions(): Promise<void> {
    const result = await prisma.mfaSession.deleteMany({
      where: {
        OR: [
          { codeExpiresAt: { lt: new Date() } },
          { isVerified: true, updatedAt: { lt: new Date(Date.now() - 30 * 60 * 1000) } }, // Verified sessions older than 30min
          { attempts: { gte: 3 } } // Failed attempts
        ]
      }
    });

    if (result.count > 0) {
      console.log(`Cleaned up ${result.count} expired/failed MFA sessions`);
    }
  }

  /**
   * Clean up old audit logs (keep last 90 days)
   */
  private async cleanupOldAuditLogs(): Promise<void> {
    const cutoffDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // 90 days ago
    
    const result = await prisma.auditLog.deleteMany({
      where: {
        createdAt: { lt: cutoffDate }
      }
    });

    if (result.count > 0) {
      console.log(`Cleaned up ${result.count} old audit logs`);
    }
  }

  /**
   * Revoke all refresh tokens for a user
   */
  async revokeAllUserRefreshTokens(userId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { userId },
      data: { 
        isRevoked: true, 
        revokedAt: new Date() 
      }
    });

    console.log(`Revoked all refresh tokens for user ${userId}`);
  }

  /**
   * Revoke all user sessions
   */
  async revokeAllUserSessions(userId: string): Promise<void> {
    await Promise.all([
      prisma.session.updateMany({
        where: { userId },
        data: { isActive: false }
      }),
      prisma.ssoSession.updateMany({
        where: { userId },
        data: { isActive: false }
      }),
      prisma.authSession.updateMany({
        where: { userId },
        data: { isCompleted: true }
      })
    ]);

    console.log(`Revoked all sessions for user ${userId}`);
  }

  /**
   * Get token statistics
   */
  async getTokenStats(): Promise<any> {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalRefreshTokens,
      activeRefreshTokens,
      expiredRefreshTokens,
      revokedRefreshTokens,
      totalSessions,
      activeSessions,
      expiredSessions,
      totalSsoSessions,
      activeSsoSessions,
      recentAuthSessions
    ] = await Promise.all([
      prisma.refreshToken.count(),
      prisma.refreshToken.count({ where: { isRevoked: false, expiresAt: { gt: now } } }),
      prisma.refreshToken.count({ where: { expiresAt: { lt: now } } }),
      prisma.refreshToken.count({ where: { isRevoked: true } }),
      prisma.session.count(),
      prisma.session.count({ where: { isActive: true, expiresAt: { gt: now } } }),
      prisma.session.count({ where: { expiresAt: { lt: now } } }),
      prisma.ssoSession.count(),
      prisma.ssoSession.count({ where: { isActive: true, expiresAt: { gt: now } } }),
      prisma.authSession.count({ where: { createdAt: { gte: oneHourAgo } } })
    ]);

    return {
      refreshTokens: {
        total: totalRefreshTokens,
        active: activeRefreshTokens,
        expired: expiredRefreshTokens,
        revoked: revokedRefreshTokens
      },
      sessions: {
        total: totalSessions,
        active: activeSessions,
        expired: expiredSessions
      },
      ssoSessions: {
        total: totalSsoSessions,
        active: activeSsoSessions
      },
      recentActivity: {
        authSessionsLastHour: recentAuthSessions
      }
    };
  }

  /**
   * Manually trigger cleanup (for testing/admin)
   */
  async forceCleanup(): Promise<void> {
    await this.performCleanup();
  }

  /**
   * Cleanup on shutdown
   */
  public shutdown(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }
}

export const tokenCleanupService = new TokenCleanupService();

// Graceful shutdown
process.on('SIGTERM', () => tokenCleanupService.shutdown());
process.on('SIGINT', () => tokenCleanupService.shutdown());