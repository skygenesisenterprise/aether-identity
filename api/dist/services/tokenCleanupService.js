"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenCleanupService = exports.TokenCleanupService = void 0;
const database_1 = require("../config/database");
class TokenCleanupService {
    constructor() {
        this.cleanupInterval = 60 * 60 * 1000; // Run every hour
        this.cleanupTimer = null;
        this.startCleanup();
    }
    /**
     * Start automatic cleanup
     */
    startCleanup() {
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
    async performCleanup() {
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
        }
        catch (error) {
            console.error('Token cleanup failed:', error);
        }
    }
    /**
     * Clean up expired refresh tokens
     */
    async cleanupExpiredRefreshTokens() {
        const result = await database_1.prisma.refreshToken.deleteMany({
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
    async cleanupExpiredSessions() {
        const result = await database_1.prisma.session.deleteMany({
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
    async cleanupExpiredSsoSessions() {
        const result = await database_1.prisma.ssoSession.deleteMany({
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
    async cleanupExpiredAuthSessions() {
        const result = await database_1.prisma.authSession.deleteMany({
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
    async cleanupExpiredMfaSessions() {
        const result = await database_1.prisma.mfaSession.deleteMany({
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
    async cleanupOldAuditLogs() {
        const cutoffDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // 90 days ago
        const result = await database_1.prisma.auditLog.deleteMany({
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
    async revokeAllUserRefreshTokens(userId) {
        await database_1.prisma.refreshToken.updateMany({
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
    async revokeAllUserSessions(userId) {
        await Promise.all([
            database_1.prisma.session.updateMany({
                where: { userId },
                data: { isActive: false }
            }),
            database_1.prisma.ssoSession.updateMany({
                where: { userId },
                data: { isActive: false }
            }),
            database_1.prisma.authSession.updateMany({
                where: { userId },
                data: { isCompleted: true }
            })
        ]);
        console.log(`Revoked all sessions for user ${userId}`);
    }
    /**
     * Get token statistics
     */
    async getTokenStats() {
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const [totalRefreshTokens, activeRefreshTokens, expiredRefreshTokens, revokedRefreshTokens, totalSessions, activeSessions, expiredSessions, totalSsoSessions, activeSsoSessions, recentAuthSessions] = await Promise.all([
            database_1.prisma.refreshToken.count(),
            database_1.prisma.refreshToken.count({ where: { isRevoked: false, expiresAt: { gt: now } } }),
            database_1.prisma.refreshToken.count({ where: { expiresAt: { lt: now } } }),
            database_1.prisma.refreshToken.count({ where: { isRevoked: true } }),
            database_1.prisma.session.count(),
            database_1.prisma.session.count({ where: { isActive: true, expiresAt: { gt: now } } }),
            database_1.prisma.session.count({ where: { expiresAt: { lt: now } } }),
            database_1.prisma.ssoSession.count(),
            database_1.prisma.ssoSession.count({ where: { isActive: true, expiresAt: { gt: now } } }),
            database_1.prisma.authSession.count({ where: { createdAt: { gte: oneHourAgo } } })
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
    async forceCleanup() {
        await this.performCleanup();
    }
    /**
     * Cleanup on shutdown
     */
    shutdown() {
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer);
            this.cleanupTimer = null;
        }
    }
}
exports.TokenCleanupService = TokenCleanupService;
exports.tokenCleanupService = new TokenCleanupService();
// Graceful shutdown
process.on('SIGTERM', () => exports.tokenCleanupService.shutdown());
process.on('SIGINT', () => exports.tokenCleanupService.shutdown());
