import { Router, Request, Response } from 'express';
import { tokenService } from '../services/tokenService';
import { keyManagementService } from '../services/keyManagementService';

const router = Router();

/**
 * @route   GET /.well-known/openid-configuration
 * @desc    OIDC Discovery endpoint
 * @access  Public
 */
router.get('/openid-configuration', (req: Request, res: Response) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  
  const configuration = {
    issuer: 'https://sso.skygenesisenterprise.net',
    authorization_endpoint: `${baseUrl}/api/v1/auth/authorize`,
    token_endpoint: `${baseUrl}/api/v1/auth/token`,
    userinfo_endpoint: `${baseUrl}/api/v1/auth/userinfo`,
    jwks_uri: `${baseUrl}/.well-known/jwks.json`,
    registration_endpoint: `${baseUrl}/api/v1/clients`,
    end_session_endpoint: `${baseUrl}/api/v1/auth/logout`,
    response_types_supported: ['code', 'id_token', 'code token', 'code id_token'],
    response_modes_supported: ['query', 'fragment'],
    grant_types_supported: [
      'authorization_code',
      'refresh_token',
      'urn:ietf:params:oauth:grant-type:jwt-bearer',
      'client_credentials'
    ],
    subject_types_supported: ['public'],
    id_token_signing_alg_values_supported: ['RS256'],
    userinfo_signing_alg_values_supported: ['RS256'],
    request_object_signing_alg_values_supported: ['RS256'],
    scopes_supported: [
      'openid',
      'profile',
      'email',
      'address',
      'phone',
      'offline_access',
      'read',
      'write',
      'delete',
      'admin',
      'organizations'
    ],
    token_endpoint_auth_methods_supported: [
      'client_secret_basic',
      'client_secret_post',
      'none'
    ],
    token_endpoint_auth_signing_alg_values_supported: ['RS256'],
    claims_supported: [
      'sub',
      'aud',
      'exp',
      'iat',
      'iss',
      'auth_time',
      'nonce',
      'acr',
      'amr',
      'azp',
      'name',
      'given_name',
      'family_name',
      'middle_name',
      'nickname',
      'preferred_username',
      'profile',
      'picture',
      'website',
      'email',
      'email_verified',
      'gender',
      'birthdate',
      'zoneinfo',
      'locale',
      'phone_number',
      'phone_number_verified',
      'address',
      'updated_at',
      'role',
      'permissions',
      'organization_id',
      'tenant_id',
      'plan'
    ],
    code_challenge_methods_supported: ['S256', 'plain'],
    service_documentation: 'https://wiki.skygenesisenterprise.net/aether-identity',
    ui_locales_supported: ['en', 'fr', 'es', 'de', 'it'],
    op_policy_uri: 'https://skygenesisenterprise.net/policies/privacy',
    op_tos_uri: 'https://skygenesisenterprise.net/policies/terms',
    revocation_endpoint: `${baseUrl}/api/v1/auth/revoke`,
    introspection_endpoint: `${baseUrl}/api/v1/auth/introspect`,
    request_parameter_supported: true,
    request_uri_parameter_supported: true,
    require_request_uri_registration: false
  };

  // Cache for 24 hours
  res.set('Cache-Control', 'public, max-age=86400');
  res.json(configuration);
});

/**
 * @route   GET /.well-known/jwks.json
 * @desc    JWKS endpoint for RSA public key discovery
 * @access  Public
 */
router.get('/jwks.json', (req: Request, res: Response) => {
  try {
    const jwks = keyManagementService.getJWKS();

    // Cache for 1 hour
    res.set('Cache-Control', 'public, max-age=3600');
    res.json(jwks);

  } catch (error) {
    console.error('JWKS generation error:', error);
    res.status(500).json({
      error: 'Unable to generate JWKS',
      error_description: 'Failed to generate JSON Web Key Set'
    });
  }
});

export default router;