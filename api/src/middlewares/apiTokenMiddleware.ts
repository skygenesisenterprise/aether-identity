import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config, prisma } from '../config/database';

// Extend Request interface to include apiToken info
declare global {
  namespace Express {
    interface Request {
      apiToken?: {
        id: string;
        name: string;
        permissions: string[];
        userId: string;
      };
    }
  }
}

/**
 * Middleware to validate API tokens (sk_ prefix)
 */
export const apiTokenMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      res.status(401).json({
        error: 'API token required',
        code: 'API_TOKEN_MISSING'
      });
      return;
    }

    // Extract token from "Bearer sk_..." or just "sk_..."
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : authHeader;

    // Validate token format
    if (!token.startsWith('sk_')) {
      res.status(401).json({
        error: 'Invalid API token format',
        code: 'INVALID_TOKEN_FORMAT'
      });
      return;
    }

    // Find token in database
    const apiToken = await prisma.apiToken.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            status: true
          }
        }
      }
    });

    if (!apiToken) {
      res.status(401).json({
        error: 'Invalid API token',
        code: 'INVALID_API_TOKEN'
      });
      return;
    }

    // Check if token is active
    if (!apiToken.isActive) {
      res.status(401).json({
        error: 'API token is inactive',
        code: 'TOKEN_INACTIVE'
      });
      return;
    }

    // Check if token is expired
    if (apiToken.expiresAt && apiToken.expiresAt < new Date()) {
      res.status(401).json({
        error: 'API token has expired',
        code: 'TOKEN_EXPIRED'
      });
      return;
    }

    // Check if user is active
    if (apiToken.user.status !== 'ACTIVE') {
      res.status(401).json({
        error: 'User account is inactive',
        code: 'USER_INACTIVE'
      });
      return;
    }

    // Parse permissions
    let permissions: string[] = [];
    try {
      permissions = JSON.parse(apiToken.permissions || '[]');
    } catch (error) {
      console.error('Error parsing API token permissions:', error);
    }

    // Update last used timestamp
    await prisma.apiToken.update({
      where: { id: apiToken.id },
      data: { lastUsedAt: new Date() }
    });

    // Attach token info to request
    req.apiToken = {
      id: apiToken.id,
      name: apiToken.name,
      permissions,
      userId: apiToken.userId
    };

    next();
  } catch (error) {
    console.error('API token validation error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'TOKEN_VALIDATION_ERROR'
    });
  }
};

/**
 * Middleware to check if API token has specific permission
 */
export const requireApiPermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.apiToken) {
      res.status(401).json({
        error: 'API token required',
        code: 'API_TOKEN_MISSING'
      });
      return;
    }

    if (!req.apiToken.permissions.includes(permission) && !req.apiToken.permissions.includes('*')) {
      res.status(403).json({
        error: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: permission
      });
      return;
    }

    next();
  };
};