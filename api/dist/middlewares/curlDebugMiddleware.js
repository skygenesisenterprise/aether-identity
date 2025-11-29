"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.curlNotFoundMiddleware = exports.curlResponseMiddleware = exports.curlDebugMiddleware = void 0;
const uuid_1 = require("uuid");
/**
 * Middleware pour détecter les requêtes curl et ajouter des informations de debugging
 */
const curlDebugMiddleware = (req, res, next) => {
    const userAgent = req.headers['user-agent'] || '';
    if (userAgent.includes('curl')) {
        // Générer un ID de requête unique
        const requestId = req.headers['x-request-id'] || (0, uuid_1.v4)();
        // Ajouter des headers personnalisés pour curl
        res.setHeader('X-API-Version', '1.0.0');
        res.setHeader('X-Request-ID', requestId);
        res.setHeader('X-Debug-Timestamp', new Date().toISOString());
        // Logger la requête curl pour debugging
        console.log(`🔍 CURL Request: ${req.method} ${req.path} (ID: ${requestId})`);
        // Ajouter un flag pour les autres middlewares
        req.isCurl = true;
    }
    next();
};
exports.curlDebugMiddleware = curlDebugMiddleware;
/**
 * Middleware pour enrichir les réponses avec des informations de debug pour curl
 */
const curlResponseMiddleware = (req, res, next) => {
    const userAgent = req.headers['user-agent'] || '';
    if (userAgent.includes('curl')) {
        // Headers informatifs pour curl
        res.setHeader('X-API-Info', JSON.stringify({
            service: 'Aether Identity SSO',
            version: '1.0.0',
            environment: process.env.NODE_ENV || 'development',
            endpoint: req.path,
            method: req.method,
            timestamp: new Date().toISOString()
        }));
        res.setHeader('X-Curl-Help', 'Use -v for verbose output, see headers for debug info');
    }
    next();
};
exports.curlResponseMiddleware = curlResponseMiddleware;
/**
 * Génère la liste des routes disponibles selon le contexte
 */
function getAvailableRoutes(currentPath) {
    const baseRoutes = [
        'POST /api/v1/auth/login',
        'POST /api/v1/auth/register',
        'GET /api/v1/auth/authorize',
        'POST /api/v1/auth/token',
        'GET /api/v1/auth/userinfo',
        'POST /api/v1/clients',
        'GET /api/v1/accounts',
        'GET /api/v1/api-tokens',
        'GET /health'
    ];
    // Si l'utilisateur cherche une route spécifique, suggérer des alternatives
    if (currentPath.includes('account')) {
        return [
            'GET /api/v1/accounts',
            'POST /api/v1/auth/login',
            'POST /api/v1/auth/register'
        ];
    }
    if (currentPath.includes('auth')) {
        return [
            'POST /api/v1/auth/login',
            'POST /api/v1/auth/register',
            'GET /api/v1/auth/authorize',
            'POST /api/v1/auth/token'
        ];
    }
    return baseRoutes;
}
/**
 * Middleware pour gérer les 404 avec des informations utiles pour curl
 */
const curlNotFoundMiddleware = (req, res) => {
    const isCurl = req.isCurl || req.headers['user-agent']?.includes('curl');
    if (isCurl) {
        res.status(404).json({
            error: 'Route not found',
            curl_help: {
                message: '🎯 This endpoint does not exist. Here are the available endpoints:',
                available_endpoints: getAvailableRoutes(req.path),
                example_usage: [
                    'curl -X POST https://sso.skygenesisenterprise.net/api/v1/auth/register -H "Content-Type: application/json" -d \'{"email":"test@example.com","password":"password123","fullName":"Test User"}\'',
                    'curl -X POST https://sso.skygenesisenterprise.net/api/v1/auth/login -H "Content-Type: application/json" -d \'{"email":"test@example.com","password":"password123"}\'',
                    'curl -X GET "https://sso.skygenesisenterprise.net/api/v1/auth/authorize?client_id=demo&redirect_uri=https://example.com/callback&response_type=code&state=xyz123"',
                    'curl -X GET https://sso.skygenesisenterprise.net/api/v1/debug/curl'
                ],
                debug_endpoint: 'GET /api/v1/debug/curl for complete API documentation',
                health_check: 'curl -I https://sso.skygenesisenterprise.net/health'
            },
            request_info: {
                path: req.originalUrl,
                method: req.method,
                timestamp: new Date().toISOString()
            }
        });
    }
    else {
        // Réponse 404 standard pour navigateurs
        res.status(404).json({
            error: 'Route not found',
            path: req.originalUrl,
            method: req.method,
        });
    }
};
exports.curlNotFoundMiddleware = curlNotFoundMiddleware;
