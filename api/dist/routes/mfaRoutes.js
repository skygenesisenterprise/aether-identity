"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const mfaControllers_1 = require("../controllers/mfaControllers");
const authMiddlewares_1 = require("../middlewares/authMiddlewares");
const rateLimitMiddleware_1 = require("../middlewares/rateLimitMiddleware");
const router = (0, express_1.Router)();
const mfaController = new mfaControllers_1.MFAController();
// Rate limiting for MFA endpoints
const mfaRateLimit = (0, rateLimitMiddleware_1.rateLimitMiddleware)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 MFA requests per windowMs
    message: {
        error: 'Too many MFA attempts, please try again later.',
    },
});
/**
 * @route   POST /api/v1/mfa/setup
 * @desc    Setup MFA for authenticated user
 * @access  Private
 */
router.post('/setup', [
    authMiddlewares_1.authMiddleware,
    mfaRateLimit,
    (0, express_validator_1.body)('method').isIn(['TOTP', 'SMS', 'EMAIL']).withMessage('Invalid MFA method'),
    (0, express_validator_1.body)('phoneNumber').optional().isMobilePhone('any').withMessage('Invalid phone number'),
], mfaController.setupMFA);
/**
 * @route   POST /api/v1/mfa/verify
 * @desc    Verify MFA code during authentication
 * @access  Public (used during login flow)
 */
router.post('/verify', [
    mfaRateLimit,
    (0, express_validator_1.body)('userId').notEmpty().withMessage('User ID is required'),
    (0, express_validator_1.body)('sessionId').notEmpty().withMessage('Session ID is required'),
    (0, express_validator_1.body)('code').isLength({ min: 4, max: 10 }).withMessage('Invalid code format'),
    (0, express_validator_1.body)('method').optional().isIn(['TOTP', 'SMS', 'EMAIL', 'BACKUP_CODE']).withMessage('Invalid MFA method'),
], mfaController.verifyMFA);
/**
 * @route   POST /api/v1/mfa/send-code
 * @desc    Send MFA code via SMS or Email
 * @access  Public (used during login flow)
 */
router.post('/send-code', [
    mfaRateLimit,
    (0, express_validator_1.body)('userId').notEmpty().withMessage('User ID is required'),
    (0, express_validator_1.body)('sessionId').notEmpty().withMessage('Session ID is required'),
    (0, express_validator_1.body)('method').isIn(['SMS', 'EMAIL']).withMessage('Invalid method for code sending'),
], mfaController.sendMFACode);
/**
 * @route   POST /api/v1/mfa/disable
 * @desc    Disable MFA for authenticated user
 * @access  Private
 */
router.post('/disable', [
    authMiddlewares_1.authMiddleware,
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password is required'),
], mfaController.disableMFA);
/**
 * @route   GET /api/v1/mfa/status
 * @desc    Get MFA status for authenticated user
 * @access  Private
 */
router.get('/status', authMiddlewares_1.authMiddleware, mfaController.getMFAStatus);
/**
 * @route   POST /api/v1/mfa/check-required
 * @desc    Check if MFA is required for authentication
 * @access  Public (used during login flow)
 */
router.post('/check-required', [
    (0, express_validator_1.body)('userId').notEmpty().withMessage('User ID is required'),
], mfaController.checkMFARequired);
/**
 * @route   POST /api/v1/mfa/regenerate-backup-codes
 * @desc    Generate new backup codes
 * @access  Private
 */
router.post('/regenerate-backup-codes', [
    authMiddlewares_1.authMiddleware,
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password is required'),
], mfaController.regenerateBackupCodes);
exports.default = router;
