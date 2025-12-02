"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const accountControllers_1 = require("../controllers/accountControllers");
const authMiddlewares_1 = require("../middlewares/authMiddlewares");
const permissionMiddleware_1 = require("../middlewares/permissionMiddleware");
const router = (0, express_1.Router)();
const accountController = new accountControllers_1.AccountController();
/**
 * @route   POST /api/v1/accounts/authenticate
 * @desc    Authenticate user with identifier (email/username/phone) and password
 * @access  Public
 */
router.post('/authenticate', [
    (0, express_validator_1.body)('identifier').notEmpty().withMessage('Identifier (email/username/phone) is required'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], accountController.authenticate);
/**
 * @route   POST /api/v1/accounts/register
 * @desc    Register a new account with profile
 * @access  Public
 */
router.post('/register', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    (0, express_validator_1.body)('fullName').notEmpty().withMessage('Full name is required'),
], accountController.register);
/**
 * @route   GET /api/v1/accounts/profile
 * @desc    Get user profile with memberships
 * @access  Private
 */
router.get('/profile', authMiddlewares_1.authMiddleware, accountController.getProfile);
/**
 * @route   PUT /api/v1/accounts/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', [
    authMiddlewares_1.authMiddleware,
    (0, express_validator_1.body)('fullName').optional().notEmpty().withMessage('Full name cannot be empty'),
    (0, express_validator_1.body)('phone').optional().isMobilePhone('any').withMessage('Invalid phone number'),
], accountController.updateProfile);
/**
 * @route   GET /api/v1/accounts/memberships
 * @desc    Get user's organization memberships
 * @access  Private
 */
router.get('/memberships', authMiddlewares_1.authMiddleware, accountController.getMemberships);
/**
 * @route   POST /api/v1/accounts/change-password
 * @desc    Change account password
 * @access  Private
 */
