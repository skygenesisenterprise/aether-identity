"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountController = void 0;
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const database_1 = require("../config/database");
class AccountController {
    constructor() {
        /**
         * POST /api/v1/accounts/authenticate
         */
        this.authenticate = async (req, res) => {
            if (this.handleValidationErrors(req, res))
                return;
            try {
                const { identifier, password } = req.body;
                // Find user by email, username, or phone
                let user = await database_1.prisma.user.findUnique({
                    where: { email: identifier },
                    include: {
                        profile: true,
                        memberships: {
                            include: {
                                organization: true
                            }
                        }
                    }
                });
                // If not found by email, try username (if you have username field)
                if (!user) {
                    user = await database_1.prisma.user.findFirst({
                        where: {
                            OR: [
                                { profile: { phone: identifier } },
                                // Add username search when you implement it
                            ]
                        },
                        include: {
                            profile: true,
                            memberships: {
                                include: {
                                    organization: true
                                }
                            }
                        }
                    });
                }
                if (!user) {
                    res.status(401).json({
                        error: 'Invalid credentials',
                        code: 'INVALID_CREDENTIALS'
                    });
                    return;
                }
                // Check password
                const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
                if (!isPasswordValid) {
                    res.status(401).json({
                        error: 'Invalid credentials',
                        code: 'INVALID_CREDENTIALS'
                    });
                    return;
                }
                // Check if user is active
                if (user.status !== 'ACTIVE') {
                    res.status(401).json({
                        error: 'Account is not active',
                        code: 'ACCOUNT_INACTIVE'
                    });
                    return;
                }
                // Generate tokens (reuse from AuthController logic)
                const jwt = require('jsonwebtoken');
                const config = require('../config/database').config;
                const accessToken = jwt.sign({
                    sub: user.id,
                    email: user.email,
                    role: user.role,
                    permissions: this.getUserPermissions(user.role)
                }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
                const refreshToken = jwt.sign({ sub: user.id, type: 'refresh' }, config.jwt.secret, { expiresIn: '7d' });
                const idToken = jwt.sign({
                    sub: user.id,
                    email: user.email,
                    name: user.profile?.firstName && user.profile?.lastName
                        ? `${user.profile.firstName} ${user.profile.lastName}`
                        : user.email,
                    picture: user.profile?.avatar
                }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
                // Update last login
                await database_1.prisma.user.update({
                    where: { id: user.id },
                    data: { lastLoginAt: new Date() }
                });
                res.status(200).json({
                    success: true,
                    data: {
                        account: {
                            id: user.id,
                            email: user.email,
                            fullName: user.profile?.firstName && user.profile?.lastName
                                ? `${user.profile.firstName} ${user.profile.lastName}`
                                : user.email,
                            avatar: user.profile?.avatar,
                            role: user.role,
                            status: user.status,
                            lastLoginAt: user.lastLoginAt
                        },
                        memberships: user.memberships.map(membership => ({
                            id: membership.id,
                            organization: {
                                id: membership.organization.id,
                                name: membership.organization.name,
                                slug: membership.organization.slug
                            },
                            role: membership.role,
                            joinedAt: membership.joinedAt
                        })),
                        tokens: {
                            accessToken,
                            refreshToken,
                            idToken
                        }
                    }
                });
            }
            catch (error) {
                console.error('Authentication error:', error);
                res.status(500).json({
                    error: 'Internal server error',
                    code: 'AUTH_ERROR'
                });
            }
        };
        /**
         * POST /api/v1/accounts/register
         */
        this.register = async (req, res) => {
            if (this.handleValidationErrors(req, res))
                return;
            try {
                const { email, password, fullName, profile } = req.body;
                // Check if user already exists
                const existingUser = await database_1.prisma.user.findUnique({
                    where: { email }
                });
                if (existingUser) {
                    res.status(409).json({
                        error: 'User already exists',
                        code: 'USER_EXISTS'
                    });
                    return;
                }
                // Hash password
                const hashedPassword = await bcryptjs_1.default.hash(password, 12);
                // Parse full name
                const nameParts = fullName.split(' ');
                const firstName = nameParts[0];
                const lastName = nameParts.slice(1).join(' ');
                // Create user
                const user = await database_1.prisma.user.create({
                    data: {
                        id: (0, uuid_1.v4)(),
                        email,
                        password: hashedPassword,
                        role: 'USER',
                        status: 'ACTIVE',
                        profile: {
                            create: {
                                id: (0, uuid_1.v4)(),
                                firstName,
                                lastName: lastName || '',
                                phone: profile?.phone || null,
                                avatar: profile?.avatar || null
                            }
                        }
                    },
                    include: {
                        profile: true,
                        memberships: true
                    }
                });
                // Generate tokens
                const jwt = require('jsonwebtoken');
                const config = require('../config/database').config;
                const accessToken = jwt.sign({
                    sub: user.id,
                    email: user.email,
                    role: user.role,
                    permissions: this.getUserPermissions(user.role)
                }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
                const refreshToken = jwt.sign({ sub: user.id, type: 'refresh' }, config.jwt.secret, { expiresIn: '7d' });
                const idToken = jwt.sign({
                    sub: user.id,
                    email: user.email,
                    name: fullName,
                    picture: user.profile?.avatar
                }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
                res.status(201).json({
                    success: true,
                    data: {
                        account: {
                            id: user.id,
                            email: user.email,
                            fullName: user.profile?.firstName && user.profile?.lastName
                                ? `${user.profile.firstName} ${user.profile.lastName}`
                                : user.email,
                            avatar: user.profile?.avatar,
                            role: user.role,
                            status: user.status
                        },
                        memberships: [],
                        tokens: {
                            accessToken,
                            refreshToken,
                            idToken
                        }
                    }
                });
            }
            catch (error) {
                console.error('Registration error:', error);
                res.status(500).json({
                    error: 'Internal server error',
                    code: 'REGISTRATION_ERROR'
                });
            }
        };
        /**
         * GET /api/v1/accounts/profile
         */
        this.getProfile = async (req, res) => {
            try {
                const user = await database_1.prisma.user.findUnique({
                    where: { id: req.user.id },
                    include: {
                        profile: true,
                        memberships: {
                            include: {
                                organization: true
                            }
                        }
                    }
                });
                if (!user) {
                    res.status(404).json({
                        error: 'User not found',
                        code: 'USER_NOT_FOUND'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    data: {
                        id: user.id,
                        email: user.email,
                        fullName: user.profile?.firstName && user.profile?.lastName
                            ? `${user.profile.firstName} ${user.profile.lastName}`
                            : user.email,
                        avatar: user.profile?.avatar,
                        phone: user.profile?.phone,
                        role: user.role,
                        status: user.status,
                        lastLoginAt: user.lastLoginAt,
                        createdAt: user.createdAt,
                        memberships: user.memberships.map(membership => ({
                            id: membership.id,
                            organization: {
                                id: membership.organization.id,
                                name: membership.organization.name,
                                slug: membership.organization.slug
                            },
                            role: membership.role,
                            joinedAt: membership.joinedAt
                        }))
                    }
                });
            }
            catch (error) {
                console.error('Get profile error:', error);
                res.status(500).json({
                    error: 'Internal server error',
                    code: 'GET_PROFILE_ERROR'
                });
            }
        };
        /**
         * PUT /api/v1/accounts/profile
         */
        this.updateProfile = async (req, res) => {
            if (this.handleValidationErrors(req, res))
                return;
            try {
                const { fullName, phone, avatar } = req.body;
                const userId = req.user.id;
                // Parse full name if provided
                let firstName, lastName;
                if (fullName) {
                    const nameParts = fullName.split(' ');
                    firstName = nameParts[0];
                    lastName = nameParts.slice(1).join(' ');
                }
                // Update user profile
                const updatedUser = await database_1.prisma.user.update({
                    where: { id: userId },
                    data: {
                        profile: {
                            update: {
                                ...(firstName && { firstName }),
                                ...(lastName !== undefined && { lastName }),
                                ...(phone !== undefined && { phone }),
                                ...(avatar !== undefined && { avatar })
                            }
                        }
                    },
                    include: {
                        profile: true
                    }
                });
                res.status(200).json({
                    success: true,
                    data: {
                        id: updatedUser.id,
                        email: updatedUser.email,
                        fullName: updatedUser.profile?.firstName && updatedUser.profile?.lastName
                            ? `${updatedUser.profile.firstName} ${updatedUser.profile.lastName}`
                            : updatedUser.email,
                        avatar: updatedUser.profile?.avatar,
                        phone: updatedUser.profile?.phone,
                        role: updatedUser.role,
                        status: updatedUser.status
                    }
                });
            }
            catch (error) {
                console.error('Update profile error:', error);
                res.status(500).json({
                    error: 'Internal server error',
                    code: 'UPDATE_PROFILE_ERROR'
                });
            }
        };
        /**
         * GET /api/v1/accounts/memberships
         */
        this.getMemberships = async (req, res) => {
            try {
                const memberships = await database_1.prisma.membership.findMany({
                    where: { userId: req.user.id },
                    include: {
                        organization: true
                    },
                    orderBy: { joinedAt: 'desc' }
                });
                res.status(200).json({
                    success: true,
                    data: memberships.map(membership => ({
                        id: membership.id,
                        organization: {
                            id: membership.organization.id,
                            name: membership.organization.name,
                            slug: membership.organization.slug,
                            logo: membership.organization.logo
                        },
                        role: membership.role,
                        joinedAt: membership.joinedAt,
                        isActive: membership.isActive
                    }))
                });
            }
            catch (error) {
                console.error('Get memberships error:', error);
                res.status(500).json({
                    error: 'Internal server error',
                    code: 'GET_MEMBERSHIPS_ERROR'
                });
            }
        };
        /**
         * POST /api/v1/accounts/change-password
         */
        this.changePassword = async (req, res) => {
            if (this.handleValidationErrors(req, res))
                return;
            try {
                const { currentPassword, newPassword } = req.body;
                // Get user with current password
                const user = await database_1.prisma.user.findUnique({
                    where: { id: req.user.id }
                });
                if (!user) {
                    res.status(404).json({
                        error: 'User not found',
                        code: 'USER_NOT_FOUND'
                    });
                    return;
                }
                // Verify current password
                const isCurrentPasswordValid = await bcryptjs_1.default.compare(currentPassword, user.password);
                if (!isCurrentPasswordValid) {
                    res.status(401).json({
                        error: 'Current password is incorrect',
                        code: 'INVALID_CURRENT_PASSWORD'
                    });
                    return;
                }
                // Hash new password
                const hashedNewPassword = await bcryptjs_1.default.hash(newPassword, 12);
                // Update password
                await database_1.prisma.user.update({
                    where: { id: user.id },
                    data: { password: hashedNewPassword }
                });
                res.status(200).json({
                    success: true,
                    message: 'Password changed successfully'
                });
            }
            catch (error) {
                console.error('Change password error:', error);
                res.status(500).json({
                    error: 'Internal server error',
                    code: 'CHANGE_PASSWORD_ERROR'
                });
            }
        };
        // Placeholder methods for 2FA and other features
        this.enable2FA = async (req, res) => {
            res.status(501).json({
                error: 'Feature not implemented yet',
                code: 'NOT_IMPLEMENTED'
            });
        };
        this.disable2FA = async (req, res) => {
            res.status(501).json({
                error: 'Feature not implemented yet',
                code: 'NOT_IMPLEMENTED'
            });
        };
        this.verify2FA = async (req, res) => {
            res.status(501).json({
                error: 'Feature not implemented yet',
                code: 'NOT_IMPLEMENTED'
            });
        };
        this.deleteAccount = async (req, res) => {
            res.status(501).json({
                error: 'Feature not implemented yet',
                code: 'NOT_IMPLEMENTED'
            });
        };
        this.getSessions = async (req, res) => {
            res.status(501).json({
                error: 'Feature not implemented yet',
                code: 'NOT_IMPLEMENTED'
            });
        };
        this.revokeSession = async (req, res) => {
            res.status(501).json({
                error: 'Feature not implemented yet',
                code: 'NOT_IMPLEMENTED'
            });
        };
        this.revokeAllSessions = async (req, res) => {
            res.status(501).json({
                error: 'Feature not implemented yet',
                code: 'NOT_IMPLEMENTED'
            });
        };
        // Admin methods
        this.getAllAccounts = async (req, res) => {
            try {
                const { page = 1, limit = 20, search, status } = req.query;
                const where = {};
                if (search) {
                    where.OR = [
                        { email: { contains: search, mode: 'insensitive' } },
                        { profile: { firstName: { contains: search, mode: 'insensitive' } } },
                        { profile: { lastName: { contains: search, mode: 'insensitive' } } }
                    ];
                }
                if (status) {
                    where.status = status;
                }
                const [accounts, total] = await Promise.all([
                    database_1.prisma.user.findMany({
                        where,
                        include: {
                            profile: true
                        },
                        skip: (Number(page) - 1) * Number(limit),
                        take: Number(limit),
                        orderBy: { createdAt: 'desc' }
                    }),
                    database_1.prisma.user.count({ where })
                ]);
                res.status(200).json({
                    success: true,
                    data: {
                        accounts: accounts.map(account => ({
                            id: account.id,
                            email: account.email,
                            fullName: account.profile?.firstName && account.profile?.lastName
                                ? `${account.profile.firstName} ${account.profile.lastName}`
                                : account.email,
                            avatar: account.profile?.avatar,
                            role: account.role,
                            status: account.status,
                            lastLoginAt: account.lastLoginAt,
                            createdAt: account.createdAt
                        })),
                        pagination: {
                            page: Number(page),
                            limit: Number(limit),
                            total,
                            pages: Math.ceil(total / Number(limit))
                        }
                    }
                });
            }
            catch (error) {
                console.error('Get all accounts error:', error);
                res.status(500).json({
                    error: 'Internal server error',
                    code: 'GET_ALL_ACCOUNTS_ERROR'
                });
            }
        };
        this.getAccountById = async (req, res) => {
            try {
                const { id } = req.params;
                const user = await database_1.prisma.user.findUnique({
                    where: { id },
                    include: {
                        profile: true,
                        memberships: {
                            include: {
                                organization: true
                            }
                        }
                    }
                });
                if (!user) {
                    res.status(404).json({
                        error: 'User not found',
                        code: 'USER_NOT_FOUND'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    data: {
                        id: user.id,
                        email: user.email,
                        fullName: user.profile?.firstName && user.profile?.lastName
                            ? `${user.profile.firstName} ${user.profile.lastName}`
                            : user.email,
                        avatar: user.profile?.avatar,
                        phone: user.profile?.phone,
                        role: user.role,
                        status: user.status,
                        lastLoginAt: user.lastLoginAt,
                        createdAt: user.createdAt,
                        memberships: user.memberships.map(membership => ({
                            id: membership.id,
                            organization: {
                                id: membership.organization.id,
                                name: membership.organization.name,
                                slug: membership.organization.slug
                            },
                            role: membership.role,
                            joinedAt: membership.joinedAt
                        }))
                    }
                });
            }
            catch (error) {
                console.error('Get account by ID error:', error);
                res.status(500).json({
                    error: 'Internal server error',
                    code: 'GET_ACCOUNT_ERROR'
                });
            }
        };
        this.updateAccountStatus = async (req, res) => {
            if (this.handleValidationErrors(req, res))
                return;
            try {
                const { id } = req.params;
                const { status } = req.body;
                const updatedUser = await database_1.prisma.user.update({
                    where: { id },
                    data: { status },
                    include: {
                        profile: true
                    }
                });
                res.status(200).json({
                    success: true,
                    data: {
                        id: updatedUser.id,
                        email: updatedUser.email,
                        fullName: updatedUser.profile?.firstName && updatedUser.profile?.lastName
                            ? `${updatedUser.profile.firstName} ${updatedUser.profile.lastName}`
                            : updatedUser.email,
                        status: updatedUser.status
                    }
                });
            }
            catch (error) {
                console.error('Update account status error:', error);
                res.status(500).json({
                    error: 'Internal server error',
                    code: 'UPDATE_STATUS_ERROR'
                });
            }
        };
    }
    /**
     * Handle validation errors
     */
    handleValidationErrors(req, res) {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                error: 'Validation failed',
                details: errors.array().map(err => ({
                    field: err.type === 'field' ? err.path : 'unknown',
                    message: err.msg,
                    value: err.type === 'field' ? err.value : undefined
                }))
            });
            return true;
        }
        return false;
    }
    /**
     * Get user permissions based on role
     */
    getUserPermissions(role) {
        switch (role) {
            case 'ADMIN':
                return [
                    'users:read', 'users:write', 'users:delete',
                    'accounts:read', 'accounts:write', 'accounts:delete',
                    'organizations:read', 'organizations:write', 'organizations:delete',
                    'projects:read', 'projects:write', 'projects:delete',
                    'admin:access'
                ];
            case 'MANAGER':
                return [
                    'users:read',
                    'accounts:read', 'accounts:write',
                    'organizations:read',
                    'projects:read', 'projects:write'
                ];
            case 'USER':
                return [
                    'accounts:read',
                    'projects:read'
                ];
            default:
                return ['accounts:read'];
        }
    }
}
exports.AccountController = AccountController;
