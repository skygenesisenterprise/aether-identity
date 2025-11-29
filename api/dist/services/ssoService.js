"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ssoService = exports.SSOService = void 0;
const database_1 = require("../config/database");
const tokenService_1 = require("./tokenService");
const crypto_1 = __importDefault(require("crypto"));
const uuid_1 = require("uuid");
class SSOService {
    constructor() {
        this.identityBaseUrl = 'https://sso.skygenesisenterprise.com';
        this.apiBaseUrl = 'https://api.skygenesisenterprise.com';
    }
    /**
     * Handle SSO authorization request - broker between API and Identity
     */
    async authorize(request, httpRequest) {
        // Validate client application
        const client = await this.validateClient(request.client_id);
        // Determine final redirect URI with priority order
        const finalRedirectUri = this.determineRedirectUri(client, request);
        // Validate scopes
        const validatedScopes = this.validateScopes(client, request.scope);
        // Create authorization session
        const authSession = await this.createAuthSession(client, request, finalRedirectUri, validatedScopes);
        // Check if user has existing Identity session
        const existingSession = await this.checkExistingSession(httpRequest);
        if (existingSession) {
            // User already authenticated - seamless SSO
            return this.handleExistingSession(existingSession, authSession, client);
        }
        else {
            // User needs to authenticate - redirect to Identity
            return this.redirectToIdentity(authSession, client);
        }
    }
    /**
     * Exchange authorization code for tokens
     */
    async exchangeToken(request) {
        // Validate client
        const client = await this.validateClient(request.client_id);
        // Verify authorization code
        const authData = tokenService_1.tokenService.verifyAuthorizationCode(request.code);
        // Validate auth session
        const authSession = await this.getAuthSession(authData.sessionId);
        if (!authSession || authSession.isCompleted) {
            throw new Error('Invalid or expired authorization session');
        }
        // Verify PKCE if present
        if (authSession.codeChallenge) {
            if (!request.code_verifier) {
                throw new Error('Code verifier required');
            }
            this.verifyPKCE(authSession.codeChallenge, authSession.codeChallengeMethod, request.code_verifier);
        }
        // Get user data
        const user = await database_1.prisma.user.findUnique({
            where: { id: authSession.userId },
            include: {
                profile: true,
                memberships: {
                    include: { organization: true }
                }
            }
        });
        if (!user || user.status !== 'ACTIVE') {
            throw new Error('User not found or inactive');
        }
        // Generate tokens
        const accessToken = tokenService_1.tokenService.generateAccessToken(user);
        const refreshToken = tokenService_1.tokenService.generateRefreshToken(user);
        const idToken = tokenService_1.tokenService.generateIdToken(user, client.clientId);
        // Mark auth session as completed
        await database_1.prisma.authSession.update({
            where: { id: authSession.id },
            data: { isCompleted: true }
        });
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            id_token: idToken,
            token_type: 'Bearer',
            expires_in: 900, // 15 minutes
            scope: authSession.scope
        };
    }
    /**
     * Refresh access token
     */
    async refreshToken(refreshToken) {
        // Verify refresh token
        const claims = tokenService_1.tokenService.verifyRefreshToken(refreshToken);
        // Get user data
        const user = await database_1.prisma.user.findUnique({
            where: { id: claims.sub },
            include: {
                profile: true,
                memberships: {
                    include: { organization: true }
                }
            }
        });
        if (!user || user.status !== 'ACTIVE') {
            throw new Error('User not found or inactive');
        }
        // Generate new tokens
        const newAccessToken = tokenService_1.tokenService.generateAccessToken(user);
        const newRefreshToken = tokenService_1.tokenService.generateRefreshToken(user);
        return {
            access_token: newAccessToken,
            refresh_token: newRefreshToken,
            token_type: 'Bearer',
            expires_in: 900
        };
    }
    /**
     * Handle SSO logout
     */
    async logout(accessToken) {
        try {
            // Verify access token and get user info
            const claims = tokenService_1.tokenService.verifyAccessToken(accessToken);
            // Create logout session for tracking
            const logoutId = (0, uuid_1.v4)();
            // Redirect to Identity for session logout
            const identityLogoutUrl = new URL(`${this.identityBaseUrl}/api/v1/oauth/logout`);
            identityLogoutUrl.searchParams.set('user_id', claims.sub);
            identityLogoutUrl.searchParams.set('logout_id', logoutId);
            identityLogoutUrl.searchParams.set('redirect_uri', `${this.apiBaseUrl}/api/v1/auth/sso/logout/callback`);
            return { identityLogoutUrl: identityLogoutUrl.toString() };
        }
        catch (error) {
            // If token verification fails, still redirect to Identity
            const identityLogoutUrl = new URL(`${this.identityBaseUrl}/api/v1/oauth/logout`);
            identityLogoutUrl.searchParams.set('redirect_uri', `${this.apiBaseUrl}/api/v1/auth/sso/logout/callback`);
            return { identityLogoutUrl: identityLogoutUrl.toString() };
        }
    }
    /**
     * Validate client application
     */
    async validateClient(clientId) {
        const client = await database_1.prisma.clientApplication.findUnique({
            where: { clientId }
        });
        if (!client || !client.isActive) {
            throw new Error('Invalid or inactive client');
        }
        return client;
    }
    /**
     * Determine redirect URI with priority order
     */
    determineRedirectUri(client, request) {
        // Priority 1: final_redirect_url (dynamic)
        if (request.final_redirect_url) {
            try {
                new URL(request.final_redirect_url);
                return request.final_redirect_url;
            }
            catch {
                throw new Error('Invalid final redirect URL format');
            }
        }
        // Priority 2: redirect_uri (OAuth2 standard)
        if (request.redirect_uri) {
            const allowedUris = JSON.parse(client.redirectUris);
            if (!allowedUris.includes(request.redirect_uri)) {
                throw new Error('Redirect URI not allowed');
            }
            return request.redirect_uri;
        }
        // Priority 3: client.defaultRedirectUrl (fallback)
        if (client.defaultRedirectUrl) {
            return client.defaultRedirectUrl;
        }
        throw new Error('No redirect URI specified');
    }
    /**
     * Validate and normalize scopes
     */
    validateScopes(client, requestedScopes) {
        const allowedScopes = JSON.parse(client.allowedScopes);
        const defaultScopes = JSON.parse(client.defaultScopes);
        if (!requestedScopes) {
            return defaultScopes;
        }
        const scopes = requestedScopes.split(' ').filter(s => s);
        const validScopes = scopes.filter(s => allowedScopes.includes(s));
        return validScopes.length > 0 ? validScopes : defaultScopes;
    }
    /**
     * Create authorization session
     */
    async createAuthSession(client, request, redirectUri, scopes) {
        const sessionId = (0, uuid_1.v4)();
        const authCode = crypto_1.default.randomBytes(32).toString('hex');
        return await database_1.prisma.authSession.create({
            data: {
                id: (0, uuid_1.v4)(),
                sessionId,
                clientId: client.id,
                userId: '', // Will be set after authentication
                state: request.state,
                redirectUri: request.redirect_uri || client.defaultRedirectUrl || '',
                finalRedirectUrl: request.final_redirect_url,
                scope: scopes.join(' '),
                responseType: request.response_type,
                codeChallenge: request.code_challenge,
                codeChallengeMethod: request.code_challenge_method,
                authCode,
                authCodeExpiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
            }
        });
    }
    /**
     * Check for existing Identity session
     */
    async checkExistingSession(req) {
        try {
            // In a real implementation, this would:
            // 1. Extract AETHER_IDENTITY_SESSION cookie from request
            // 2. Make API call to Identity service to validate session
            // 3. Return user session data if valid
            // For demo purposes, we'll simulate this check
            // In production, this would be an HTTP call to Identity service
            if (!req) {
                return null; // No request provided, can't check session
            }
            const sessionCookie = req.cookies?.AETHER_IDENTITY_SESSION;
            if (!sessionCookie) {
                return null; // No Identity session cookie
            }
            // In production, make HTTP call to Identity service:
            // const response = await fetch('https://sso.skygenesisenterprise.com/api/v1/session/validate', {
            //   method: 'POST',
            //   headers: {
            //     'Cookie': `AETHER_IDENTITY_SESSION=${sessionCookie}`
            //   }
            // });
            // const sessionData = await response.json();
            // For demo, return null to simulate no existing session
            return null;
        }
        catch (error) {
            console.error('Session check error:', error);
            return null;
        }
    }
    /**
     * Handle existing session - seamless SSO
     */
    async handleExistingSession(sessionData, authSession, client) {
        // Update auth session with user info
        await database_1.prisma.authSession.update({
            where: { id: authSession.id },
            data: {
                userId: sessionData.userId,
                isCompleted: true
            }
        });
        // Get user for token generation
        const user = await database_1.prisma.user.findUnique({
            where: { id: sessionData.userId },
            include: {
                profile: true,
                memberships: { include: { organization: true } }
            }
        });
        if (!user) {
            throw new Error('User not found');
        }
        // Generate tokens
        const accessToken = tokenService_1.tokenService.generateAccessToken(user);
        const refreshToken = tokenService_1.tokenService.generateRefreshToken(user);
        const idToken = tokenService_1.tokenService.generateIdToken(user, client.clientId);
        // Create authorization code with tokens
        const codeData = {
            sessionId: authSession.sessionId,
            tokens: { accessToken, refreshToken, idToken },
            scope: authSession.scope,
            timestamp: Date.now()
        };
        const authCode = tokenService_1.tokenService.generateAuthorizationCode(codeData);
        // Build redirect URL with authorization code
        const redirectUrl = new URL(authSession.finalRedirectUrl || authSession.redirectUri);
        redirectUrl.searchParams.set('code', authCode);
        redirectUrl.searchParams.set('state', authSession.state || '');
        return { redirectUrl: redirectUrl.toString() };
    }
    /**
     * Redirect to Identity for authentication
     */
    async redirectToIdentity(authSession, client) {
        // Build Identity authorization URL
        const identityUrl = new URL(`${this.identityBaseUrl}/api/v1/oauth/authorize`);
        identityUrl.searchParams.set('session_id', authSession.sessionId);
        identityUrl.searchParams.set('client_id', client.clientId);
        identityUrl.searchParams.set('redirect_uri', authSession.finalRedirectUrl || authSession.redirectUri);
        identityUrl.searchParams.set('response_type', authSession.responseType);
        identityUrl.searchParams.set('scope', authSession.scope);
        identityUrl.searchParams.set('api_callback', `${this.apiBaseUrl}/api/v1/auth/sso/callback`);
        if (authSession.state) {
            identityUrl.searchParams.set('state', authSession.state);
        }
        return { redirectUrl: identityUrl.toString() };
    }
    /**
     * Get authorization session
     */
    async getAuthSession(sessionId) {
        return await database_1.prisma.authSession.findUnique({
            where: { sessionId }
        });
    }
    /**
     * Verify PKCE code challenge
     */
    verifyPKCE(codeChallenge, codeChallengeMethod, codeVerifier) {
        let hash;
        if (codeChallengeMethod === 'S256') {
            hash = crypto_1.default.createHash('sha256').update(codeVerifier).digest('base64url');
        }
        else if (codeChallengeMethod === 'plain') {
            hash = codeVerifier;
        }
        else {
            throw new Error('Unsupported code challenge method');
        }
        if (hash !== codeChallenge) {
            throw new Error('Invalid code verifier');
        }
    }
}
exports.SSOService = SSOService;
exports.ssoService = new SSOService();
