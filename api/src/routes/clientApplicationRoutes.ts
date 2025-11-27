import { Router } from 'express';
import { body } from 'express-validator';
import { ClientApplicationController } from '../controllers/clientApplicationControllers';
import { authMiddleware } from '../middlewares/authMiddlewares';

const router = Router();
const clientApplicationController = new ClientApplicationController();

/**
 * @route   POST /api/v1/clients
 * @desc    Register a new client application
 * @access  Private (JWT)
 */
router.post('/', [
  authMiddleware,
  body('name').notEmpty().withMessage('Client name is required'),
  body('redirectUris').isArray({ min: 1 }).withMessage('At least one redirect URI is required'),
  body('redirectUris.*').custom((value) => {
    // Allow localhost URLs for development
    const urlPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/.*)?$|^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/;
    if (!urlPattern.test(value)) {
      throw new Error('Invalid redirect URI format');
    }
    return true;
  }),
  body('allowedScopes').optional().isArray().withMessage('Allowed scopes must be an array'),
  body('defaultScopes').optional().isArray().withMessage('Default scopes must be an array'),
  body('skipConsent').optional().isBoolean().withMessage('skipConsent must be boolean'),
  body('isConfidential').optional().isBoolean().withMessage('isConfidential must be boolean'),
  body('logoUrl').optional().custom((value) => {
    if (!value) return true;
    const urlPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/.*)?$|^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/;
    if (!urlPattern.test(value)) {
      throw new Error('Logo URL must be valid');
    }
    return true;
  }),
  body('homepageUrl').optional().custom((value) => {
    if (!value) return true;
    const urlPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/.*)?$|^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/;
    if (!urlPattern.test(value)) {
      throw new Error('Homepage URL must be valid');
    }
    return true;
  }),
  body('privacyPolicyUrl').optional().custom((value) => {
    if (!value) return true;
    const urlPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/.*)?$|^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/;
    if (!urlPattern.test(value)) {
      throw new Error('Privacy policy URL must be valid');
    }
    return true;
  }),
  body('tosUrl').optional().custom((value) => {
    if (!value) return true;
    const urlPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/.*)?$|^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/;
    if (!urlPattern.test(value)) {
      throw new Error('Terms of service URL must be valid');
    }
    return true;
  }),
  body('defaultRedirectUrl').optional().custom((value) => {
    if (!value) return true;
    const urlPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/.*)?$|^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/;
    if (!urlPattern.test(value)) {
      throw new Error('Default redirect URL must be valid');
    }
    return true;
  }),
], clientApplicationController.createClient);

/**
 * @route   GET /api/v1/clients
 * @desc    List all client applications for authenticated user
 * @access  Private (JWT)
 */
router.get('/', [
  authMiddleware,
], clientApplicationController.listClients);

/**
 * @route   GET /api/v1/clients/:id
 * @desc    Get a specific client application
 * @access  Private (JWT)
 */
router.get('/:id', [
  authMiddleware,
], clientApplicationController.getClient);

/**
 * @route   PUT /api/v1/clients/:id
 * @desc    Update a client application
 * @access  Private (JWT)
 */
router.put('/:id', [
  authMiddleware,
  body('name').optional().notEmpty().withMessage('Client name cannot be empty'),
  body('redirectUris').optional().isArray({ min: 1 }).withMessage('At least one redirect URI is required'),
  body('redirectUris.*').optional().custom((value) => {
    // Allow localhost URLs for development
    const urlPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/.*)?$|^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/;
    if (!urlPattern.test(value)) {
      throw new Error('Invalid redirect URI format');
    }
    return true;
  }),
  body('allowedScopes').optional().isArray().withMessage('Allowed scopes must be an array'),
  body('defaultScopes').optional().isArray().withMessage('Default scopes must be an array'),
  body('skipConsent').optional().isBoolean().withMessage('skipConsent must be boolean'),
  body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
  body('logoUrl').optional().custom((value) => {
    if (!value) return true;
    const urlPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/.*)?$|^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/;
    if (!urlPattern.test(value)) {
      throw new Error('Logo URL must be valid');
    }
    return true;
  }),
  body('homepageUrl').optional().custom((value) => {
    if (!value) return true;
    const urlPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/.*)?$|^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/;
    if (!urlPattern.test(value)) {
      throw new Error('Homepage URL must be valid');
    }
    return true;
  }),
  body('privacyPolicyUrl').optional().custom((value) => {
    if (!value) return true;
    const urlPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/.*)?$|^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/;
    if (!urlPattern.test(value)) {
      throw new Error('Privacy policy URL must be valid');
    }
    return true;
  }),
  body('tosUrl').optional().custom((value) => {
    if (!value) return true;
    const urlPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/.*)?$|^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/;
    if (!urlPattern.test(value)) {
      throw new Error('Terms of service URL must be valid');
    }
    return true;
  }),
], clientApplicationController.updateClient);

/**
 * @route   DELETE /api/v1/clients/:id
 * @desc    Delete a client application
 * @access  Private (JWT)
 */
router.delete('/:id', [
  authMiddleware,
], clientApplicationController.deleteClient);

/**
 * @route   POST /api/v1/clients/:id/rotate-secret
 * @desc    Rotate client secret (generate new secret, invalidate old one)
 * @access  Private (JWT)
 */
router.post('/:id/rotate-secret', [
  authMiddleware,
], clientApplicationController.rotateClientSecret);

export default router;