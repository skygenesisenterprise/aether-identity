"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAnyPermission = exports.requireAnyRole = exports.requireRole = exports.requirePermission = void 0;
const requirePermission = (permission) => {
    return (req, res, next) => {
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
exports.requirePermission = requirePermission;
const requireRole = (role) => {
    return (req, res, next) => {
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
exports.requireRole = requireRole;
const requireAnyRole = (roles) => {
    return (req, res, next) => {
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
exports.requireAnyRole = requireAnyRole;
const requireAnyPermission = (permissions) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                error: 'Authentication required',
                code: 'AUTH_REQUIRED'
            });
            return;
        }
        const hasPermission = permissions.some(permission => req.user.permissions.includes(permission));
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
exports.requireAnyPermission = requireAnyPermission;