router.post('/change-password', [
    authMiddlewares_1.authMiddleware,
    (0, express_validator_1.body)('currentPassword').notEmpty().withMessage('Current password is required'),
    (0, express_validator_1.body)('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
], accountController.changePassword);
/**
 * @route   POST /api/v1/accounts/enable-2fa
 * @desc    Enable two-factor authentication
 * @access  Private
 */
router.post('/enable-2fa', authMiddlewares_1.authMiddleware, accountController.enable2FA);
/**
 * @route   POST /api/v1/accounts/disable-2fa
 * @desc    Disable two-factor authentication
 * @access  Private
 */
router.post('/disable-2fa', [
    authMiddlewares_1.authMiddleware,
    (0, express_validator_1.body)('code').notEmpty().withMessage('2FA code is required'),
], accountController.disable2FA);
/**
 * @route   POST /api/v1/accounts/verify-2fa
 * @desc    Verify two-factor authentication code
 * @access  Private
 */
router.post('/verify-2fa', [
    authMiddlewares_1.authMiddleware,
    (0, express_validator_1.body)('code').isLength({ min: 6, max: 6 }).withMessage('2FA code must be 6 digits'),
], accountController.verify2FA);
/**
 * @route   DELETE /api/v1/accounts/delete
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/delete', [
    authMiddlewares_1.authMiddleware,
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password confirmation is required'),
], accountController.deleteAccount);
/**
 * @route   GET /api/v1/accounts/sessions
 * @desc    Get active sessions
 * @access  Private
 */
router.get('/sessions', authMiddlewares_1.authMiddleware, accountController.getSessions);
/**
 * @route   DELETE /api/v1/accounts/sessions/:sessionId
 * @desc    Revoke a specific session
 * @access  Private
 */
router.delete('/sessions/:sessionId', authMiddlewares_1.authMiddleware, accountController.revokeSession);
/**
 * @route   DELETE /api/v1/accounts/sessions
 * @desc    Revoke all sessions except current
 * @access  Private
 */
router.delete('/sessions', authMiddlewares_1.authMiddleware, accountController.revokeAllSessions);
// Admin routes
/**
 * @route   GET /api/v1/accounts
 * @desc    Get all accounts (admin only)
 * @access  Private (Admin)
 */
router.get('/', [
    authMiddlewares_1.authMiddleware,
    (0, permissionMiddleware_1.requirePermission)('accounts:read'),
], accountController.getAllAccounts);
/**
 * @route   GET /api/v1/accounts/:id
 * @desc    Get account by ID (admin only)
 * @access  Private (Admin)
 */
router.get('/:id', [
    authMiddlewares_1.authMiddleware,
    (0, permissionMiddleware_1.requirePermission)('accounts:read'),
], accountController.getAccountById);
/**
 * @route   PUT /api/v1/accounts/:id/status
 * @desc    Update account status (admin only)
 * @access  Private (Admin)
 */
router.put('/:id/status', [
    authMiddlewares_1.authMiddleware,
    (0, permissionMiddleware_1.requirePermission)('accounts:write'),
    (0, express_validator_1.body)('status').isIn(['ACTIVE', 'INACTIVE', 'SUSPENDED']).withMessage('Invalid status'),
], accountController.updateAccountStatus);
/**
 * @route   POST /api/v1/accounts/create-user
 * @desc    Create a new user (admin only)
 * @access  Private (Admin)
 */
router.post('/create-user', [
    authMiddlewares_1.authMiddleware,
    (0, permissionMiddleware_1.requirePermission)('accounts:write'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    (0, express_validator_1.body)('fullName').notEmpty().withMessage('Full name is required'),
    (0, express_validator_1.body)('role').optional().isIn(['USER', 'MANAGER', 'ADMIN']).withMessage('Invalid role'),
    (0, express_validator_1.body)('status').optional().isIn(['ACTIVE', 'INACTIVE', 'SUSPENDED']).withMessage('Invalid status'),
], accountController.createUser);
/**
 * @route   PUT /api/v1/accounts/:id
 * @desc    Update user account (admin only)
 * @access  Private (Admin)
 */
router.put('/:id', [
    authMiddlewares_1.authMiddleware,
    (0, permissionMiddleware_1.requirePermission)('accounts:write'),
    (0, express_validator_1.body)('email').optional().isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('fullName').optional().notEmpty().withMessage('Full name cannot be empty'),
    (0, express_validator_1.body)('role').optional().isIn(['USER', 'MANAGER', 'ADMIN']).withMessage('Invalid role'),
    (0, express_validator_1.body)('status').optional().isIn(['ACTIVE', 'INACTIVE', 'SUSPENDED']).withMessage('Invalid status'),
], accountController.updateUser);
/**
 * @route   DELETE /api/v1/accounts/:id
 * @desc    Delete user account (admin only)
 * @access  Private (Admin)
 */
router.delete('/:id', [
    authMiddlewares_1.authMiddleware,
    (0, permissionMiddleware_1.requirePermission)('accounts:delete'),
], accountController.deleteUser);
/**
 * @route   GET /api/v1/accounts/:id/permissions
 * @desc    Get user permissions (admin only)
 * @access  Private (Admin)
 */
router.get('/:id/permissions', [
    authMiddlewares_1.authMiddleware,
    (0, permissionMiddleware_1.requirePermission)('accounts:read'),
], accountController.getUserPermissionsEndpoint);
/**
 * @route   PUT /api/v1/accounts/:id/permissions
 * @desc    Update user permissions (admin only)
 * @access  Private (Admin)
 */
router.put('/:id/permissions', [
    authMiddlewares_1.authMiddleware,
    (0, permissionMiddleware_1.requirePermission)('accounts:write'),
    (0, express_validator_1.body)('permissions').isArray().withMessage('Permissions must be an array'),
], accountController.updateUserPermissions);
/**
 * @route   GET /api/v1/accounts/:id/audit-log
 * @desc    Get user audit log (admin only)
 * @access  Private (Admin)
 */
router.get('/:id/audit-log', [
    authMiddlewares_1.authMiddleware,
    (0, permissionMiddleware_1.requirePermission)('accounts:read'),
], accountController.getUserAuditLog);
/**
 * @route   POST /api/v1/accounts/bulk-operations
 * @desc    Bulk operations on users (admin only)
 * @access  Private (Admin)
 */
router.post('/bulk-operations', [
    authMiddlewares_1.authMiddleware,
    (0, permissionMiddleware_1.requirePermission)('accounts:write'),
    (0, express_validator_1.body)('operation').isIn(['activate', 'deactivate', 'suspend', 'delete']).withMessage('Invalid operation'),
    (0, express_validator_1.body)('userIds').isArray().withMessage('User IDs must be an array'),
], accountController.bulkOperations);
exports.default = router;
