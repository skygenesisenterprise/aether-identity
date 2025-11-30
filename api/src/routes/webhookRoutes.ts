import { Router } from 'express';
import { body, query } from 'express-validator';
import { WebhookController } from '../controllers/webhookControllers';
import { authMiddleware } from '../middlewares/authMiddlewares';

const router = Router();
const webhookController = new WebhookController();

/**
 * @route   POST /api/v1/webhooks
 * @desc    Create a new webhook subscription
 * @access  Private
 */
router.post('/', [
  authMiddleware,
  body('url').isURL().withMessage('Valid URL is required'),
  body('events').isArray({ min: 1 }).withMessage('Events array is required'),
  body('description').optional().isString(),
  body('timeout').optional().isInt({ min: 1000, max: 300000 }),
  body('retryCount').optional().isInt({ min: 1, max: 10 })
], webhookController.createWebhook);

/**
 * @route   GET /api/v1/webhooks
 * @desc    List webhook subscriptions
 * @access  Private
 */
router.get('/', [
  authMiddleware,
  query('isActive').optional().isBoolean(),
  query('event').optional().isString()
], webhookController.listWebhooks);

/**
 * @route   GET /api/v1/webhooks/:id
 * @desc    Get webhook by ID
 * @access  Private
 */
router.get('/:id', authMiddleware, webhookController.getWebhook);

/**
 * @route   PUT /api/v1/webhooks/:id
 * @desc    Update webhook subscription
 * @access  Private
 */
router.put('/:id', [
  authMiddleware,
  body('url').optional().isURL().withMessage('Valid URL is required'),
  body('events').optional().isArray({ min: 1 }),
  body('description').optional().isString(),
  body('isActive').optional().isBoolean(),
  body('timeout').optional().isInt({ min: 1000, max: 300000 }),
  body('retryCount').optional().isInt({ min: 1, max: 10 })
], webhookController.updateWebhook);

/**
 * @route   DELETE /api/v1/webhooks/:id
 * @desc    Delete webhook subscription
 * @access  Private
 */
router.delete('/:id', authMiddleware, webhookController.deleteWebhook);

/**
 * @route   GET /api/v1/webhooks/:id/stats
 * @desc    Get webhook delivery statistics
 * @access  Private
 */
router.get('/:id/stats', [
  authMiddleware,
  query('from').optional().isISO8601(),
  query('to').optional().isISO8601()
], webhookController.getWebhookStats);

/**
 * @route   POST /api/v1/webhooks/:id/test
 * @desc    Test webhook delivery
 * @access  Private
 */
router.post('/:id/test', [
  authMiddleware,
  body('eventType').optional().isString(),
  body('testData').optional().isObject()
], webhookController.testWebhook);

/**
 * @route   POST /api/v1/webhooks/retry-failed
 * @desc    Retry all failed webhook deliveries (Admin only)
 * @access  Private (Admin)
 */
router.post('/retry-failed', authMiddleware, webhookController.retryFailedDeliveries);

export default router;