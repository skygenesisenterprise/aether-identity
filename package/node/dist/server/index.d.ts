import type { IdentityServerConfig, IdentityServerHooks, ExpressMiddleware, ServerLoginCredentials, GenerateTokenInput, ServerTokenResponse, TokenValidationResult, UserContext, ContextType } from "./types";
interface IdentityServerInstance {
    authMiddleware: () => ExpressMiddleware;
    rbacMiddleware: (roles: string[]) => ExpressMiddleware;
    protectRoute: (roles?: string[]) => ExpressMiddleware;
    mfaMiddleware: () => ExpressMiddleware;
    contextMiddleware: (context: ContextType) => ExpressMiddleware;
    login: (credentials: ServerLoginCredentials, ip: string, userAgent: string, path: string) => Promise<ServerTokenResponse>;
    logout: (token: string, ip: string, userAgent: string, path: string) => Promise<void>;
    refreshToken: (refreshToken: string, ip: string, userAgent: string, path: string) => Promise<ServerTokenResponse>;
    validateToken: (token: string) => Promise<TokenValidationResult>;
    generateToken: (input: GenerateTokenInput) => Promise<ServerTokenResponse>;
    getUserFromToken: (token: string) => Promise<UserContext | null>;
    hasRole: (user: UserContext, roles: string[]) => boolean;
    hasPermission: (user: UserContext, permissions: string[]) => boolean;
    requiresMFA: (context: ContextType) => boolean;
    extractTokenFromHeader: (headerValue: string | undefined) => string | null;
    registerHooks: (hooks: IdentityServerHooks) => void;
    clearCache: () => void;
    getCacheSize: () => number;
}
declare class IdentityServer {
    private config;
    private cache;
    private hooks;
    private helpers;
    private middlewares;
    constructor(config: IdentityServerConfig);
    authMiddleware(): ExpressMiddleware;
    rbacMiddleware(roles: string[]): ExpressMiddleware;
    protectRoute(roles?: string[]): ExpressMiddleware;
    mfaMiddleware(): ExpressMiddleware;
    contextMiddleware(context: ContextType): ExpressMiddleware;
    login(credentials: ServerLoginCredentials, ip: string, userAgent: string, path: string): Promise<ServerTokenResponse>;
    logout(token: string, ip: string, userAgent: string, path: string): Promise<void>;
    refreshToken(refreshToken: string, ip: string, userAgent: string, path: string): Promise<ServerTokenResponse>;
    validateToken(token: string): Promise<TokenValidationResult>;
    generateToken(input: GenerateTokenInput): Promise<ServerTokenResponse>;
    getUserFromToken(token: string): Promise<UserContext | null>;
    hasRole(user: UserContext, roles: string[]): boolean;
    hasPermission(user: UserContext, permissions: string[]): boolean;
    requiresMFA(context: ContextType): boolean;
    extractTokenFromHeader(headerValue: string | undefined): string | null;
    registerHooks(hooks: IdentityServerHooks): void;
    clearCache(): void;
    getCacheSize(): number;
}
declare function CreateIdentityServer(config: IdentityServerConfig): IdentityServerInstance;
export { CreateIdentityServer, IdentityServer };
export type { IdentityServerInstance };
export type { IdentityServerConfig, IdentityServerHooks, ContextType, UserContext, ExpressMiddleware, ServerLoginCredentials, GenerateTokenInput, ServerTokenResponse, TokenValidationResult, UnauthorizedInfo, HookContext, LoginHookContext, LogoutHookContext, TokenRefreshHookContext, MFARequiredHookContext, RoleCheckHookContext, MiddlewareOptions, TokenCacheConfig, RateLimitConfig, CachedToken, NextFunction, ExpressRequest, ExpressResponse, RequestWithUser, } from "./types";
//# sourceMappingURL=index.d.ts.map