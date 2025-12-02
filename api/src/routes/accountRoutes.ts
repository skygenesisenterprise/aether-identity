import { Router } from 'express';
import { body } from 'express-validator';
import { AccountController } from '../controllers/accountControllers';
import { authMiddleware } from '../middlewares/authMiddlewares';
import { requirePermission } from '../middlewares/permissionMiddleware';

const router = Router();
const accountController = new AccountController();

/**
 * @route   POST /api/v1/accounts/authenticate
 * @desc    Authenticate user with identifier (email/username/phone) and password
 * @access  Public
 */
router.post('/authenticate', [
  body('identifier').notEmpty().withMessage('Identifier (email/username/phone) is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], accountController.authenticate);

/**
 * @route   POST /api/v1/accounts/register
 * @desc    Register a new account with profile
 * @access  Public
 */
router.post('/register', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('fullName').notEmpty().withMessage('Full name is required'),
], accountController.register);

/**
 * @route   GET /api/v1/accounts/profile
 * @desc    Get user profile with memberships
 * @access  Private
 */
router.get('/profile', authMiddleware, accountController.getProfile);

/**
 * @route   PUT /api/v1/accounts/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', [
  authMiddleware,
  body('fullName').optional().notEmpty().withMessage('Full name cannot be empty'),
  body('phone').optional().isMobilePhone('any').withMessage('Invalid phone number'),
], accountController.updateProfile);

/**
 * @route   GET /api/v1/accounts/memberships
 * @desc    Get user's organization memberships
 * @access  Private
 */
router.get('/memberships', authMiddleware, accountController.getMemberships);

/**
 * @route   POST /api/v1/accounts/change-password
 * @desc    Change account password
 * @access  Private
 */
router.post('/change-password', [
  authMiddleware,
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
], accountController.changePassword);

/**
 * @route   POST /api/v1/accounts/enable-2fa
 * @desc    Enable two-factor authentication
 * @access  Private
 */
router.post('/enable-2fa', authMiddleware, accountController.enable2FA);

/**
 * @route   POST /api/v1/accounts/disable-2fa
 * @desc    Disable two-factor authentication
 * @access  Private
 */
router.post('/disable-2fa', [
  authMiddleware,
  body('code').notEmpty().withMessage('2FA code is required'),
], accountController.disable2FA);

/**
 * @route   POST /api/v1/accounts/verify-2fa
 * @desc    Verify two-factor authentication code
 * @access  Private
 */
router.post('/verify-2fa', [
  authMiddleware,
  body('code').isLength({ min: 6, max: 6 }).withMessage('2FA code must be 6 digits'),
], accountController.verify2FA);

/**
 * @route   DELETE /api/v1/accounts/delete
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/delete', [
  authMiddleware,
  body('password').notEmpty().withMessage('Password confirmation is required'),
], accountController.deleteAccount);

/**
 * @route   GET /api/v1/accounts/sessions
 * @desc    Get active sessions
 * @access  Private
 */
router.get('/sessions', authMiddleware, accountController.getSessions);

/**
 * @route   DELETE /api/v1/accounts/sessions/:sessionId
 * @desc    Revoke a specific session
 * @access  Private
 */
router.delete('/sessions/:sessionId', authMiddleware, accountController.revokeSession);

/**
 * @route   DELETE /api/v1/accounts/sessions
 * @desc    Revoke all sessions except current
 * @access  Private
 */
router.delete('/sessions', authMiddleware, accountController.revokeAllSessions);

// Admin routes
/**
 * @route   GET /api/v1/accounts
 * @desc    Get all accounts (admin only)
 * @access  Private (Admin)
 */
router.get('/', [
  authMiddleware,
  requirePermission('accounts:read'),
], accountController.getAllAccounts);

/**
 * @route   GET /api/v1/accounts/:id
 * @desc    Get account by ID (admin only)
 * @access  Private (Admin)
 */
router.get('/:id', [
  authMiddleware,
  requirePermission('accounts:read'),
], accountController.getAccountById);

/**
 * @route   PUT /api/v1/accounts/:id/status
 * @desc    Update account status (admin only)
 * @access  Private (Admin)
 */
router.put('/:id/status', [
  authMiddleware,
  requirePermission('accounts:write'),
  body('status').isIn(['ACTIVE', 'INACTIVE', 'SUSPENDED']).withMessage('Invalid status'),
], accountController.updateAccountStatus);

/**
 * @route   POST /api/v1/accounts/create-user
 * @desc    Create a new user (admin only)
 * @access  Private (Admin)
 */
router.post('/create-user', [
  authMiddleware,
  requirePermission('accounts:write'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('role').optional().isIn(['USER', 'MANAGER', 'ADMIN']).withMessage('Invalid role'),
  body('status').optional().isIn(['ACTIVE', 'INACTIVE', 'SUSPENDED']).withMessage('Invalid status'),
], accountController.createUser);

/**
 * @route   PUT /api/v1/accounts/:id
 * @desc    Update user account (admin only)
 * @access  Private (Admin)
 */
router.put('/:id', [
  authMiddleware,
  requirePermission('accounts:write'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('fullName').optional().notEmpty().withMessage('Full name cannot be empty'),
  body('role').optional().isIn(['USER', 'MANAGER', 'ADMIN']).withMessage('Invalid role'),
  body('status').optional().isIn(['ACTIVE', 'INACTIVE', 'SUSPENDED']).withMessage('Invalid status'),
], accountController.updateUser);

/**
 * @route   DELETE /api/v1/accounts/:id
 * @desc    Delete user account (admin only)
 * @access  Private (Admin)
 */
router.delete('/:id', [
  authMiddleware,
  requirePermission('accounts:delete'),
], accountController.deleteUser);

/**
 * @route   GET /api/v1/accounts/:id/permissions
 * @desc    Get user permissions (admin only)
 * @access  Private (Admin)
 */
router.get('/:id/permissions', [
  authMiddleware,
  requirePermission('accounts:read'),
], accountController.getUserPermissionsEndpoint);

/**
 * @route   PUT /api/v1/accounts/:id/permissions
 * @desc    Update user permissions (admin only)
 * @access  Private (Admin)
 */
router.put('/:id/permissions', [
  authMiddleware,
  requirePermission('accounts:write'),
  body('permissions').isArray().withMessage('Permissions must be an array'),
], accountController.updateUserPermissions);

/**
 * @route   GET /api/v1/accounts/:id/audit-log
 * @desc    Get user audit log (admin only)
 * @access  Private (Admin)
 */
router.get('/:id/audit-log', [
  authMiddleware,
  requirePermission('accounts:read'),
], accountController.getUserAuditLog);

/**
 * @route   POST /api/v1/accounts/bulk-operations
 * @desc    Bulk operations on users (admin only)
 * @access  Private (Admin)
 */
router.post('/bulk-operations', [
  authMiddleware,
  requirePermission('accounts:write'),
  body('operation').isIn(['activate', 'deactivate', 'suspend', 'delete']).withMessage('Invalid operation'),
  body('userIds').isArray().withMessage('User IDs must be an array'),
], accountController.bulkOperations);

export default router;