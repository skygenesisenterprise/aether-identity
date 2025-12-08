"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPageController = void 0;
const database_1 = require("../config/database");
/**
 * Login Page Controller
 *
 * Ce contrôleur gère la fourniture de pages de login personnalisées
 * pour les applications clientes externes.
 */
class LoginPageController {
    constructor() {
        /**
         * GET /api/v1/auth/login-page
         *
         * Endpoint principal qui génère et sert une page de login HTML personnalisée
         * pour une application cliente spécifique.
         *
         * @param client_id - ID de l'application cliente
         * @param redirect_uri - URI de redirection après login
         * @param theme - Thème visuel (light, dark, auto)
         * @param lang - Langue de l'interface (fr, en, es, de)
         * @param embedded - Mode embedded pour iframe (true/false)
         * @param custom_css - URL de CSS personnalisé
         * @param custom_logo - URL de logo personnalisé
         */
        this.getLoginPage = async (req, res) => {
            try {
                const { client_id, redirect_uri, theme = 'auto', lang = 'fr', embedded = 'false', custom_css, custom_logo, state, scope, response_type = 'code' } = req.query;
                // Validation des paramètres requis
                if (!client_id) {
                    return this.sendErrorPage(res, 'missing_client', 'Client ID is required', { lang });
                }
                // Validation de l'application cliente
                const client = await database_1.prisma.clientApplication.findUnique({
                    where: { clientId: client_id }
                });
                if (!client || !client.isActive) {
                    return this.sendErrorPage(res, 'invalid_client', 'Client not found or inactive', { lang });
                }
                // Validation de l'URI de redirection si fournie
                let validRedirectUri = redirect_uri;
                if (redirect_uri) {
                    const allowedUris = JSON.parse(client.redirectUris);
                    if (!allowedUris.includes(redirect_uri)) {
                        return this.sendErrorPage(res, 'invalid_redirect', 'Redirect URI not allowed', { lang });
                    }
                }
                else {
                    validRedirectUri = client.defaultRedirectUrl;
                }
                // Génération de la page de login HTML
                const loginPageHtml = this.generateLoginPageHtml({
                    client: {
                        id: client.clientId,
                        name: client.name,
                        logo: custom_logo || client.logoUrl,
                        description: client.description
                    },
                    redirectUri: validRedirectUri,
                    theme: theme,
                    lang: lang,
                    embedded: embedded === 'true',
                    customCss: custom_css,
                    oauthParams: {
                        state: state,
                        scope: scope,
                        responseType: response_type
                    }
                });
                // En-têtes pour la sécurité et le cache
                res.setHeader('Content-Type', 'text/html; charset=utf-8');
                res.setHeader('X-Frame-Options', embedded === 'true' ? 'ALLOWALL' : 'DENY');
                res.setHeader('Content-Security-Policy', this.getCSP(embedded === 'true'));
                res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
                res.status(200).send(loginPageHtml);
            }
            catch (error) {
                console.error('Login page generation error:', error);
                this.sendErrorPage(res, 'server_error', 'Internal server error', { lang: 'fr' });
            }
        };
        /**
         * GET /api/v1/auth/login-config
         *
         * Endpoint qui fournit les données de configuration pour que
         * un frontend externe puisse afficher la page de login.
         */
        this.getLoginConfig = async (req, res) => {
            try {
                const { client_id, lang = 'fr' } = req.query;
                if (!client_id) {
                    res.status(400).json({
                        error: 'missing_client',
                        error_description: 'Client ID is required'
                    });
                    return;
                }
                const client = await database_1.prisma.clientApplication.findUnique({
                    where: { clientId: client_id }
                });
                if (!client || !client.isActive) {
                    res.status(404).json({
                        error: 'invalid_client',
                        error_description: 'Client not found or inactive'
                    });
                    return;
                }
                const config = {
                    client: {
                        id: client.clientId,
                        name: client.name,
                        logo: client.logoUrl,
                        description: client.description,
                        theme: client.theme || 'auto',
                        primaryColor: client.primaryColor || '#000000',
                        secondaryColor: client.secondaryColor || '#ffffff'
                    },
                    oauth: {
                        authorizationUrl: `${req.protocol}://${req.get('host')}/api/v1/auth/authorize`,
                        scopes: JSON.parse(client.allowedScopes),
                        defaultScopes: JSON.parse(client.defaultScopes),
                        grantTypes: ['authorization_code', 'refresh_token'],
                        responseTypes: ['code'],
                        pkce: true
                    },
                    ui: {
                        themes: ['light', 'dark', 'auto'],
                        languages: ['fr', 'en', 'es', 'de'],
                        features: {
                            socialLogin: false,
                            rememberMe: true,
                            passwordReset: true,
                            mfa: true,
                            registration: client.allowRegistration || false
                        }
                    },
                    security: {
                        passwordPolicy: {
                            minLength: 6,
                            requireUppercase: false,
                            requireLowercase: false,
                            requireNumbers: false,
                            requireSpecialChars: false
                        },
                        rateLimit: {
                            maxAttempts: 5,
                            windowMinutes: 15
                        }
                    },
                    endpoints: {
                        login: `${req.protocol}://${req.get('host')}/api/v1/auth/login`,
                        register: `${req.protocol}://${req.get('host')}/api/v1/auth/register`,
                        forgotPassword: `${req.protocol}://${req.get('host')}/api/v1/auth/forgot-password`,
                        token: `${req.protocol}://${req.get('host')}/api/v1/auth/token`,
                        userinfo: `${req.protocol}://${req.get('host')}/api/v1/auth/userinfo`
                    }
                };
                res.status(200).json({
                    success: true,
                    data: config
                });
                return;
            }
            catch (error) {
                console.error('Login config error:', error);
                res.status(500).json({
                    error: 'server_error',
                    error_description: 'Internal server error'
                });
            }
        };
        /**
         * GET /api/v1/auth/login-embed
         *
         * Endpoint spécialisé pour l'intégration en iframe
         * avec des optimisations pour les embedded views.
         */
        this.getLoginEmbed = async (req, res) => {
            try {
                const { client_id, redirect_uri, theme = 'auto', lang = 'fr', width = '400', height = '600' } = req.query;
                // Validation du client
                const client = await database_1.prisma.clientApplication.findUnique({
                    where: { clientId: client_id }
                });
                if (!client || !client.isActive) {
                    res.status(404).json({
                        error: 'invalid_client',
                        error_description: 'Client not found or inactive'
                    });
                    return;
                }
                // Génération de la page embed optimisée
                const embedHtml = this.generateEmbedHtml({
                    client: {
                        id: client.clientId,
                        name: client.name,
                        logo: client.logoUrl
                    },
                    redirectUri: redirect_uri,
                    theme: theme,
                    lang: lang,
                    dimensions: { width: width, height: height }
                });
                res.setHeader('Content-Type', 'text/html; charset=utf-8');
                res.setHeader('X-Frame-Options', 'ALLOWALL');
                res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
                res.status(200).send(embedHtml);
            }
            catch (error) {
                console.error('Login embed error:', error);
                res.status(500).json({
                    error: 'server_error',
                    error_description: 'Internal server error'
                });
            }
        };
        /**
         * POST /api/v1/auth/login-validate
         *
         * Endpoint de validation pour les formulaires de login externes
         * avec réponses JSON pour les applications SPA/mobile.
         */
        this.validateLogin = async (req, res) => {
            try {
                const { email, password, client_id, remember_me = false } = req.body;
                if (!email || !password || !client_id) {
                    res.status(400).json({
                        error: 'invalid_request',
                        error_description: 'Missing required parameters'
                    });
                    return;
                }
                // Validation du client
                const client = await database_1.prisma.clientApplication.findUnique({
                    where: { clientId: client_id }
                });
                if (!client || !client.isActive) {
                    res.status(404).json({
                        error: 'invalid_client',
                        error_description: 'Client not found or inactive'
                    });
                    return;
                }
                // Logique d'authentification (réutiliser le code existant)
                // TODO: Intégrer avec la logique d'authentification existante
                res.status(200).json({
                    success: true,
                    data: {
                        requires_mfa: false,
                        redirect_url: `${client.defaultRedirectUrl}?code=auth_code_here&state=${req.body.state}`
                    }
                });
                return;
            }
            catch (error) {
                console.error('Login validation error:', error);
                res.status(500).json({
                    error: 'server_error',
                    error_description: 'Internal server error'
                });
            }
        };
    }
    /**
     * Génération du HTML de la page de login
     */
    generateLoginPageHtml(params) {
        const { client, theme, lang, embedded, customCss, oauthParams } = params;
        return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion - ${client.name}</title>
    
    <!-- Styles de base -->
    <style>
        :root {
            --primary-color: #000000;
            --secondary-color: #ffffff;
            --background-color: #ffffff;
            --text-color: #000000;
            --border-color: #e5e7eb;
            --error-color: #ef4444;
            --success-color: #10b981;
        }

        [data-theme="dark"] {
            --background-color: #000000;
            --text-color: #ffffff;
            --border-color: #374151;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: var(--background-color);
            color: var(--text-color);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .login-container {
            width: 100%;
            max-width: 400px;
            background: var(--background-color);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 32px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .client-header {
            text-align: center;
            margin-bottom: 32px;
        }

        .client-logo {
            width: 64px;
            height: 64px;
            border-radius: 12px;
            margin-bottom: 16px;
        }

        .client-name {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 8px;
        }

        .client-description {
            color: #6b7280;
            font-size: 14px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            font-size: 14px;
        }

        .form-input {
            width: 100%;
            padding: 12px;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            font-size: 16px;
            background: var(--background-color);
            color: var(--text-color);
            transition: border-color 0.2s;
        }

        .form-input:focus {
            outline: none;
            border-color: var(--primary-color);
        }

        .login-button {
            width: 100%;
            padding: 12px;
            background: var(--primary-color);
            color: var(--secondary-color);
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: opacity 0.2s;
        }

        .login-button:hover {
            opacity: 0.9;
        }

        .login-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .error-message {
            color: var(--error-color);
            font-size: 14px;
            margin-top: 8px;
            display: none;
        }

        .security-info {
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid var(--border-color);
            text-align: center;
            font-size: 12px;
            color: #6b7280;
        }

        ${embedded ? `
        body {
            padding: 0;
            background: transparent;
        }
        .login-container {
            box-shadow: none;
            border: none;
        }
        ` : ''}
    </style>

    <!-- CSS personnalisé si fourni -->
    ${customCss ? `<link rel="stylesheet" href="${customCss}">` : ''}
</head>
<body data-theme="${theme}">
    <div class="login-container">
        <div class="client-header">
            ${client.logo ? `<img src="${client.logo}" alt="${client.name}" class="client-logo">` : ''}
            <h1 class="client-name">Connexion</h1>
            <p class="client-description">
                Utilisez votre compte Aether Identity pour accéder à ${client.name}
            </p>
        </div>

        <form id="loginForm" onsubmit="handleLogin(event)">
            <div class="form-group">
                <label for="email" class="form-label">Email</label>
                <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    class="form-input" 
                    required 
                    autocomplete="email"
                    placeholder="vous@exemple.com"
                />
            </div>

            <div class="form-group">
                <label for="password" class="form-label">Mot de passe</label>
                <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    class="form-input" 
                    required 
                    autocomplete="current-password"
                    placeholder="••••••••"
                />
            </div>

            <div class="error-message" id="errorMessage"></div>

            <button type="submit" class="login-button" id="loginButton">
                Se connecter
            </button>
        </form>

        <div class="security-info">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
            </svg>
            Connexion sécurisée via Aether Identity
        </div>
    </div>

    <script>
        // Configuration OAuth2
        const oauthConfig = {
            clientId: '${client.id}',
            redirectUri: '${params.redirectUri}',
            state: '${oauthParams.state || ''}',
            scope: '${oauthParams.scope || 'openid profile email'}',
            responseType: '${oauthParams.responseType}'
        };

        // Gestion de la soumission du formulaire
        async function handleLogin(event) {
            event.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const button = document.getElementById('loginButton');
            const errorDiv = document.getElementById('errorMessage');
            
            // Désactiver le bouton et afficher le chargement
            button.disabled = true;
            button.textContent = 'Connexion en cours...';
            errorDiv.style.display = 'none';
            
            try {
                // Appel à l'API de validation
                const response = await fetch('/api/v1/auth/login-validate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        password,
                        client_id: oauthConfig.clientId,
                        state: oauthConfig.state
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Redirection vers l'application cliente
                    window.location.href = result.data.redirect_url;
                } else {
                    throw new Error(result.error_description || 'Login failed');
                }
                
            } catch (error) {
                errorDiv.textContent = error.message || 'Erreur de connexion';
                errorDiv.style.display = 'block';
                button.disabled = false;
                button.textContent = 'Se connecter';
            }
        }

        // Détection du thème
        function detectTheme() {
            const savedTheme = localStorage.getItem('theme') || '${theme}';
            if (savedTheme === 'auto') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.body.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
            } else {
                document.body.setAttribute('data-theme', savedTheme);
            }
        }

        // Initialisation
        detectTheme();
        
        // Écouter les changements de préférence de thème
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', detectTheme);
        }
    </script>
</body>
</html>`;
    }
    /**
     * Génération du HTML pour l'embed iframe
     */
    generateEmbedHtml(params) {
        const { client, dimensions } = params;
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${client.name} Login</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: transparent;
        }
        .embed-container {
            width: ${dimensions.width}px;
            height: ${dimensions.height}px;
            border: none;
            overflow: hidden;
        }
        .embed-frame {
            width: 100%;
            height: 100%;
            border: none;
        }
    </style>
</head>
<body>
    <div class="embed-container">
        <iframe 
            src="/api/v1/auth/login-page?client_id=${client.id}&redirect_uri=${params.redirectUri}&theme=${params.theme}&lang=${params.lang}&embedded=true"
            class="embed-frame"
            frameborder="0"
            allowtransparency="true"
        ></iframe>
    </div>
    
    <script>
        // Communication parent-iframe pour les redirigations
        window.addEventListener('message', function(event) {
            if (event.data.type === 'LOGIN_SUCCESS') {
                // Notifier le parent de la connexion réussie
                window.parent.postMessage({
                    type: 'LOGIN_SUCCESS',
                    data: event.data.data
                }, '*');
            }
        });
    </script>
</body>
</html>`;
    }
    /**
     * Génération de la CSP (Content Security Policy)
     */
    getCSP(embedded) {
        const basePolicies = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "font-src 'self'",
            "connect-src 'self'"
        ];
        if (embedded) {
            basePolicies.push("frame-ancestors *");
        }
        else {
            basePolicies.push("frame-ancestors 'none'");
        }
        return basePolicies.join('; ');
    }
    /**
     * Envoi d'une page d'erreur
     */
    sendErrorPage(res, errorCode, errorMessage, options = {}) {
        const { lang = 'fr' } = options;
        const errorMessages = {
            fr: {
                missing_client: 'Client ID manquant',
                invalid_client: 'Client non trouvé ou inactif',
                invalid_redirect: 'URI de redirection non autorisée',
                server_error: 'Erreur serveur interne'
            },
            en: {
                missing_client: 'Missing Client ID',
                invalid_client: 'Client not found or inactive',
                invalid_redirect: 'Unauthorized redirect URI',
                server_error: 'Internal server error'
            }
        };
        const messages = errorMessages[lang] || errorMessages.fr;
        const message = messages[errorCode] || errorMessage;
        const errorHtml = `
<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Erreur - Aether Identity</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f3f4f6;
            color: #1f2937;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
        }
        .error-container {
            background: white;
            border-radius: 12px;
            padding: 32px;
            text-align: center;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            max-width: 400px;
        }
        .error-icon {
            color: #ef4444;
            font-size: 48px;
            margin-bottom: 16px;
        }
        .error-title {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 8px;
        }
        .error-message {
            color: #6b7280;
            margin-bottom: 24px;
        }
        .back-button {
            background: #000000;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            display: inline-block;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="error-container">
        <div class="error-icon">⚠️</div>
        <h1 class="error-title">Erreur de connexion</h1>
        <p class="error-message">${message}</p>
        <a href="javascript:history.back()" class="back-button">Retour</a>
    </div>
</body>
</html>`;
        res.status(400).header('Content-Type', 'text/html').send(errorHtml);
    }
}
exports.LoginPageController = LoginPageController;
