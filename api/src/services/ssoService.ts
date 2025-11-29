import { prisma } from '../config/database';
import { tokenService, TokenClaims } from './tokenService';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';

export interface SSOAuthorizeRequest {
  client_id: string;
  redirect_uri?: string;
  response_type: string;
  state?: string;
  scope?: string;
  code_challenge?: string;
  code_challenge_method?: string;
  final_redirect_url?: string;
}

export interface SSOTokenRequest {
  grant_type: string;
  code: string;
  client_id: string;
  client_secret?: string;
  redirect_uri?: string;
  code_verifier?: string;
}

export interface SSOSessionData {
  userId: string;
  email: string;
  role: string;
  organizationId?: string;
  tenantId?: string;
  plan: string;
  permissions: string[];
}

export class SSOService {
  private readonly identityBaseUrl = 'https://sso.skygenesisenterprise.com';
  private readonly apiBaseUrl = 'https://api.skygenesisenterprise.com';

  /**
   * Handle SSO authorization request - broker between API and Identity
   */
  async authorize(request: SSOAuthorizeRequest, httpRequest?: Request): Promise<{ redirectUrl: string }> {
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
    } else {
      // User needs to authenticate - redirect to Identity
      return this.redirectToIdentity(authSession, client);
    }
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeToken(request: SSOTokenRequest): Promise<any> {
    // Validate client
    const client = await this.validateClient(request.client_id);
    
    // Verify authorization code
    const authData = tokenService.verifyAuthorizationCode(request.code);
    
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
    const user = await prisma.user.findUnique({
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
    const accessToken = tokenService.generateAccessToken(user);
    const refreshToken = tokenService.generateRefreshToken(user);
    const idToken = tokenService.generateIdToken(user, client.clientId);
    
    // Mark auth session as completed
    await prisma.authSession.update({
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
  async refreshToken(refreshToken: string): Promise<any> {
    // Verify refresh token
    const claims = tokenService.verifyRefreshToken(refreshToken);
    
    // Get user data
    const user = await prisma.user.findUnique({
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
    const newAccessToken = tokenService.generateAccessToken(user);
    const newRefreshToken = tokenService.generateRefreshToken(user);
    
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
  async logout(accessToken: string): Promise<{ identityLogoutUrl: string }> {
    try {
      // Verify access token and get user info
      const claims = tokenService.verifyAccessToken(accessToken);
      
      // Create logout session for tracking
      const logoutId = uuidv4();
      
      // Redirect to Identity for session logout
      const identityLogoutUrl = new URL(`${this.identityBaseUrl}/api/v1/oauth/logout`);
      identityLogoutUrl.searchParams.set('user_id', claims.sub);
      identityLogoutUrl.searchParams.set('logout_id', logoutId);
      identityLogoutUrl.searchParams.set('redirect_uri', `${this.apiBaseUrl}/api/v1/auth/sso/logout/callback`);
      
      return { identityLogoutUrl: identityLogoutUrl.toString() };
    } catch (error) {
      // If token verification fails, still redirect to Identity
      const identityLogoutUrl = new URL(`${this.identityBaseUrl}/api/v1/oauth/logout`);
      identityLogoutUrl.searchParams.set('redirect_uri', `${this.apiBaseUrl}/api/v1/auth/sso/logout/callback`);
      
      return { identityLogoutUrl: identityLogoutUrl.toString() };
    }
  }

  /**
   * Validate client application
   */
  private async validateClient(clientId: string) {
    const client = await prisma.clientApplication.findUnique({
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
  private determineRedirectUri(client: any, request: SSOAuthorizeRequest): string {
    // Priority 1: final_redirect_url (dynamic)
    if (request.final_redirect_url) {
      try {
        new URL(request.final_redirect_url);
        return request.final_redirect_url;
      } catch {
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
  private validateScopes(client: any, requestedScopes?: string): string[] {
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
  private async createAuthSession(
    client: any, 
    request: SSOAuthorizeRequest, 
    redirectUri: string, 
    scopes: string[]
  ) {
    const sessionId = uuidv4();
    const authCode = crypto.randomBytes(32).toString('hex');
    
    return await prisma.authSession.create({
      data: {
        id: uuidv4(),
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
  private async checkExistingSession(req?: Request): Promise<SSOSessionData | null> {
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

      const sessionCookie = (req as any).cookies?.AETHER_IDENTITY_SESSION;
      
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
      
    } catch (error) {
      console.error('Session check error:', error);
      return null;
    }
  }

  /**
   * Handle existing session - seamless SSO
   */
  private async handleExistingSession(
    sessionData: SSOSessionData, 
    authSession: any, 
    client: any
  ): Promise<{ redirectUrl: string }> {
    // Update auth session with user info
    await prisma.authSession.update({
      where: { id: authSession.id },
      data: {
        userId: sessionData.userId,
        isCompleted: true
      }
    });

    // Get user for token generation
    const user = await prisma.user.findUnique({
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
    const accessToken = tokenService.generateAccessToken(user);
    const refreshToken = tokenService.generateRefreshToken(user);
    const idToken = tokenService.generateIdToken(user, client.clientId);

    // Create authorization code with tokens
    const codeData = {
      sessionId: authSession.sessionId,
      tokens: { accessToken, refreshToken, idToken },
      scope: authSession.scope,
      timestamp: Date.now()
    };

    const authCode = tokenService.generateAuthorizationCode(codeData);

    // Build redirect URL with authorization code
    const redirectUrl = new URL(authSession.finalRedirectUrl || authSession.redirectUri);
    redirectUrl.searchParams.set('code', authCode);
    redirectUrl.searchParams.set('state', authSession.state || '');
    
    return { redirectUrl: redirectUrl.toString() };
  }

  /**
   * Redirect to Identity for authentication
   */
  private async redirectToIdentity(authSession: any, client: any): Promise<{ redirectUrl: string }> {
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
  private async getAuthSession(sessionId: string) {
    return await prisma.authSession.findUnique({
      where: { sessionId }
    });
  }

  /**
   * Verify PKCE code challenge
   */
  private verifyPKCE(codeChallenge: string, codeChallengeMethod: string, codeVerifier: string): void {
    let hash: string;
    
    if (codeChallengeMethod === 'S256') {
      hash = crypto.createHash('sha256').update(codeVerifier).digest('base64url');
    } else if (codeChallengeMethod === 'plain') {
      hash = codeVerifier;
    } else {
      throw new Error('Unsupported code challenge method');
    }

    if (hash !== codeChallenge) {
      throw new Error('Invalid code verifier');
    }
  }
}

export const ssoService = new SSOService();