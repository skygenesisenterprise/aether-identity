"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiTokenController = void 0;
const express_validator_1 = require("express-validator");
const uuid_1 = require("uuid");
const crypto_1 = __importDefault(require("crypto"));
const database_1 = require("../config/database");
class ApiTokenController {
    constructor() {
        /**
         * POST /api/v1/api-tokens
         * Create a new API token
         */
        this.createToken = async (req, res) => {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    res.status(400).json({
                        error: 'Validation failed',
                        details: errors.array()
                    });
                    return;
                }
                const { name, description, permissions, expiresAt } = req.body;
                const userId = req.user?.id || req.apiToken?.userId;
                if (!userId) {
                    res.status(401).json({
                        error: 'User authentication required',
                        code: 'USER_REQUIRED'
                    });
                    return;
                }
                // Generate API token
                const token = this.generateApiToken();
                // Create API token in database
                const apiToken = await database_1.prisma.apiToken.create({
                    data: {
                        id: (0, uuid_1.v4)(),
                        token,
                        name,
                        description,
                        permissions: JSON.stringify(permissions || []),
                        expiresAt: expiresAt ? new Date(expiresAt) : null,
                        userId
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                role: true
                            }
                        }
                    }
                });
                // Return token (only show full token once)
                res.status(201).json({
                    success: true,
                    data: {
                        id: apiToken.id,
                        token: apiToken.token, // Only return full token on creation
                        name: apiToken.name,
                        description: apiToken.description,
                        permissions: JSON.parse(apiToken.permissions || '[]'),
                        keyPrefix: apiToken.keyPrefix,
                        isActive: apiToken.isActive,
                        expiresAt: apiToken.expiresAt,
                        createdAt: apiToken.createdAt,
                        user: apiToken.user
                    }
                });
            }
            catch (error) {
                console.error('Create API token error:', error);
                res.status(500).json({
                    error: 'Internal server error',
                    code: 'CREATE_TOKEN_ERROR'
                });
            }
        };
        /**
         * GET /api/v1/api-tokens
         * List all API tokens for the authenticated user
         */
        this.listTokens = async (req, res) => {
            try {
                const userId = req.user?.id || req.apiToken?.userId;
                if (!userId) {
                    res.status(401).json({
                        error: 'User authentication required',
                        code: 'USER_REQUIRED'
                    });
                    return;
                }
                const tokens = await database_1.prisma.apiToken.findMany({
                    where: { userId },
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        permissions: true,
                        keyPrefix: true,
                        isActive: true,
                        lastUsedAt: true,
                        expiresAt: true,
                        createdAt: true,
                        updatedAt: true,
                        // Don't include the full token in list view
                        token: false
                    },
                    orderBy: { createdAt: 'desc' }
                });
                // Parse permissions for each token
                const tokensWithParsedPermissions = tokens.map(token => ({
                    ...token,
                    permissions: JSON.parse(token.permissions || '[]')
                }));
                res.status(200).json({
                    success: true,
                    data: tokensWithParsedPermissions
                });
            }
            catch (error) {
                console.error('List API tokens error:', error);
                res.status(500).json({
                    error: 'Internal server error',
                    code: 'LIST_TOKENS_ERROR'
                });
            }
        };
        /**
         * GET /api/v1/api-tokens/:id
         * Get a specific API token
         */
        this.getToken = async (req, res) => {
            try {
                const { id } = req.params;
                const userId = req.user?.id || req.apiToken?.userId;
                if (!userId) {
                    res.status(401).json({
                        error: 'User authentication required',
                        code: 'USER_REQUIRED'
                    });
                    return;
                }
                const token = await database_1.prisma.apiToken.findFirst({
                    where: { id, userId },
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        permissions: true,
                        keyPrefix: true,
                        isActive: true,
                        lastUsedAt: true,
                        expiresAt: true,
                        createdAt: true,
                        updatedAt: true
                        // Don't include the full token
                    }
                });
                if (!token) {
                    res.status(404).json({
                        error: 'API token not found',
                        code: 'TOKEN_NOT_FOUND'
                    });
                    return;
                }
                // Parse permissions
                const tokenWithParsedPermissions = {
                    ...token,
                    permissions: JSON.parse(token.permissions || '[]')
                };
                res.status(200).json({
                    success: true,
                    data: tokenWithParsedPermissions
                });
            }
            catch (error) {
                console.error('Get API token error:', error);
                res.status(500).json({
                    error: 'Internal server error',
                    code: 'GET_TOKEN_ERROR'
                });
            }
        };
        /**
         * PUT /api/v1/api-tokens/:id
         * Update an API token
         */
        this.updateToken = async (req, res) => {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    res.status(400).json({
                        error: 'Validation failed',
                        details: errors.array()
                    });
                    return;
                }
                const { id } = req.params;
                const { name, description, permissions, isActive, expiresAt } = req.body;
                const userId = req.user?.id || req.apiToken?.userId;
                if (!userId) {
                    res.status(401).json({
                        error: 'User authentication required',
                        code: 'USER_REQUIRED'
                    });
                    return;
                }
                // Check if token exists and belongs to user
                const existingToken = await database_1.prisma.apiToken.findFirst({
                    where: { id, userId }
                });
                if (!existingToken) {
                    res.status(404).json({
                        error: 'API token not found',
                        code: 'TOKEN_NOT_FOUND'
                    });
                    return;
                }
                // Update token
                const updatedToken = await database_1.prisma.apiToken.update({
                    where: { id },
                    data: {
                        ...(name && { name }),
                        ...(description !== undefined && { description }),
                        ...(permissions && { permissions: JSON.stringify(permissions) }),
                        ...(isActive !== undefined && { isActive }),
                        ...(expiresAt !== undefined && { expiresAt: expiresAt ? new Date(expiresAt) : null })
                    },
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        permissions: true,
                        keyPrefix: true,
                        isActive: true,
                        lastUsedAt: true,
                        expiresAt: true,
                        createdAt: true,
                        updatedAt: true
                    }
                });
                // Parse permissions
                const tokenWithParsedPermissions = {
                    ...updatedToken,
                    permissions: JSON.parse(updatedToken.permissions || '[]')
                };
                res.status(200).json({
                    success: true,
                    data: tokenWithParsedPermissions
                });
            }
            catch (error) {
                console.error('Update API token error:', error);
                res.status(500).json({
                    error: 'Internal server error',
                    code: 'UPDATE_TOKEN_ERROR'
                });
            }
        };
        /**
         * DELETE /api/v1/api-tokens/:id
         * Delete (revoke) an API token
         */
        this.deleteToken = async (req, res) => {
            try {
                const { id } = req.params;
                const userId = req.user?.id || req.apiToken?.userId;
                if (!userId) {
                    res.status(401).json({
                        error: 'User authentication required',
                        code: 'USER_REQUIRED'
                    });
                    return;
                }
                // Check if token exists and belongs to user
                const existingToken = await database_1.prisma.apiToken.findFirst({
                    where: { id, userId }
                });
                if (!existingToken) {
                    res.status(404).json({
                        error: 'API token not found',
                        code: 'TOKEN_NOT_FOUND'
                    });
                    return;
                }
                // Delete token
                await database_1.prisma.apiToken.delete({
                    where: { id }
                });
                res.status(200).json({
                    success: true,
                    message: 'API token revoked successfully'
                });
            }
            catch (error) {
                console.error('Delete API token error:', error);
                res.status(500).json({
                    error: 'Internal server error',
                    code: 'DELETE_TOKEN_ERROR'
                });
            }
        };
        /**
         * POST /api/v1/api-tokens/:id/rotate
         * Rotate an API token (generate new token, invalidate old one)
         */
        this.rotateToken = async (req, res) => {
            try {
                const { id } = req.params;
                const userId = req.user?.id || req.apiToken?.userId;
                if (!userId) {
                    res.status(401).json({
                        error: 'User authentication required',
                        code: 'USER_REQUIRED'
                    });
                    return;
                }
                // Check if token exists and belongs to user
                const existingToken = await database_1.prisma.apiToken.findFirst({
                    where: { id, userId }
                });
                if (!existingToken) {
                    res.status(404).json({
                        error: 'API token not found',
                        code: 'TOKEN_NOT_FOUND'
                    });
                    return;
                }
                // Generate new token
                const newToken = this.generateApiToken();
                // Update token with new value
                const updatedToken = await database_1.prisma.apiToken.update({
                    where: { id },
                    data: { token: newToken },
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                role: true
                            }
                        }
                    }
                });
                res.status(200).json({
                    success: true,
                    data: {
                        id: updatedToken.id,
                        token: updatedToken.token, // Return new full token
                        name: updatedToken.name,
                        description: updatedToken.description,
                        permissions: JSON.parse(updatedToken.permissions || '[]'),
                        keyPrefix: updatedToken.keyPrefix,
                        isActive: updatedToken.isActive,
                        expiresAt: updatedToken.expiresAt,
                        updatedAt: updatedToken.updatedAt,
                        user: updatedToken.user
                    }
                });
            }
            catch (error) {
                console.error('Rotate API token error:', error);
                res.status(500).json({
                    error: 'Internal server error',
                    code: 'ROTATE_TOKEN_ERROR'
                });
            }
        };
    }
    /**
     * Generate a secure API token with sk_ prefix
     */
    generateApiToken() {
        const bytes = crypto_1.default.randomBytes(32);
        const token = bytes.toString('hex');
        return `sk_${token}`;
    }
}
exports.ApiTokenController = ApiTokenController;
