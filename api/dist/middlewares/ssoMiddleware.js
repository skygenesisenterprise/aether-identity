"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireResourceOwner = exports.requireAnyPermission = exports.requirePlan = exports.requireOrganizationAccess = exports.requireRole = exports.requirePermission = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tokenService_1 = require("../services/tokenService");
const database_1 = require("../config/database");
/**
 * Authentication middleware - verifies JWT access token
 */
const authMiddleware = async (req, res, next) => {
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
        const claims = tokenService_1.tokenService.verifyAccessToken(token);
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
    }
    catch (error) {
        console.error('Authentication error:', error);
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(401).json({
                error: 'invalid_token',
                error_description: 'Access token expired'
            });
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({
                error: 'invalid_token',
                error_description: 'Invalid access token'
            });
        }
        else {
            res.status(500).json({
                error: 'server_error',
                error_description: 'Authentication failed'
            });
        }
    }
};
exports.authMiddleware = authMiddleware;
/**
 * Permission middleware - checks if user has required permission
 */
const requirePermission = (permission) => {
    return (req, res, next) => {
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
exports.requirePermission = requirePermission;
/**
 * Role middleware - checks if user has required role
 */
const requireRole = (role) => {
    return (req, res, next) => {
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
exports.requireRole = requireRole;
/**
 * Organization access middleware - checks if user can access organization
 */
const requireOrganizationAccess = (organizationIdParam = 'organizationId') => {
    return async (req, res, next) => {
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
            const membership = await database_1.prisma.membership.findFirst({
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
        }
        catch (error) {
            console.error('Organization access check error:', error);
            res.status(500).json({
                error: 'server_error',
                error_description: 'Access check failed'
            });
        }
    };
};
exports.requireOrganizationAccess = requireOrganizationAccess;
/**
 * Plan middleware - checks if user has required plan
 */
const requirePlan = (requiredPlan) => {
    const planHierarchy = {
        'Free': 0,
        'Organization': 1,
        'Enterprise': 2
    };
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                error: 'unauthorized',
                error_description: 'Authentication required'
            });
            return;
        }
        const userPlanLevel = planHierarchy[req.user.plan] || 0;
        const requiredPlanLevel = planHierarchy[requiredPlan] || 0;
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
exports.requirePlan = requirePlan;
/**
 * Multi-permission middleware - checks if user has ANY of the required permissions
 */
const requireAnyPermission = (permissions) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                error: 'unauthorized',
                error_description: 'Authentication required'
            });
            return;
        }
        const hasPermission = permissions.some(permission => req.user.permissions.includes(permission));
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
exports.requireAnyPermission = requireAnyPermission;
/**
 * Resource owner middleware - checks if user owns the resource
 */
const requireResourceOwner = (resourceIdParam, resourceType) => {
    return async (req, res, next) => {
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
                    const account = await database_1.prisma.user.findUnique({
                        where: { id: resourceId }
                    });
                    isOwner = account?.id === req.user.id;
                    break;
                case 'project':
                    // Check if user is project member
                    const projectMember = await database_1.prisma.projectMember.findFirst({
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
                    const orgMembership = await database_1.prisma.membership.findFirst({
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
        }
        catch (error) {
            console.error('Resource owner check error:', error);
            res.status(500).json({
                error: 'server_error',
                error_description: 'Access check failed'
            });
        }
    };
};
exports.requireResourceOwner = requireResourceOwner;
