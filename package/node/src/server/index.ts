import type {
  IdentityServerConfig,
  IdentityServerHooks,
  ExpressMiddleware,
  ServerLoginCredentials,
  GenerateTokenInput,
  ServerTokenResponse,
  TokenValidationResult,
  UserContext,
  ContextType,
} from "./types";
import { validateAndNormalizeConfig, type ValidatedConfig } from "./config";
import { TokenCache } from "./cache";
import { HookManager } from "./hooks";
import { ServerHelpers } from "./helpers";
import { MiddlewareFactory, type MiddlewareDependencies } from "./middleware";

interface IdentityServerInstance {
  // Middlewares
  authMiddleware: () => ExpressMiddleware;
  rbacMiddleware: (roles: string[]) => ExpressMiddleware;
  protectRoute: (roles?: string[]) => ExpressMiddleware;
  mfaMiddleware: () => ExpressMiddleware;
  contextMiddleware: (context: ContextType) => ExpressMiddleware;

  // Helpers
  login: (
    credentials: ServerLoginCredentials,
    ip: string,
    userAgent: string,
    path: string,
  ) => Promise<ServerTokenResponse>;
  logout: (
    token: string,
    ip: string,
    userAgent: string,
    path: string,
  ) => Promise<void>;
  refreshToken: (
    refreshToken: string,
    ip: string,
    userAgent: string,
    path: string,
  ) => Promise<ServerTokenResponse>;
  validateToken: (token: string) => Promise<TokenValidationResult>;
  generateToken: (input: GenerateTokenInput) => Promise<ServerTokenResponse>;
  getUserFromToken: (token: string) => Promise<UserContext | null>;
  hasRole: (user: UserContext, roles: string[]) => boolean;
  hasPermission: (user: UserContext, permissions: string[]) => boolean;
  requiresMFA: (context: ContextType) => boolean;
  extractTokenFromHeader: (headerValue: string | undefined) => string | null;

  // Hooks registration
  registerHooks: (hooks: IdentityServerHooks) => void;

  // Cache management
  clearCache: () => void;
  getCacheSize: () => number;
}

class IdentityServer {
  private config: ValidatedConfig;
  private cache: TokenCache;
  private hooks: HookManager;
  private helpers: ServerHelpers;
  private middlewares: MiddlewareFactory;

  constructor(config: IdentityServerConfig) {
    this.config = validateAndNormalizeConfig(config);
    this.cache = new TokenCache(
      this.config.cache.maxSize,
      this.config.cache.ttl,
    );
    this.hooks = new HookManager(config.hooks);
    this.helpers = new ServerHelpers(
      this.config,
      this.cache,
      this.hooks,
      fetch,
    );

    const deps: MiddlewareDependencies = {
      config: this.config,
      cache: this.cache,
      hooks: this.hooks,
      helpers: this.helpers,
    };
    this.middlewares = new MiddlewareFactory(deps);
  }

  authMiddleware(): ExpressMiddleware {
    return this.middlewares.authMiddleware();
  }

  rbacMiddleware(roles: string[]): ExpressMiddleware {
    return this.middlewares.rbacMiddleware(roles);
  }

  protectRoute(roles?: string[]): ExpressMiddleware {
    return this.middlewares.protectRoute(roles);
  }

  mfaMiddleware(): ExpressMiddleware {
    return this.middlewares.mfaMiddleware();
  }

  contextMiddleware(context: ContextType): ExpressMiddleware {
    return this.middlewares.contextMiddleware(context);
  }

  async login(
    credentials: ServerLoginCredentials,
    ip: string,
    userAgent: string,
    path: string,
  ): Promise<ServerTokenResponse> {
    return this.helpers.login(credentials, ip, userAgent, path);
  }

  async logout(
    token: string,
    ip: string,
    userAgent: string,
    path: string,
  ): Promise<void> {
    return this.helpers.logout(token, ip, userAgent, path);
  }

  async refreshToken(
    refreshToken: string,
    ip: string,
    userAgent: string,
    path: string,
  ): Promise<ServerTokenResponse> {
    return this.helpers.refreshToken(refreshToken, ip, userAgent, path);
  }

  async validateToken(token: string): Promise<TokenValidationResult> {
    return this.helpers.validateToken(token);
  }

  async generateToken(input: GenerateTokenInput): Promise<ServerTokenResponse> {
    return this.helpers.generateToken(input);
  }

  async getUserFromToken(token: string): Promise<UserContext | null> {
    return this.helpers.getUserFromToken(token);
  }

  hasRole(user: UserContext, roles: string[]): boolean {
    return this.helpers.hasRole(user, roles);
  }

  hasPermission(user: UserContext, permissions: string[]): boolean {
    return this.helpers.hasPermission(user, permissions);
  }

  requiresMFA(context: ContextType): boolean {
    return this.helpers.requiresMFA(context);
  }

  extractTokenFromHeader(headerValue: string | undefined): string | null {
    return this.helpers.extractTokenFromHeader(headerValue);
  }

  registerHooks(hooks: IdentityServerHooks): void {
    this.hooks = new HookManager(hooks);
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}

function CreateIdentityServer(
  config: IdentityServerConfig,
): IdentityServerInstance {
  const server = new IdentityServer(config);

  return {
    // Middlewares
    authMiddleware: () => server.authMiddleware(),
    rbacMiddleware: (roles: string[]) => server.rbacMiddleware(roles),
    protectRoute: (roles?: string[]) => server.protectRoute(roles),
    mfaMiddleware: () => server.mfaMiddleware(),
    contextMiddleware: (context: ContextType) =>
      server.contextMiddleware(context),

    // Helpers
    login: (credentials, ip, userAgent, path) =>
      server.login(credentials, ip, userAgent, path),
    logout: (token, ip, userAgent, path) =>
      server.logout(token, ip, userAgent, path),
    refreshToken: (refreshToken, ip, userAgent, path) =>
      server.refreshToken(refreshToken, ip, userAgent, path),
    validateToken: (token) => server.validateToken(token),
    generateToken: (input) => server.generateToken(input),
    getUserFromToken: (token) => server.getUserFromToken(token),
    hasRole: (user, roles) => server.hasRole(user, roles),
    hasPermission: (user, permissions) =>
      server.hasPermission(user, permissions),
    requiresMFA: (context) => server.requiresMFA(context),
    extractTokenFromHeader: (headerValue) =>
      server.extractTokenFromHeader(headerValue),

    // Hooks
    registerHooks: (hooks) => server.registerHooks(hooks),

    // Cache
    clearCache: () => server.clearCache(),
    getCacheSize: () => server.getCacheSize(),
  };
}

export { CreateIdentityServer, IdentityServer };
export type { IdentityServerInstance };

// Re-export all types for convenience
export type {
  IdentityServerConfig,
  IdentityServerHooks,
  ContextType,
  UserContext,
  ExpressMiddleware,
  ServerLoginCredentials,
  GenerateTokenInput,
  ServerTokenResponse,
  TokenValidationResult,
  UnauthorizedInfo,
  HookContext,
  LoginHookContext,
  LogoutHookContext,
  TokenRefreshHookContext,
  MFARequiredHookContext,
  RoleCheckHookContext,
  MiddlewareOptions,
  TokenCacheConfig,
  RateLimitConfig,
  CachedToken,
  NextFunction,
  ExpressRequest,
  ExpressResponse,
  RequestWithUser,
} from "./types";
