"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const apiTokenControllers_1 = require("../controllers/apiTokenControllers");
const authMiddlewares_1 = require("../middlewares/authMiddlewares");
const apiTokenMiddleware_1 = require("../middlewares/apiTokenMiddleware");
const apiTokenMiddleware_2 = require("../middlewares/apiTokenMiddleware");
const router = (0, express_1.Router)();
const apiTokenController = new apiTokenControllers_1.ApiTokenController();
/**
 * @route   POST /api/v1/api-tokens
 * @desc    Create a new API token
 * @access  Private (JWT or API Token)
 */
router.post('/', [
    authMiddlewares_1.authMiddleware, // Can also accept API token middleware
    (0, express_validator_1.body)('name').notEmpty().withMessage('Token name is required'),
    (0, express_validator_1.body)('permissions').optional().isArray().withMessage('Permissions must be an array'),
    (0, express_validator_1.body)('expiresAt').optional().isISO8601().withMessage('Valid expiration date required'),
], apiTokenController.createToken);
/**
 * @route   GET /api/v1/api-tokens
 * @desc    List all API tokens for authenticated user
 * @access  Private (JWT or API Token)
 */
router.get('/', [
    authMiddlewares_1.authMiddleware, // Can also accept API token middleware
], apiTokenController.listTokens);
/**
 * @route   GET /api/v1/api-tokens/:id
 * @desc    Get a specific API token
 * @access  Private (JWT or API Token)
 */
router.get('/:id', [
    authMiddlewares_1.authMiddleware, // Can also accept API token middleware
], apiTokenController.getToken);
/**
 * @route   PUT /api/v1/api-tokens/:id
 * @desc    Update an API token
 * @access  Private (JWT or API Token)
 */
router.put('/:id', [
    authMiddlewares_1.authMiddleware, // Can also accept API token middleware
    (0, express_validator_1.body)('name').optional().notEmpty().withMessage('Token name cannot be empty'),
    (0, express_validator_1.body)('permissions').optional().isArray().withMessage('Permissions must be an array'),
    (0, express_validator_1.body)('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
    (0, express_validator_1.body)('expiresAt').optional().isISO8601().withMessage('Valid expiration date required'),
], apiTokenController.updateToken);
/**
 * @route   DELETE /api/v1/api-tokens/:id
 * @desc    Delete (revoke) an API token
 * @access  Private (JWT or API Token)
 */
router.delete('/:id', [
    authMiddlewares_1.authMiddleware, // Can also accept API token middleware
], apiTokenController.deleteToken);
/**
 * @route   POST /api/v1/api-tokens/:id/rotate
 * @desc    Rotate an API token (generate new token, invalidate old one)
 * @access  Private (JWT or API Token)
 */
router.post('/:id/rotate', [
    authMiddlewares_1.authMiddleware, // Can also accept API token middleware
], apiTokenController.rotateToken);
// API-only routes (require API token, not JWT)
/**
 * @route   GET /api/v1/api/verify
 * @desc    Verify API token and return token info
 * @access  API Token only
 */
router.get('/api/verify', [
    apiTokenMiddleware_1.apiTokenMiddleware,
], (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            tokenId: req.apiToken?.id,
            name: req.apiToken?.name,
            permissions: req.apiToken?.permissions,
            userId: req.apiToken?.userId
        }
    });
});
/**
 * @route   GET /api/v1/api/user
 * @desc    Get user info using API token
 * @access  API Token only
 */
router.get('/api/user', [
    apiTokenMiddleware_1.apiTokenMiddleware,
    (0, apiTokenMiddleware_2.requireApiPermission)('users:read'),
], async (req, res) => {
    try {
        const { prisma } = await Promise.resolve().then(() => __importStar(require('../config/database')));
        const user = await prisma.user.findUnique({
            where: { id: req.apiToken.userId },
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
            data: user
        });
    }
    catch (error) {
        console.error('API get user error:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'API_USER_ERROR'
        });
    }
});
exports.default = router;
