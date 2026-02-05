import type {
  IdentityServerConfig,
  TokenCacheConfig,
  RateLimitConfig,
  ContextType,
} from "./types";

const DEFAULT_TOKEN_HEADER = "authorization";
const DEFAULT_COOKIE_NAME = "aether_token";
const DEFAULT_TOKEN_PREFIX = "bearer";
const DEFAULT_CONTEXT: ContextType = "user";
const DEFAULT_CACHE_TTL = 300;
const DEFAULT_CACHE_SIZE = 1000;
const DEFAULT_RATE_LIMIT_WINDOW = 900000;
const DEFAULT_RATE_LIMIT_MAX = 100;

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

function validateAndNormalizeConfig(
  config: IdentityServerConfig,
): ValidatedConfig {
  if (!config.baseUrl) {
    throw new Error("IdentityServer: baseUrl is required");
  }

  if (!config.clientId) {
    throw new Error("IdentityServer: clientId is required");
  }

  const normalizedBaseUrl = config.baseUrl.replace(/\/$/, "");

  return {
    baseUrl: normalizedBaseUrl,
    clientId: config.clientId,
    systemKey: config.systemKey,
    jwtSecret: config.jwtSecret,
    defaultContext: config.defaultContext || DEFAULT_CONTEXT,
    mfaRequired: config.mfaRequired ?? false,
    tokenHeader: config.tokenHeader?.toLowerCase() || DEFAULT_TOKEN_HEADER,
    cookieName: config.cookieName || DEFAULT_COOKIE_NAME,
    tokenPrefix: config.tokenPrefix?.toLowerCase() || DEFAULT_TOKEN_PREFIX,
    cache: {
      enabled: config.cache?.enabled ?? true,
      ttl: config.cache?.ttl ?? DEFAULT_CACHE_TTL,
      maxSize: config.cache?.maxSize ?? DEFAULT_CACHE_SIZE,
    },
    rateLimit: {
      windowMs: config.rateLimit?.windowMs ?? DEFAULT_RATE_LIMIT_WINDOW,
      maxAttempts: config.rateLimit?.maxAttempts ?? DEFAULT_RATE_LIMIT_MAX,
    },
  };
}

function isContextMFARequired(
  context: ContextType,
  mfaRequired: boolean | ContextType[],
): boolean {
  if (typeof mfaRequired === "boolean") {
    return mfaRequired;
  }
  return mfaRequired.includes(context);
}

export {
  DEFAULT_TOKEN_HEADER,
  DEFAULT_COOKIE_NAME,
  DEFAULT_TOKEN_PREFIX,
  DEFAULT_CONTEXT,
  DEFAULT_CACHE_TTL,
  DEFAULT_CACHE_SIZE,
  DEFAULT_RATE_LIMIT_WINDOW,
  DEFAULT_RATE_LIMIT_MAX,
  validateAndNormalizeConfig,
  isContextMFARequired,
};

export type { ValidatedConfig };
