import type {
  UserContext,
  ServerLoginCredentials,
  GenerateTokenInput,
  ServerTokenResponse,
  TokenValidationResult,
  ContextType,
} from "./types";
import type { ValidatedConfig } from "./config";
import type { TokenCache } from "./cache";
import type { HookManager } from "./hooks";

class ServerHelpers {
  private config: ValidatedConfig;
  private cache: TokenCache;
  private hooks: HookManager;
  private fetcher: typeof fetch;

  constructor(
    config: ValidatedConfig,
    cache: TokenCache,
    hooks: HookManager,
    fetcher: typeof fetch,
  ) {
    this.config = config;
    this.cache = cache;
    this.hooks = hooks;
    this.fetcher = fetcher;
  }

  async login(
    credentials: ServerLoginCredentials,
    ip: string,
    userAgent: string,
    path: string,
  ): Promise<ServerTokenResponse> {
    const payload: Record<string, string> = {
      email: credentials.email,
      password: credentials.password,
    };

    if (credentials.totpCode) {
      payload.totpCode = credentials.totpCode;
    }

    if (credentials.context) {
      payload.context = credentials.context;
    }

    const response = await this.makeRequest<ServerTokenResponse>(
      "/api/v1/auth/login",
      "POST",
      payload,
    );

    const user = await this.getUserFromToken(response.accessToken);
    if (user) {
      const hookContext = this.hooks.createBaseContext(ip, userAgent, path);
      await this.hooks.triggerLogin({
        ...hookContext,
        user,
        token: response.accessToken,
      });
    }

    return response;
  }

  async logout(
    token: string,
    ip: string,
    userAgent: string,
    path: string,
  ): Promise<void> {
    const user = await this.getUserFromToken(token);

    try {
      await this.makeRequest("/api/v1/auth/logout", "POST", undefined, token);
    } catch {
      // Ignore logout errors
    }

    this.cache.delete(token);

    if (user) {
      const hookContext = this.hooks.createBaseContext(ip, userAgent, path);
      await this.hooks.triggerLogout({
        ...hookContext,
        user,
        token,
      });
    }
  }

  async refreshToken(
    refreshToken: string,
    ip: string,
    userAgent: string,
    path: string,
  ): Promise<ServerTokenResponse> {
    const response = await this.makeRequest<ServerTokenResponse>(
      "/api/v1/auth/refresh",
      "POST",
      { refreshToken },
    );

    const user = await this.getUserFromToken(response.accessToken);
    if (user) {
      const hookContext = this.hooks.createBaseContext(ip, userAgent, path);
      await this.hooks.triggerTokenRefresh({
        ...hookContext,
        user,
        oldToken: refreshToken,
        newToken: response.accessToken,
      });
    }

    return response;
  }

  async validateToken(token: string): Promise<TokenValidationResult> {
    const cached = this.cache.get(token);
    if (cached && cached.expiresAt > Date.now()) {
      return {
        valid: true,
        user: cached.user,
        expiresAt: cached.expiresAt,
      };
    }

    try {
      const user = await this.makeRequest<UserContext>(
        "/api/v1/auth/validate",
        "POST",
        { token },
        this.config.systemKey,
      );

      const expiresAt = Date.now() + 3600 * 1000;
      this.cache.set(token, user, expiresAt);

      return {
        valid: true,
        user,
        expiresAt,
      };
    } catch (err) {
      return {
        valid: false,
        error: err instanceof Error ? err.message : "Token validation failed",
      };
    }
  }

  async generateToken(input: GenerateTokenInput): Promise<ServerTokenResponse> {
    const payload = {
      userId: input.userId,
      email: input.email,
      name: input.name,
      roles: input.roles || ["user"],
      permissions: input.permissions || [],
      context: input.context || "user",
      expiresIn: input.expiresIn || 3600,
      metadata: input.metadata,
    };

    return this.makeRequest<ServerTokenResponse>(
      "/api/v1/auth/token/generate",
      "POST",
      payload,
      this.config.systemKey,
    );
  }

  async getUserFromToken(token: string): Promise<UserContext | null> {
    const cached = this.cache.get(token);
    if (cached) {
      return cached.user;
    }

    const validation = await this.validateToken(token);
    return validation.user || null;
  }

  hasRole(user: UserContext, requiredRoles: string[]): boolean {
    return requiredRoles.some((role) => user.roles.includes(role));
  }

  hasPermission(user: UserContext, requiredPermissions: string[]): boolean {
    return requiredPermissions.every((perm) => user.permissions.includes(perm));
  }

  requiresMFA(context: ContextType): boolean {
    if (typeof this.config.mfaRequired === "boolean") {
      return this.config.mfaRequired;
    }
    return this.config.mfaRequired.includes(context);
  }

  extractTokenFromHeader(headerValue: string | undefined): string | null {
    if (!headerValue) return null;

    const value = Array.isArray(headerValue) ? headerValue[0] : headerValue;
    if (!value) return null;

    const [prefix, token] = value.split(" ");

    if (prefix?.toLowerCase() !== this.config.tokenPrefix) {
      return null;
    }

    return token || null;
  }

  private async makeRequest<T>(
    endpoint: string,
    method: string,
    body?: Record<string, unknown>,
    authToken?: string,
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Client-ID": this.config.clientId,
    };

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    } else if (this.config.systemKey) {
      headers["Authorization"] = `Bearer ${this.config.systemKey}`;
    }

    const response = await this.fetcher(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = (await response
        .json()
        .catch(() => ({ message: "Unknown error" }))) as { message?: string };
      throw new Error(
        errorData.message || `Request failed: ${response.status}`,
      );
    }

    return response.json() as Promise<T>;
  }
}

export { ServerHelpers };
