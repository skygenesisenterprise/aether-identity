"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenService = exports.TokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
class TokenService {
    constructor() {
        this.accessTokenExpiry = '15m';
        this.refreshTokenExpiry = '30d';
        this.idTokenExpiry = '15m';
        this.issuer = 'https://sso.skygenesisenterprise.com';
        this.audience = 'api.skygenesisenterprise.com';
        this.privateKey = '';
        this.publicKey = '';
    }
    /**
     * Generate OAuth2/OIDC compliant access token
     */
    generateAccessToken(user, additionalClaims = {}) {
        const now = Math.floor(Date.now() / 1000);
        const claims = {
            sub: user.id,
            email: user.email,
            role: user.role,
            scope: this.getUserScopes(user),
            permissions: this.getUserPermissions(user.role),
            organization_id: user.memberships?.[0]?.organizationId,
            tenant_id: user.memberships?.[0]?.organizationId,
            plan: this.getUserPlan(user),
            iss: this.issuer,
            aud: this.audience,
            iat: now,
            exp: now + this.parseExpiry(this.accessTokenExpiry),
            ...additionalClaims
        };
        const options = {
            expiresIn: this.accessTokenExpiry,
            algorithm: 'RS256',
            keyid: this.getKeyId()
        };
        return jsonwebtoken_1.default.sign(claims, this.getPrivateKey(), options);
    }
    /**
     * Generate OAuth2/OIDC compliant ID token
     */
    generateIdToken(user, clientId, nonce) {
        const now = Math.floor(Date.now() / 1000);
        const claims = {
            sub: user.id,
            email: user.email,
            name: user.profile?.firstName && user.profile?.lastName
                ? `${user.profile.firstName} ${user.profile.lastName}`
                : user.email,
            picture: user.profile?.avatar,
            email_verified: user.emailVerified || false,
            role: user.role,
            organization_id: user.memberships?.[0]?.organizationId,
            tenant_id: user.memberships?.[0]?.organizationId,
            plan: this.getUserPlan(user),
            iss: this.issuer,
            aud: clientId,
            iat: now,
            exp: now + this.parseExpiry(this.idTokenExpiry)
        };
        if (nonce) {
            claims.nonce = nonce;
        }
        const options = {
            expiresIn: this.idTokenExpiry,
            algorithm: 'RS256',
            keyid: this.getKeyId()
        };
        return jsonwebtoken_1.default.sign(claims, this.getPrivateKey(), options);
    }
    /**
     * Generate refresh token
     */
    generateRefreshToken(user) {
        const now = Math.floor(Date.now() / 1000);
        const jti = crypto_1.default.randomUUID();
        const claims = {
            sub: user.id,
            type: 'refresh',
            iat: now,
            exp: now + this.parseExpiry(this.refreshTokenExpiry),
            jti
        };
        const options = {
            expiresIn: this.refreshTokenExpiry,
            algorithm: 'RS256',
            keyid: this.getKeyId(),
            jwtid: jti
        };
        return jsonwebtoken_1.default.sign(claims, this.getPrivateKey(), options);
    }
    /**
     * Verify access token
     */
    verifyAccessToken(token) {
        const options = {
            algorithms: ['RS256'],
            issuer: this.issuer,
            audience: this.audience
        };
        return jsonwebtoken_1.default.verify(token, this.getPublicKey(), options);
    }
    /**
     * Verify ID token
     */
    verifyIdToken(token, clientId) {
        const options = {
            algorithms: ['RS256'],
            issuer: this.issuer
        };
        if (clientId) {
            options.audience = clientId;
        }
        return jsonwebtoken_1.default.verify(token, this.getPublicKey(), options);
    }
    /**
     * Verify refresh token
     */
    verifyRefreshToken(token) {
        const options = {
            algorithms: ['RS256'],
            issuer: this.issuer
        };
        const decoded = jsonwebtoken_1.default.verify(token, this.getPublicKey(), options);
        if (decoded.type !== 'refresh') {
            throw new Error('Invalid token type');
        }
        return decoded;
    }
    /**
     * Generate authorization code
     */
    generateAuthorizationCode(data) {
        const codeData = {
            ...data,
            timestamp: Date.now(),
            random: crypto_1.default.randomBytes(16).toString('hex')
        };
        return Buffer.from(JSON.stringify(codeData)).toString('base64url');
    }
    /**
     * Verify and decode authorization code
     */
    verifyAuthorizationCode(code) {
        try {
            const decoded = JSON.parse(Buffer.from(code, 'base64url').toString());
            // Check if code is expired (10 minutes)
            if (Date.now() - decoded.timestamp > 10 * 60 * 1000) {
                throw new Error('Authorization code expired');
            }
            return decoded;
        }
        catch (error) {
            throw new Error('Invalid authorization code');
        }
    }
    /**
     * Get user scopes based on role and memberships
     */
    getUserScopes(user) {
        const scopes = ['openid', 'profile', 'email'];
        if (user.role === 'ADMIN') {
            scopes.push('admin', 'read', 'write', 'delete');
        }
        else if (user.role === 'MANAGER') {
            scopes.push('read', 'write');
        }
        else {
            scopes.push('read');
        }
        if (user.memberships && user.memberships.length > 0) {
            scopes.push('organizations');
        }
        return scopes.join(' ');
    }
    /**
     * Get user permissions based on role
     */
    getUserPermissions(role) {
        switch (role) {
            case 'ADMIN':
                return [
                    'users:read', 'users:write', 'users:delete',
                    'accounts:read', 'accounts:write', 'accounts:delete',
                    'organizations:read', 'organizations:write', 'organizations:delete',
                    'projects:read', 'projects:write', 'projects:delete',
                    'admin:access'
                ];
            case 'MANAGER':
                return [
                    'users:read',
                    'accounts:read', 'accounts:write',
                    'organizations:read',
                    'projects:read', 'projects:write'
                ];
            case 'USER':
                return [
                    'accounts:read',
                    'projects:read'
                ];
            default:
                return ['accounts:read'];
        }
    }
    /**
     * Get user plan based on role and memberships
     */
    getUserPlan(user) {
        if (user.role === 'ADMIN')
            return 'Enterprise';
        if (user.memberships && user.memberships.length > 0)
            return 'Organization';
        return 'Free';
    }
    /**
     * Parse expiry string to seconds
     */
    parseExpiry(expiry) {
        const unit = expiry.slice(-1);
        const value = parseInt(expiry.slice(0, -1));
        switch (unit) {
            case 's': return value;
            case 'm': return value * 60;
            case 'h': return value * 3600;
            case 'd': return value * 86400;
            default: return value;
        }
    }
    /**
     * Get private key for signing (in production, use proper key management)
     */
    getPrivateKey() {
        if (process.env.JWT_PRIVATE_KEY) {
            return process.env.JWT_PRIVATE_KEY;
        }
        // For development, generate a key pair
        if (!this.privateKey) {
            const { publicKey, privateKey } = crypto_1.default.generateKeyPairSync('rsa', {
                modulusLength: 2048,
                publicKeyEncoding: { type: 'spki', format: 'pem' },
                privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
            });
            this.privateKey = privateKey;
            this.publicKey = publicKey;
        }
        return this.privateKey;
    }
    /**
     * Get public key for verification
     */
    getPublicKey() {
        if (process.env.JWT_PUBLIC_KEY) {
            return process.env.JWT_PUBLIC_KEY;
        }
        // Generate key pair if not already done
        this.getPrivateKey();
        return this.publicKey;
    }
    /**
     * Get key ID for key rotation support
     */
    getKeyId() {
        return process.env.JWT_KEY_ID || 'default-key';
    }
}
exports.TokenService = TokenService;
exports.tokenService = new TokenService();
