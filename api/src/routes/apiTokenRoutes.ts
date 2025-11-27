import { Router } from 'express';
import { body } from 'express-validator';
import { ApiTokenController } from '../controllers/apiTokenControllers';
import { authMiddleware } from '../middlewares/authMiddlewares';
import { apiTokenMiddleware } from '../middlewares/apiTokenMiddleware';
import { requireApiPermission } from '../middlewares/apiTokenMiddleware';

const router = Router();
const apiTokenController = new ApiTokenController();

/**
 * @route   POST /api/v1/api-tokens
 * @desc    Create a new API token
 * @access  Private (JWT or API Token)
 */
router.post('/', [
  authMiddleware, // Can also accept API token middleware
  body('name').notEmpty().withMessage('Token name is required'),
  body('permissions').optional().isArray().withMessage('Permissions must be an array'),
  body('expiresAt').optional().isISO8601().withMessage('Valid expiration date required'),
], apiTokenController.createToken);

/**
 * @route   GET /api/v1/api-tokens
 * @desc    List all API tokens for authenticated user
 * @access  Private (JWT or API Token)
 */
router.get('/', [
  authMiddleware, // Can also accept API token middleware
], apiTokenController.listTokens);

/**
 * @route   GET /api/v1/api-tokens/:id
 * @desc    Get a specific API token
 * @access  Private (JWT or API Token)
 */
router.get('/:id', [
  authMiddleware, // Can also accept API token middleware
], apiTokenController.getToken);

/**
 * @route   PUT /api/v1/api-tokens/:id
 * @desc    Update an API token
 * @access  Private (JWT or API Token)
 */
router.put('/:id', [
  authMiddleware, // Can also accept API token middleware
  body('name').optional().notEmpty().withMessage('Token name cannot be empty'),
  body('permissions').optional().isArray().withMessage('Permissions must be an array'),
  body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
  body('expiresAt').optional().isISO8601().withMessage('Valid expiration date required'),
], apiTokenController.updateToken);

/**
 * @route   DELETE /api/v1/api-tokens/:id
 * @desc    Delete (revoke) an API token
 * @access  Private (JWT or API Token)
 */
router.delete('/:id', [
  authMiddleware, // Can also accept API token middleware
], apiTokenController.deleteToken);

/**
 * @route   POST /api/v1/api-tokens/:id/rotate
 * @desc    Rotate an API token (generate new token, invalidate old one)
 * @access  Private (JWT or API Token)
 */
router.post('/:id/rotate', [
  authMiddleware, // Can also accept API token middleware
], apiTokenController.rotateToken);

// API-only routes (require API token, not JWT)

/**
 * @route   GET /api/v1/api/verify
 * @desc    Verify API token and return token info
 * @access  API Token only
 */
router.get('/api/verify', [
  apiTokenMiddleware,
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
  apiTokenMiddleware,
  requireApiPermission('users:read'),
], async (req, res) => {
  try {
    const { prisma } = await import('../config/database');
    
    const user = await prisma.user.findUnique({
      where: { id: req.apiToken!.userId },
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
  } catch (error) {
    console.error('API get user error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'API_USER_ERROR'
    });
  }
});

export default router;