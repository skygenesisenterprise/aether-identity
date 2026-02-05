import type { IdentityServerConfig, TokenCacheConfig, RateLimitConfig, ContextType } from "./types";
declare const DEFAULT_TOKEN_HEADER = "authorization";
declare const DEFAULT_COOKIE_NAME = "aether_token";
declare const DEFAULT_TOKEN_PREFIX = "bearer";
declare const DEFAULT_CONTEXT: ContextType;
declare const DEFAULT_CACHE_TTL = 300;
declare const DEFAULT_CACHE_SIZE = 1000;
declare const DEFAULT_RATE_LIMIT_WINDOW = 900000;
declare const DEFAULT_RATE_LIMIT_MAX = 100;
interface ValidatedConfig {
    baseUrl: string;
    clientId: string;
    systemKey: string | undefined;
    jwtSecret: string | undefined;
    defaultContext: ContextType;
    mfaRequired: boolean | ContextType[];
    tokenHeader: string;
    cookieName: string;
    tokenPrefix: string;
    cache: Required<TokenCacheConfig>;
    rateLimit: Required<RateLimitConfig>;
}
declare function validateAndNormalizeConfig(config: IdentityServerConfig): ValidatedConfig;
declare function isContextMFARequired(context: ContextType, mfaRequired: boolean | ContextType[]): boolean;
export { DEFAULT_TOKEN_HEADER, DEFAULT_COOKIE_NAME, DEFAULT_TOKEN_PREFIX, DEFAULT_CONTEXT, DEFAULT_CACHE_TTL, DEFAULT_CACHE_SIZE, DEFAULT_RATE_LIMIT_WINDOW, DEFAULT_RATE_LIMIT_MAX, validateAndNormalizeConfig, isContextMFARequired, };
export type { ValidatedConfig };
//# sourceMappingURL=config.d.ts.map