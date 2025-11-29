import { Request, Response, NextFunction } from 'express';
import { mfaService } from '../services/mfaService';
import { AuthenticatedRequest } from './authMiddlewares';

export interface MFAAuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    organization_id?: string;
    tenant_id?: string;
    plan: string;
    permissions: string[];
    mfaVerified?: boolean;
  };
  token?: string;
}

/**
 * Middleware to require MFA verification for sensitive operations
 */
export const requireMFA = (options: {
  allowBackupCodes?: boolean;
  checkRecentMFA?: boolean; // Check if MFA was used recently (e.g., last 15 minutes)
  mfaGracePeriod?: number; // Grace period in minutes
} = {}) => {
  const {
    allowBackupCodes = true,
    checkRecentMFA = false,
    mfaGracePeriod = 15
  } = options;

  return async (req: MFAAuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
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
      const mfaStatus = await mfaService.getMFAStatus(req.user.id);
      
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
        const mfaResult = await mfaService.verifyMFA({
          userId: req.user.id,
          sessionId: mfaSessionHeader as string,
          code: mfaCodeHeader as string,
          method: allowBackupCodes ? undefined : 'TOTP' // Restrict to TOTP if backup codes not allowed
        });

        if (mfaResult.success) {
          req.user.mfaVerified = true;
          return next();
        } else {
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

    } catch (error) {
      console.error('MFA middleware error:', error);
      res.status(500).json({
        error: 'server_error',
        error_description: 'MFA verification failed'
      });
    }
  };
};

/**
 * Middleware to check if MFA is set up for user
 */
export const checkMFASetup = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'unauthorized',
        error_description: 'Authentication required'
      });
      return;
    }

    const mfaStatus = await mfaService.getMFAStatus(req.user.id);
    
    // Add MFA status to request for downstream handlers
    (req as any).mfaStatus = mfaStatus;
    
    next();
  } catch (error) {
    console.error('MFA setup check error:', error);
    res.status(500).json({
      error: 'server_error',
      error_description: 'Failed to check MFA status'
    });
  }
};

/**
 * Middleware to require MFA setup for sensitive features
 */
export const requireMFASetup = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'unauthorized',
        error_description: 'Authentication required'
      });
      return;
    }

    const mfaStatus = await mfaService.getMFAStatus(req.user.id);
    
    if (!mfaStatus.enabled) {
      res.status(403).json({
        error: 'mfa_setup_required',
        error_description: 'Multi-factor authentication must be set up for this operation',
        setup_endpoint: '/api/v1/mfa/setup'
      });
      return;
    }

    next();
  } catch (error) {
    console.error('MFA setup requirement error:', error);
    res.status(500).json({
      error: 'server_error',
      error_description: 'Failed to verify MFA setup'
    });
  }
};

/**
 * Middleware for optional MFA (enhances security but doesn't block)
 */
export const optionalMFA = async (req: MFAAuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      return next(); // Skip MFA check if not authenticated
    }

    const mfaStatus = await mfaService.getMFAStatus(req.user.id);
    
    if (!mfaStatus.enabled) {
      req.user.mfaVerified = false;
      return next();
    }

    // Check for MFA verification in headers
    const mfaSessionHeader = req.headers['x-mfa-session'];
    const mfaCodeHeader = req.headers['x-mfa-code'];
    
    if (mfaSessionHeader && mfaCodeHeader) {
      const mfaResult = await mfaService.verifyMFA({
        userId: req.user.id,
        sessionId: mfaSessionHeader as string,
        code: mfaCodeHeader as string
      });

      req.user.mfaVerified = mfaResult.success;
    } else {
      req.user.mfaVerified = false;
    }

    next();
  } catch (error) {
    console.error('Optional MFA middleware error:', error);
    // Don't block the request, just log the error
    req.user!.mfaVerified = false;
    next();
  }
};

/**
 * Rate limiting middleware specifically for MFA attempts
 */
export const mfaRateLimit = (maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) => {
  const attempts = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = req.ip + ':' + (req.body?.userId || (req as any).user?.id || 'anonymous');
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