import { Router } from 'express';
import { LoginPageController } from '../controllers/loginPageController';

const router = Router();
const loginPageController = new LoginPageController();

/**
 * @route   GET /api/v1/auth/login-page
 * @desc    Endpoint principal pour générer et servir une page de login HTML personnalisée
 * @access  Public
 */
router.get('/login-page', loginPageController.getLoginPage);

/**
 * @route   GET /api/v1/auth/login-config
 * @desc    Endpoint qui fournit les données de configuration pour un frontend externe
 * @access  Public
 */
router.get('/login-config', loginPageController.getLoginConfig);

/**
 * @route   GET /api/v1/auth/login-embed
 * @desc    Endpoint spécialisé pour l'intégration en iframe avec optimisations
 * @access  Public
 */
router.get('/login-embed', loginPageController.getLoginEmbed);

/**
 * @route   POST /api/v1/auth/login-validate
 * @desc    Endpoint de validation pour les formulaires de login externes avec réponses JSON
 * @access  Public
 */
router.post('/login-validate', loginPageController.validateLogin);

export default router;