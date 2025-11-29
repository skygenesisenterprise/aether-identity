import { Router } from 'express';
import { body, query } from 'express-validator';
import { MFAController } from '../controllers/mfaControllers';
import { authMiddleware } from '../middlewares/authMiddlewares';
import { rateLimitMiddleware } from '../middlewares/rateLimitMiddleware';

const router = Router();
const mfaController = new MFAController();

// Rate limiting for MFA endpoints
const mfaRateLimit = rateLimitMiddleware({
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
  authMiddleware,
  mfaRateLimit,
  body('method').isIn(['TOTP', 'SMS', 'EMAIL']).withMessage('Invalid MFA method'),
  body('phoneNumber').optional().isMobilePhone('any').withMessage('Invalid phone number'),
], mfaController.setupMFA);

/**
 * @route   POST /api/v1/mfa/verify
 * @desc    Verify MFA code during authentication
 * @access  Public (used during login flow)
 */
router.post('/verify', [
  mfaRateLimit,
  body('userId').notEmpty().withMessage('User ID is required'),
  body('sessionId').notEmpty().withMessage('Session ID is required'),
  body('code').isLength({ min: 4, max: 10 }).withMessage('Invalid code format'),
  body('method').optional().isIn(['TOTP', 'SMS', 'EMAIL', 'BACKUP_CODE']).withMessage('Invalid MFA method'),
], mfaController.verifyMFA);

/**
 * @route   POST /api/v1/mfa/send-code
 * @desc    Send MFA code via SMS or Email
 * @access  Public (used during login flow)
 */
router.post('/send-code', [
  mfaRateLimit,
  body('userId').notEmpty().withMessage('User ID is required'),
  body('sessionId').notEmpty().withMessage('Session ID is required'),
  body('method').isIn(['SMS', 'EMAIL']).withMessage('Invalid method for code sending'),
], mfaController.sendMFACode);

/**
 * @route   POST /api/v1/mfa/disable
 * @desc    Disable MFA for authenticated user
 * @access  Private
 */
router.post('/disable', [
  authMiddleware,
  body('password').isLength({ min: 6 }).withMessage('Password is required'),
], mfaController.disableMFA);

/**
 * @route   GET /api/v1/mfa/status
 * @desc    Get MFA status for authenticated user
 * @access  Private
 */
router.get('/status', authMiddleware, mfaController.getMFAStatus);

/**
 * @route   POST /api/v1/mfa/check-required
 * @desc    Check if MFA is required for authentication
 * @access  Public (used during login flow)
 */
router.post('/check-required', [
  body('userId').notEmpty().withMessage('User ID is required'),
], mfaController.checkMFARequired);

/**
 * @route   POST /api/v1/mfa/regenerate-backup-codes
 * @desc    Generate new backup codes
 * @access  Private
 */
router.post('/regenerate-backup-codes', [
  authMiddleware,
  body('password').isLength({ min: 6 }).withMessage('Password is required'),
], mfaController.regenerateBackupCodes);

export default router;