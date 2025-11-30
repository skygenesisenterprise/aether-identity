import { Router } from 'express';
import { body, query } from 'express-validator';
import { RoleController } from '../controllers/roleControllers';
import { authMiddleware } from '../middlewares/authMiddlewares';

const router = Router();
const roleController = new RoleController();

/**
 * @route   POST /api/v1/roles
 * @desc    Create a new role
 * @access  Private (roles:write)
 */
router.post('/', [
  authMiddleware,
  body('name').notEmpty().withMessage('Role name is required'),
  body('description').notEmpty().withMessage('Role description is required'),
  body('permissions').isArray({ min: 1 }).withMessage('Permissions array is required'),
  body('isSystem').optional().isBoolean()
], roleController.createRole);

/**
 * @route   GET /api/v1/roles
 * @desc    List all roles
 * @access  Private (roles:read)
 */
router.get('/', [
  authMiddleware,
  query('isActive').optional().isBoolean(),
  query('isSystem').optional().isBoolean()
], roleController.listRoles);

/**
 * @route   GET /api/v1/roles/:id
 * @desc    Get role by ID
 * @access  Private (roles:read)
 */
router.get('/:id', authMiddleware, roleController.getRole);

/**
 * @route   PUT /api/v1/roles/:id
 * @desc    Update an existing role
 * @access  Private (roles:write)
 */
router.put('/:id', [
  authMiddleware,
  body('name').optional().notEmpty().withMessage('Role name cannot be empty'),
  body('description').optional().notEmpty().withMessage('Role description cannot be empty'),
  body('permissions').optional().isArray({ min: 1 }),
  body('isActive').optional().isBoolean()
], roleController.updateRole);

/**
 * @route   DELETE /api/v1/roles/:id
 * @desc    Delete a role
 * @access  Private (roles:delete)
 */
router.delete('/:id', authMiddleware, roleController.deleteRole);

/**
 * @route   POST /api/v1/roles/assign
 * @desc    Assign role to user
 * @access  Private (users:write)
 */
router.post('/assign', [
  authMiddleware,
  body('userId').notEmpty().withMessage('User ID is required'),
  body('roleId').notEmpty().withMessage('Role ID is required'),
  body('expiresAt').optional().isISO8601().withMessage('Valid expiration date required')
], roleController.assignRole);

/**
 * @route   DELETE /api/v1/roles/users/:userId/roles/:roleId
 * @desc    Remove role from user
 * @access  Private (users:write or self)
 */
router.delete('/users/:userId/roles/:roleId', authMiddleware, roleController.removeRole);

/**
 * @route   GET /api/v1/roles/users/:userId
 * @desc    Get user roles
 * @access  Private (users:read or self)
 */
router.get('/users/:userId', authMiddleware, roleController.getUserRoles);

/**
 * @route   GET /api/v1/roles/:roleId/users
 * @desc    Get users with specific role
 * @access  Private (users:read)
 */
router.get('/:roleId/users', authMiddleware, roleController.getUsersWithRole);

/**
 * @route   POST /api/v1/roles/initialize
 * @desc    Initialize system roles
 * @access  Private (admin:access)
 */
router.post('/initialize', authMiddleware, roleController.initializeSystemRoles);

/**
 * @route   GET /api/v1/roles/stats
 * @desc    Get RBAC statistics
 * @access  Private (admin:access)
 */
router.get('/stats', authMiddleware, roleController.getRBACStats);

export default router;