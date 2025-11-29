import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import crypto from 'crypto';


export interface TokenClaims {
  sub: string;
  email: string;
  role: string;
  permissions: string[];
  organization_id?: string;
  tenant_id?: string;
  plan?: string;
  iss: string;
  aud: string;
  iat: number;
  exp: number;
}

export interface AccessTokenClaims extends Omit<TokenClaims, 'permissions'> {
  scope: string;
  permissions: string[];
}

export interface IdTokenClaims extends Omit<TokenClaims, 'permissions'> {
  name: string;
  picture?: string;
  email_verified: boolean;
}

export interface RefreshTokenClaims {
  sub: string;
  type: 'refresh';
  iat: number;
  exp: number;
  jti: string;
}

export class TokenService {
  private readonly accessTokenExpiry = '15m';
  private readonly refreshTokenExpiry = '30d';
  private readonly idTokenExpiry = '15m';
  private readonly issuer = 'https://sso.skygenesisenterprise.com';
  private readonly audience = 'api.skygenesisenterprise.com';

  /**
   * Generate OAuth2/OIDC compliant access token
   */
  generateAccessToken(user: any, additionalClaims: Partial<AccessTokenClaims> = {}): string {
    const now = Math.floor(Date.now() / 1000);
    const claims: AccessTokenClaims = {
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

    const options: SignOptions = {
      expiresIn: this.accessTokenExpiry,
      algorithm: 'RS256',
      keyid: this.getKeyId()
    };

    return jwt.sign(claims, this.getPrivateKey(), options);
  }

  /**
   * Generate OAuth2/OIDC compliant ID token
   */
  generateIdToken(user: any, clientId: string, nonce?: string): string {
    const now = Math.floor(Date.now() / 1000);
    const claims: IdTokenClaims = {
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
      (claims as any).nonce = nonce;
    }

    const options: SignOptions = {
      expiresIn: this.idTokenExpiry,
      algorithm: 'RS256',
      keyid: this.getKeyId()
    };

    return jwt.sign(claims, this.getPrivateKey(), options);
  }

  /**
   * Generate refresh token
   */
  generateRefreshToken(user: any): string {
    const now = Math.floor(Date.now() / 1000);
    const jti = crypto.randomUUID();
    
    const claims: RefreshTokenClaims = {
      sub: user.id,
      type: 'refresh',
      iat: now,
      exp: now + this.parseExpiry(this.refreshTokenExpiry),
      jti
    };

    const options: SignOptions = {
      expiresIn: this.refreshTokenExpiry,
      algorithm: 'RS256',
      keyid: this.getKeyId(),
      jwtid: jti
    };

    return jwt.sign(claims, this.getPrivateKey(), options);
  }

  /**
   * Verify access token
   */
  verifyAccessToken(token: string): AccessTokenClaims {
    const options: VerifyOptions = {
      algorithms: ['RS256'],
      issuer: this.issuer,
      audience: this.audience
    };

    return jwt.verify(token, this.getPublicKey(), options) as AccessTokenClaims;
  }

  /**
   * Verify ID token
   */
  verifyIdToken(token: string, clientId?: string): IdTokenClaims {
    const options: VerifyOptions = {
      algorithms: ['RS256'],
      issuer: this.issuer
    };

    if (clientId) {
      options.audience = clientId;
    }

    return jwt.verify(token, this.getPublicKey(), options) as IdTokenClaims;
  }

  /**
   * Verify refresh token
   */
  verifyRefreshToken(token: string): RefreshTokenClaims {
    const options: VerifyOptions = {
      algorithms: ['RS256'],
      issuer: this.issuer
    };

    const decoded = jwt.verify(token, this.getPublicKey(), options) as RefreshTokenClaims;
    
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    return decoded;
  }

  /**
   * Generate authorization code
   */
  generateAuthorizationCode(data: any): string {
    const codeData = {
      ...data,
      timestamp: Date.now(),
      random: crypto.randomBytes(16).toString('hex')
    };

    return Buffer.from(JSON.stringify(codeData)).toString('base64url');
  }

  /**
   * Verify and decode authorization code
   */
  verifyAuthorizationCode(code: string): any {
    try {
      const decoded = JSON.parse(Buffer.from(code, 'base64url').toString());
      
      // Check if code is expired (10 minutes)
      if (Date.now() - decoded.timestamp > 10 * 60 * 1000) {
        throw new Error('Authorization code expired');
      }

      return decoded;
    } catch (error) {
      throw new Error('Invalid authorization code');
    }
  }

  /**
   * Get user scopes based on role and memberships
   */
  private getUserScopes(user: any): string {
    const scopes = ['openid', 'profile', 'email'];
    
    if (user.role === 'ADMIN') {
      scopes.push('admin', 'read', 'write', 'delete');
    } else if (user.role === 'MANAGER') {
      scopes.push('read', 'write');
    } else {
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
  private getUserPermissions(role: string): string[] {
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
  private getUserPlan(user: any): string {
    if (user.role === 'ADMIN') return 'Enterprise';
    if (user.memberships && user.memberships.length > 0) return 'Organization';
    return 'Free';
  }

  /**
   * Parse expiry string to seconds
   */
  private parseExpiry(expiry: string): number {
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
  private getPrivateKey(): string {
    if (process.env.JWT_PRIVATE_KEY) {
      return process.env.JWT_PRIVATE_KEY;
    }
    
    // For development, generate a key pair
    if (!this.privateKey) {
      const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
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
  private getPublicKey(): string {
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
  private getKeyId(): string {
    return process.env.JWT_KEY_ID || 'default-key';
  }

  private privateKey: string = '';
  private publicKey: string = '';
}

export const tokenService = new TokenService();