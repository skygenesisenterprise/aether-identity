"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const clientApplicationControllers_1 = require("../controllers/clientApplicationControllers");
const authMiddlewares_1 = require("../middlewares/authMiddlewares");
const router = (0, express_1.Router)();
const clientApplicationController = new clientApplicationControllers_1.ClientApplicationController();
/**
 * @route   POST /api/v1/clients
 * @desc    Register a new client application
 * @access  Private (JWT)
 */
router.post('/', [
    authMiddlewares_1.authMiddleware,
    (0, express_validator_1.body)('name').notEmpty().withMessage('Client name is required'),
    (0, express_validator_1.body)('redirectUris').isArray({ min: 1 }).withMessage('At least one redirect URI is required'),
    (0, express_validator_1.body)('redirectUris.*').isURL().withMessage('All redirect URIs must be valid URLs'),
    (0, express_validator_1.body)('allowedScopes').optional().isArray().withMessage('Allowed scopes must be an array'),
    (0, express_validator_1.body)('defaultScopes').optional().isArray().withMessage('Default scopes must be an array'),
    (0, express_validator_1.body)('skipConsent').optional().isBoolean().withMessage('skipConsent must be boolean'),
    (0, express_validator_1.body)('isConfidential').optional().isBoolean().withMessage('isConfidential must be boolean'),
    (0, express_validator_1.body)('logoUrl').optional().isURL().withMessage('Logo URL must be valid'),
    (0, express_validator_1.body)('homepageUrl').optional().isURL().withMessage('Homepage URL must be valid'),
    (0, express_validator_1.body)('privacyPolicyUrl').optional().isURL().withMessage('Privacy policy URL must be valid'),
    (0, express_validator_1.body)('tosUrl').optional().isURL().withMessage('Terms of service URL must be valid'),
], clientApplicationController.createClient);
/**
 * @route   GET /api/v1/clients
 * @desc    List all client applications for authenticated user
 * @access  Private (JWT)
 */
router.get('/', [
    authMiddlewares_1.authMiddleware,
], clientApplicationController.listClients);
/**
 * @route   GET /api/v1/clients/:id
 * @desc    Get a specific client application
 * @access  Private (JWT)
 */
router.get('/:id', [
    authMiddlewares_1.authMiddleware,
], clientApplicationController.getClient);
/**
 * @route   PUT /api/v1/clients/:id
 * @desc    Update a client application
 * @access  Private (JWT)
 */
router.put('/:id', [
    authMiddlewares_1.authMiddleware,
    (0, express_validator_1.body)('name').optional().notEmpty().withMessage('Client name cannot be empty'),
    (0, express_validator_1.body)('redirectUris').optional().isArray({ min: 1 }).withMessage('At least one redirect URI is required'),
    (0, express_validator_1.body)('redirectUris.*').optional().isURL().withMessage('All redirect URIs must be valid URLs'),
    (0, express_validator_1.body)('allowedScopes').optional().isArray().withMessage('Allowed scopes must be an array'),
    (0, express_validator_1.body)('defaultScopes').optional().isArray().withMessage('Default scopes must be an array'),
    (0, express_validator_1.body)('skipConsent').optional().isBoolean().withMessage('skipConsent must be boolean'),
    (0, express_validator_1.body)('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
    (0, express_validator_1.body)('logoUrl').optional().isURL().withMessage('Logo URL must be valid'),
    (0, express_validator_1.body)('homepageUrl').optional().isURL().withMessage('Homepage URL must be valid'),
    (0, express_validator_1.body)('privacyPolicyUrl').optional().isURL().withMessage('Privacy policy URL must be valid'),
    (0, express_validator_1.body)('tosUrl').optional().isURL().withMessage('Terms of service URL must be valid'),
], clientApplicationController.updateClient);
/**
 * @route   DELETE /api/v1/clients/:id
 * @desc    Delete a client application
 * @access  Private (JWT)
 */
router.delete('/:id', [
    authMiddlewares_1.authMiddleware,
], clientApplicationController.deleteClient);
/**
 * @route   POST /api/v1/clients/:id/rotate-secret
 * @desc    Rotate client secret (generate new secret, invalidate old one)
 * @access  Private (JWT)
 */
router.post('/:id/rotate-secret', [
    authMiddlewares_1.authMiddleware,
], clientApplicationController.rotateClientSecret);
exports.default = router;
