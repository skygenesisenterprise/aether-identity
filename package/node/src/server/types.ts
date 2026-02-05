export type ContextType = "user" | "admin" | "cli" | "device" | "console";

export interface TokenCacheConfig {
  enabled: boolean;
  ttl: number;
  maxSize: number;
}

export interface RateLimitConfig {
  windowMs: number;
  maxAttempts: number;
}

export interface UserContext {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
  context: ContextType;
  mfaVerified: boolean;
  sessionId?: string;
  metadata?: Record<string, unknown>;
}

export interface UnauthorizedInfo {
  ip: string;
  userAgent: string;
  timestamp: number;
  reason: string;
  path?: string;
  attemptedRole?: string;
  token?: string;
}

export interface HookContext {
  user?: UserContext;
  token?: string;
  ip: string;
  userAgent: string;
  timestamp: number;
  requestId: string;
  path: string;
  metadata?: Record<string, unknown>;
}

export interface LoginHookContext extends HookContext {
  user: UserContext;
}

export interface LogoutHookContext extends HookContext {
  user: UserContext;
}

export interface TokenRefreshHookContext extends HookContext {
  user: UserContext;
  oldToken: string;
  newToken: string;
}

export interface MFARequiredHookContext extends HookContext {
  user: UserContext;
  method: "totp" | "email" | "sms";
}

export interface RoleCheckHookContext extends HookContext {
  user: UserContext;
  requiredRoles: string[];
  hasRole: boolean;
}

export interface IdentityServerHooks {
  onLogin?: (ctx: LoginHookContext) => void | Promise<void>;
  onLogout?: (ctx: LogoutHookContext) => void | Promise<void>;
  onTokenRefresh?: (ctx: TokenRefreshHookContext) => void | Promise<void>;
  onUnauthorizedAttempt?: (
    ctx: HookContext,
    info: UnauthorizedInfo,
  ) => void | Promise<void>;
  onMFARequired?: (ctx: MFARequiredHookContext) => void | Promise<void>;
  onRoleCheck?: (ctx: RoleCheckHookContext) => void | Promise<void>;
}

export interface IdentityServerConfig {
  baseUrl: string;
  clientId: string;
  systemKey?: string;
  jwtSecret?: string;
  defaultContext?: ContextType;
  mfaRequired?: boolean | ContextType[];
  tokenHeader?: string;
  cookieName?: string;
  tokenPrefix?: string;
  cache?: TokenCacheConfig;
  rateLimit?: RateLimitConfig;
  hooks?: IdentityServerHooks;
}

export interface ServerTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface ServerLoginCredentials {
  email: string;
  password: string;
  totpCode?: string;
  context?: ContextType;
}

export interface TokenValidationResult {
  valid: boolean;
  user?: UserContext;
  expiresAt?: number;
  error?: string;
}

export interface GenerateTokenInput {
  userId: string;
  email: string;
  name?: string;
  roles?: string[];
  permissions?: string[];
  context?: ContextType;
  expiresIn?: number;
  metadata?: Record<string, unknown>;
}

export interface CachedToken {
  user: UserContext;
  expiresAt: number;
  cachedAt: number;
}

export interface MiddlewareOptions {
  roles?: string[];
  context?: ContextType;
  requireMFA?: boolean;
  allowExpired?: boolean;
}

export interface RequestWithUser {
  user?: UserContext;
  token?: string;
  context?: ContextType;
}

export type NextFunction = (err?: Error) => void;

export interface ExpressRequest {
  headers: Record<string, string | string[] | undefined>;
  cookies?: Record<string, string>;
  ip?: string;
  path: string;
  user?: UserContext;
  token?: string;
  context?: ContextType;
}

export interface ExpressResponse {
  status(code: number): ExpressResponse;
  json(body: unknown): ExpressResponse;
  cookie(
    name: string,
    value: string,
    options?: Record<string, unknown>,
  ): ExpressResponse;
  clearCookie(name: string): ExpressResponse;
}

export type ExpressMiddleware = (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction,
) => void | Promise<void>;
