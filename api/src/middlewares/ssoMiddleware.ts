import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { tokenService } from '../services/tokenService';
import { prisma } from '../config/database';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    organization_id?: string;
    tenant_id?: string;
    plan: string;
    permissions: string[];
  };
  token?: string;
}

/**
 * Authentication middleware - verifies JWT access token
 */
export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
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
    const claims = tokenService.verifyAccessToken(token);
    
    // Store user info and token in request
    req.user = {
      id: claims.sub,
      email: claims.email,
      role: claims.role,
      organization_id: claims.organization_id,
      tenant_id: claims.tenant_id,
      plan: claims.plan || 'Free',
      permissions: claims.permissions
    };
    req.token = token;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        error: 'invalid_token',
        error_description: 'Access token expired'
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        error: 'invalid_token',
        error_description: 'Invalid access token'
      });
    } else {
      res.status(500).json({
        error: 'server_error',
        error_description: 'Authentication failed'
      });
    }
  }
};

/**
 * Permission middleware - checks if user has required permission
 */
export const requirePermission = (permission: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'unauthorized',
        error_description: 'Authentication required'
      });
      return;
    }

    if (!req.user.permissions.includes(permission)) {
      res.status(403).json({
        error: 'insufficient_permissions',
        error_description: `Permission '${permission}' required`
      });
      return;
    }

    next();
  };
};

/**
 * Role middleware - checks if user has required role
 */
export const requireRole = (role: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'unauthorized',
        error_description: 'Authentication required'
      });
      return;
    }

    if (req.user.role !== role) {
      res.status(403).json({
        error: 'insufficient_role',
        error_description: `Role '${role}' required`
      });
      return;
    }

    next();
  };
};

/**
 * Organization access middleware - checks if user can access organization
 */
export const requireOrganizationAccess = (organizationIdParam: string = 'organizationId') => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'unauthorized',
          error_description: 'Authentication required'
        });
        return;
      }

      const organizationId = req.params[organizationIdParam];
      
      if (!organizationId) {
        res.status(400).json({
          error: 'invalid_request',
          error_description: 'Organization ID is required'
        });
        return;
      }

      // Check if user is admin (can access all organizations)
      if (req.user.role === 'ADMIN') {
        next();
        return;
      }

      // Check organization membership
      const membership = await prisma.membership.findFirst({
        where: {
          userId: req.user.id,
          organizationId: organizationId,
          isActive: true
        }
      });

      if (!membership) {
        res.status(403).json({
          error: 'access_denied',
          error_description: 'Organization access denied'
        });
        return;
      }

      next();
    } catch (error) {
      console.error('Organization access check error:', error);
      res.status(500).json({
        error: 'server_error',
        error_description: 'Access check failed'
      });
    }
  };
};

/**
 * Plan middleware - checks if user has required plan
 */
export const requirePlan = (requiredPlan: string) => {
  const planHierarchy = {
    'Free': 0,
    'Organization': 1,
    'Enterprise': 2
  };

  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'unauthorized',
        error_description: 'Authentication required'
      });
      return;
    }

    const userPlanLevel = planHierarchy[req.user.plan as keyof typeof planHierarchy] || 0;
    const requiredPlanLevel = planHierarchy[requiredPlan as keyof typeof planHierarchy] || 0;

    if (userPlanLevel < requiredPlanLevel) {
      res.status(403).json({
        error: 'upgrade_required',
        error_description: `${requiredPlan} plan required`
      });
      return;
    }

    next();
  };
};

/**
 * Multi-permission middleware - checks if user has ANY of the required permissions
 */
export const requireAnyPermission = (permissions: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'unauthorized',
        error_description: 'Authentication required'
      });
      return;
    }

    const hasPermission = permissions.some(permission => 
      req.user!.permissions.includes(permission)
    );

    if (!hasPermission) {
      res.status(403).json({
        error: 'insufficient_permissions',
        error_description: `One of the following permissions required: ${permissions.join(', ')}`
      });
      return;
    }

    next();
  };
};

/**
 * Resource owner middleware - checks if user owns the resource
 */
export const requireResourceOwner = (resourceIdParam: string, resourceType: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'unauthorized',
          error_description: 'Authentication required'
        });
        return;
      }

      const resourceId = req.params[resourceIdParam];
      
      if (!resourceId) {
        res.status(400).json({
          error: 'invalid_request',
          error_description: 'Resource ID is required'
        });
        return;
      }

      // Admin can access all resources
      if (req.user.role === 'ADMIN') {
        next();
        return;
      }

      let isOwner = false;

      switch (resourceType) {
        case 'account':
          // Check if user owns the account
          const account = await prisma.user.findUnique({
            where: { id: resourceId }
          });
          isOwner = account?.id === req.user.id;
          break;

        case 'project':
          // Check if user is project member
          const projectMember = await prisma.projectMember.findFirst({
            where: {
              projectId: resourceId,
              userId: req.user.id,
              isActive: true
            }
          });
          isOwner = !!projectMember;
          break;

        case 'organization':
          // Check if user is organization member
          const orgMembership = await prisma.membership.findFirst({
            where: {
              organizationId: resourceId,
              userId: req.user.id,
              isActive: true
            }
          });
          isOwner = !!orgMembership;
          break;

        default:
          res.status(400).json({
            error: 'invalid_request',
            error_description: 'Invalid resource type'
          });
          return;
      }

      if (!isOwner) {
        res.status(403).json({
          error: 'access_denied',
          error_description: 'Resource access denied'
        });
        return;
      }

      next();
    } catch (error) {
      console.error('Resource owner check error:', error);
      res.status(500).json({
        error: 'server_error',
        error_description: 'Access check failed'
      });
    }
  };
};