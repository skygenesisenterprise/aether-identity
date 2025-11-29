import { Router } from 'express';
import { body, query } from 'express-validator';
import { TOTPController } from '../controllers/totpControllers';
import { authMiddleware } from '../middlewares/authMiddlewares';
import { rateLimitMiddleware } from '../middlewares/rateLimitMiddleware';

const router = Router();
const totpController = new TOTPController();

// Rate limiting for TOTP endpoints
const totpRateLimit = rateLimitMiddleware({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 TOTP requests per windowMs
  message: {
    error: 'Too many TOTP attempts, please try again later.',
  },
});

/**
 * @route   POST /api/v1/totp/setup
 * @desc    Generate TOTP secret and QR code for user
 * @access  Private
 */
router.post('/setup', [
  authMiddleware,
  totpRateLimit,
], totpController.setupTOTP);

/**
 * @route   POST /api/v1/totp/verify-setup
 * @desc    Verify TOTP token during setup process
 * @access  Private
 */
router.post('/verify-setup', [
  authMiddleware,
  totpRateLimit,
  body('secret').notEmpty().withMessage('Secret is required'),
  body('token').isLength({ min: 6, max: 6 }).withMessage('Token must be 6 digits'),
], totpController.verifyTOTPSetup);

/**
 * @route   POST /api/v1/totp/enable
 * @desc    Enable TOTP after successful verification
 * @access  Private
 */
router.post('/enable', [
  authMiddleware,
  totpRateLimit,
  body('secret').notEmpty().withMessage('Secret is required'),
  body('verificationToken').isLength({ min: 6, max: 6 }).withMessage('Verification token must be 6 digits'),
], totpController.enableTOTP);

/**
 * @route   POST /api/v1/totp/verify
 * @desc    Verify TOTP token for authentication
 * @access  Public (used during login flow)
 */
router.post('/verify', [
  totpRateLimit,
  body('userId').notEmpty().withMessage('User ID is required'),
  body('token').isLength({ min: 6, max: 6 }).withMessage('Token must be 6 digits'),
  body('window').optional().isInt({ min: 0, max: 5 }).withMessage('Window must be between 0 and 5'),
], totpController.verifyTOTP);

/**
 * @route   POST /api/v1/totp/backup-code/verify
 * @desc    Verify backup code
 * @access  Public (used during login flow)
 */
router.post('/backup-code/verify', [
  totpRateLimit,
  body('userId').notEmpty().withMessage('User ID is required'),
  body('code').isLength({ min: 8, max: 11 }).withMessage('Invalid backup code format'),
], totpController.verifyBackupCode);

/**
 * @route   POST /api/v1/totp/backup-code/regenerate
 * @desc    Generate new backup codes
 * @access  Private
 */
router.post('/backup-code/regenerate', [
  authMiddleware,
  totpRateLimit,
  body('password').isLength({ min: 6 }).withMessage('Password is required'),
], totpController.regenerateBackupCodes);

/**
 * @route   GET /api/v1/totp/info
 * @desc    Get TOTP configuration and supported apps
 * @access  Public
 */
router.get('/info', totpController.getTOTPInfo);

/**
 * @route   GET /api/v1/totp/current-token
 * @desc    Get current TOTP token (for testing only)
 * @access  Public (development only)
 */
router.get('/current-token', [
  query('secret').notEmpty().withMessage('Secret parameter is required'),
], totpController.getCurrentToken);

export default router;