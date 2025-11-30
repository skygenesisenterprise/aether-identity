"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const roleControllers_1 = require("../controllers/roleControllers");
const authMiddlewares_1 = require("../middlewares/authMiddlewares");
const router = (0, express_1.Router)();
const roleController = new roleControllers_1.RoleController();
/**
 * @route   POST /api/v1/roles
 * @desc    Create a new role
 * @access  Private (roles:write)
 */
router.post('/', [
    authMiddlewares_1.authMiddleware,
    (0, express_validator_1.body)('name').notEmpty().withMessage('Role name is required'),
    (0, express_validator_1.body)('description').notEmpty().withMessage('Role description is required'),
    (0, express_validator_1.body)('permissions').isArray({ min: 1 }).withMessage('Permissions array is required'),
    (0, express_validator_1.body)('isSystem').optional().isBoolean()
], roleController.createRole);
/**
 * @route   GET /api/v1/roles
 * @desc    List all roles
 * @access  Private (roles:read)
 */
router.get('/', [
    authMiddlewares_1.authMiddleware,
    (0, express_validator_1.query)('isActive').optional().isBoolean(),
    (0, express_validator_1.query)('isSystem').optional().isBoolean()
], roleController.listRoles);
/**
 * @route   GET /api/v1/roles/:id
 * @desc    Get role by ID
 * @access  Private (roles:read)
 */
router.get('/:id', authMiddlewares_1.authMiddleware, roleController.getRole);
/**
 * @route   PUT /api/v1/roles/:id
 * @desc    Update an existing role
 * @access  Private (roles:write)
 */
router.put('/:id', [
    authMiddlewares_1.authMiddleware,
    (0, express_validator_1.body)('name').optional().notEmpty().withMessage('Role name cannot be empty'),
    (0, express_validator_1.body)('description').optional().notEmpty().withMessage('Role description cannot be empty'),
    (0, express_validator_1.body)('permissions').optional().isArray({ min: 1 }),
    (0, express_validator_1.body)('isActive').optional().isBoolean()
], roleController.updateRole);
/**
 * @route   DELETE /api/v1/roles/:id
 * @desc    Delete a role
 * @access  Private (roles:delete)
 */
router.delete('/:id', authMiddlewares_1.authMiddleware, roleController.deleteRole);
/**
 * @route   POST /api/v1/roles/assign
 * @desc    Assign role to user
 * @access  Private (users:write)
 */
router.post('/assign', [
    authMiddlewares_1.authMiddleware,
    (0, express_validator_1.body)('userId').notEmpty().withMessage('User ID is required'),
    (0, express_validator_1.body)('roleId').notEmpty().withMessage('Role ID is required'),
    (0, express_validator_1.body)('expiresAt').optional().isISO8601().withMessage('Valid expiration date required')
], roleController.assignRole);
/**
 * @route   DELETE /api/v1/roles/users/:userId/roles/:roleId
 * @desc    Remove role from user
 * @access  Private (users:write or self)
 */
router.delete('/users/:userId/roles/:roleId', authMiddlewares_1.authMiddleware, roleController.removeRole);
/**
 * @route   GET /api/v1/roles/users/:userId
 * @desc    Get user roles
 * @access  Private (users:read or self)
 */
router.get('/users/:userId', authMiddlewares_1.authMiddleware, roleController.getUserRoles);
/**
 * @route   GET /api/v1/roles/:roleId/users
 * @desc    Get users with specific role
 * @access  Private (users:read)
 */
router.get('/:roleId/users', authMiddlewares_1.authMiddleware, roleController.getUsersWithRole);
/**
 * @route   POST /api/v1/roles/initialize
 * @desc    Initialize system roles
 * @access  Private (admin:access)
 */
router.post('/initialize', authMiddlewares_1.authMiddleware, roleController.initializeSystemRoles);
/**
 * @route   GET /api/v1/roles/stats
 * @desc    Get RBAC statistics
 * @access  Private (admin:access)
 */
router.get('/stats', authMiddlewares_1.authMiddleware, roleController.getRBACStats);
exports.default = router;
