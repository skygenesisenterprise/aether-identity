"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mfaRateLimit = exports.optionalMFA = exports.requireMFASetup = exports.checkMFASetup = exports.requireMFA = void 0;
const mfaService_1 = require("../services/mfaService");
/**
 * Middleware to require MFA verification for sensitive operations
 */
const requireMFA = (options = {}) => {
    const { allowBackupCodes = true, checkRecentMFA = false, mfaGracePeriod = 15 } = options;
    return async (req, res, next) => {
        try {
            // First check if user is authenticated
            if (!req.user) {
                res.status(401).json({
                    error: 'unauthorized',
                    error_description: 'Authentication required'
                });
                return;
            }
            // Check if user has MFA enabled
            const mfaStatus = await mfaService_1.mfaService.getMFAStatus(req.user.id);
            if (!mfaStatus.enabled) {
                // User doesn't have MFA enabled, allow access
                req.user.mfaVerified = true;
                return next();
            }
            // Check if MFA was recently verified (grace period)
            if (checkRecentMFA && mfaStatus.lastMfaUsed) {
                const timeSinceLastMFA = Date.now() - mfaStatus.lastMfaUsed.getTime();
                const gracePeriodMs = mfaGracePeriod * 60 * 1000;
                if (timeSinceLastMFA < gracePeriodMs) {
                    req.user.mfaVerified = true;
                    return next();
                }
            }
            // Check for MFA verification in current session
            const mfaSessionHeader = req.headers['x-mfa-session'];
            const mfaCodeHeader = req.headers['x-mfa-code'];
            if (mfaSessionHeader && mfaCodeHeader) {
                const mfaResult = await mfaService_1.mfaService.verifyMFA({
                    userId: req.user.id,
                    sessionId: mfaSessionHeader,
                    code: mfaCodeHeader,
                    method: allowBackupCodes ? undefined : 'TOTP' // Restrict to TOTP if backup codes not allowed
                });
                if (mfaResult.success) {
                    req.user.mfaVerified = true;
                    return next();
                }
                else {
                    res.status(401).json({
                        error: 'mfa_required',
                        error_description: 'Valid MFA verification required',
                        remaining_attempts: mfaResult.remainingAttempts
                    });
                    return;
                }
            }
            // No MFA verification found
            res.status(403).json({
                error: 'mfa_required',
                error_description: 'Multi-factor authentication required',
                mfa_methods: mfaStatus.method ? [mfaStatus.method] : ['TOTP', 'SMS', 'EMAIL'],
                requires_setup: !mfaStatus.enabled
            });
            return;
        }
        catch (error) {
            console.error('MFA middleware error:', error);
            res.status(500).json({
                error: 'server_error',
                error_description: 'MFA verification failed'
            });
        }
    };
};
exports.requireMFA = requireMFA;
/**
 * Middleware to check if MFA is set up for user
 */
const checkMFASetup = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({
                error: 'unauthorized',
                error_description: 'Authentication required'
            });
            return;
        }
        const mfaStatus = await mfaService_1.mfaService.getMFAStatus(req.user.id);
        // Add MFA status to request for downstream handlers
        req.mfaStatus = mfaStatus;
        next();
    }
    catch (error) {
        console.error('MFA setup check error:', error);
        res.status(500).json({
            error: 'server_error',
            error_description: 'Failed to check MFA status'
        });
    }
};
exports.checkMFASetup = checkMFASetup;
/**
 * Middleware to require MFA setup for sensitive features
 */
const requireMFASetup = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({
                error: 'unauthorized',
                error_description: 'Authentication required'
            });
            return;
        }
        const mfaStatus = await mfaService_1.mfaService.getMFAStatus(req.user.id);
        if (!mfaStatus.enabled) {
            res.status(403).json({
                error: 'mfa_setup_required',
                error_description: 'Multi-factor authentication must be set up for this operation',
                setup_endpoint: '/api/v1/mfa/setup'
            });
            return;
        }
        next();
    }
    catch (error) {
        console.error('MFA setup requirement error:', error);
        res.status(500).json({
            error: 'server_error',
            error_description: 'Failed to verify MFA setup'
        });
    }
};
exports.requireMFASetup = requireMFASetup;
/**
 * Middleware for optional MFA (enhances security but doesn't block)
 */
const optionalMFA = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(); // Skip MFA check if not authenticated
        }
        const mfaStatus = await mfaService_1.mfaService.getMFAStatus(req.user.id);
        if (!mfaStatus.enabled) {
            req.user.mfaVerified = false;
            return next();
        }
        // Check for MFA verification in headers
        const mfaSessionHeader = req.headers['x-mfa-session'];
        const mfaCodeHeader = req.headers['x-mfa-code'];
        if (mfaSessionHeader && mfaCodeHeader) {
            const mfaResult = await mfaService_1.mfaService.verifyMFA({
                userId: req.user.id,
                sessionId: mfaSessionHeader,
                code: mfaCodeHeader
            });
            req.user.mfaVerified = mfaResult.success;
        }
        else {
            req.user.mfaVerified = false;
        }
        next();
    }
    catch (error) {
        console.error('Optional MFA middleware error:', error);
        // Don't block the request, just log the error
        req.user.mfaVerified = false;
        next();
    }
};
exports.optionalMFA = optionalMFA;
/**
 * Rate limiting middleware specifically for MFA attempts
 */
const mfaRateLimit = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
    const attempts = new Map();
    return (req, res, next) => {
        const key = req.ip + ':' + (req.body?.userId || req.user?.id || 'anonymous');
        const now = Date.now();
        const userAttempts = attempts.get(key);
        if (!userAttempts || now > userAttempts.resetTime) {
            attempts.set(key, { count: 1, resetTime: now + windowMs });
            return next();
        }
        if (userAttempts.count >= maxAttempts) {
            res.status(429).json({
                error: 'too_many_mfa_attempts',
                error_description: 'Too many MFA attempts. Please try again later.',
                retry_after: Math.ceil((userAttempts.resetTime - now) / 1000)
            });
            return;
        }
        userAttempts.count++;
        next();
    };
};
exports.mfaRateLimit = mfaRateLimit;
