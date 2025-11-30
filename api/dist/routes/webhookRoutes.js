"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const webhookControllers_1 = require("../controllers/webhookControllers");
const authMiddlewares_1 = require("../middlewares/authMiddlewares");
const router = (0, express_1.Router)();
const webhookController = new webhookControllers_1.WebhookController();
/**
 * @route   POST /api/v1/webhooks
 * @desc    Create a new webhook subscription
 * @access  Private
 */
router.post('/', [
    authMiddlewares_1.authMiddleware,
    (0, express_validator_1.body)('url').isURL().withMessage('Valid URL is required'),
    (0, express_validator_1.body)('events').isArray({ min: 1 }).withMessage('Events array is required'),
    (0, express_validator_1.body)('description').optional().isString(),
    (0, express_validator_1.body)('timeout').optional().isInt({ min: 1000, max: 300000 }),
    (0, express_validator_1.body)('retryCount').optional().isInt({ min: 1, max: 10 })
], webhookController.createWebhook);
/**
 * @route   GET /api/v1/webhooks
 * @desc    List webhook subscriptions
 * @access  Private
 */
router.get('/', [
    authMiddlewares_1.authMiddleware,
    (0, express_validator_1.query)('isActive').optional().isBoolean(),
    (0, express_validator_1.query)('event').optional().isString()
], webhookController.listWebhooks);
/**
 * @route   GET /api/v1/webhooks/:id
 * @desc    Get webhook by ID
 * @access  Private
 */
router.get('/:id', authMiddlewares_1.authMiddleware, webhookController.getWebhook);
/**
 * @route   PUT /api/v1/webhooks/:id
 * @desc    Update webhook subscription
 * @access  Private
 */
router.put('/:id', [
    authMiddlewares_1.authMiddleware,
    (0, express_validator_1.body)('url').optional().isURL().withMessage('Valid URL is required'),
    (0, express_validator_1.body)('events').optional().isArray({ min: 1 }),
    (0, express_validator_1.body)('description').optional().isString(),
    (0, express_validator_1.body)('isActive').optional().isBoolean(),
    (0, express_validator_1.body)('timeout').optional().isInt({ min: 1000, max: 300000 }),
    (0, express_validator_1.body)('retryCount').optional().isInt({ min: 1, max: 10 })
], webhookController.updateWebhook);
/**
 * @route   DELETE /api/v1/webhooks/:id
 * @desc    Delete webhook subscription
 * @access  Private
 */
router.delete('/:id', authMiddlewares_1.authMiddleware, webhookController.deleteWebhook);
/**
 * @route   GET /api/v1/webhooks/:id/stats
 * @desc    Get webhook delivery statistics
 * @access  Private
 */
router.get('/:id/stats', [
    authMiddlewares_1.authMiddleware,
    (0, express_validator_1.query)('from').optional().isISO8601(),
    (0, express_validator_1.query)('to').optional().isISO8601()
], webhookController.getWebhookStats);
/**
 * @route   POST /api/v1/webhooks/:id/test
 * @desc    Test webhook delivery
 * @access  Private
 */
router.post('/:id/test', [
    authMiddlewares_1.authMiddleware,
    (0, express_validator_1.body)('eventType').optional().isString(),
    (0, express_validator_1.body)('testData').optional().isObject()
], webhookController.testWebhook);
/**
 * @route   POST /api/v1/webhooks/retry-failed
 * @desc    Retry all failed webhook deliveries (Admin only)
 * @access  Private (Admin)
 */
router.post('/retry-failed', authMiddlewares_1.authMiddleware, webhookController.retryFailedDeliveries);
exports.default = router;
