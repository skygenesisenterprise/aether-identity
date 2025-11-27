import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authMiddlewares';

export const requirePermission = (permission: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
      return;
    }

    if (!req.user.permissions.includes(permission)) {
      res.status(403).json({
        error: 'Insufficient permissions',
        code: 'PERMISSION_DENIED',
        required: permission,
        userPermissions: req.user.permissions
      });
      return;
    }

    next();
  };
};

export const requireRole = (role: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
      return;
    }

    if (req.user.role !== role) {
      res.status(403).json({
        error: 'Insufficient role',
        code: 'ROLE_DENIED',
        required: role,
        userRole: req.user.role
      });
      return;
    }

    next();
  };
};

export const requireAnyRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Insufficient role',
        code: 'ROLE_DENIED',
        required: roles,
        userRole: req.user.role
      });
      return;
    }

    next();
  };
};

export const requireAnyPermission = (permissions: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
      return;
    }

    const hasPermission = permissions.some(permission => 
      req.user!.permissions.includes(permission)
    );

    if (!hasPermission) {
      res.status(403).json({
        error: 'Insufficient permissions',
        code: 'PERMISSION_DENIED',
        required: permissions,
        userPermissions: req.user.permissions
      });
      return;
    }

    next();
  };
};