class ServerHelpers {
    config;
    cache;
    hooks;
    fetcher;
    constructor(config, cache, hooks, fetcher) {
        this.config = config;
        this.cache = cache;
        this.hooks = hooks;
        this.fetcher = fetcher;
    }
    async login(credentials, ip, userAgent, path) {
        const payload = {
            email: credentials.email,
            password: credentials.password,
        };
        if (credentials.totpCode) {
            payload.totpCode = credentials.totpCode;
        }
        if (credentials.context) {
            payload.context = credentials.context;
        }
        const response = await this.makeRequest("/api/v1/auth/login", "POST", payload);
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
    async logout(token, ip, userAgent, path) {
        const user = await this.getUserFromToken(token);
        try {
            await this.makeRequest("/api/v1/auth/logout", "POST", undefined, token);
        }
        catch {
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
    async refreshToken(refreshToken, ip, userAgent, path) {
        const response = await this.makeRequest("/api/v1/auth/refresh", "POST", { refreshToken });
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
    async validateToken(token) {
        const cached = this.cache.get(token);
        if (cached && cached.expiresAt > Date.now()) {
            return {
                valid: true,
                user: cached.user,
                expiresAt: cached.expiresAt,
            };
        }
        try {
            const user = await this.makeRequest("/api/v1/auth/validate", "POST", { token }, this.config.systemKey);
            const expiresAt = Date.now() + 3600 * 1000;
            this.cache.set(token, user, expiresAt);
            return {
                valid: true,
                user,
                expiresAt,
            };
        }
        catch (err) {
            return {
                valid: false,
                error: err instanceof Error ? err.message : "Token validation failed",
            };
        }
    }
    async generateToken(input) {
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
        return this.makeRequest("/api/v1/auth/token/generate", "POST", payload, this.config.systemKey);
    }
    async getUserFromToken(token) {
        const cached = this.cache.get(token);
        if (cached) {
            return cached.user;
        }
        const validation = await this.validateToken(token);
        return validation.user || null;
    }
    hasRole(user, requiredRoles) {
        return requiredRoles.some((role) => user.roles.includes(role));
    }
    hasPermission(user, requiredPermissions) {
        return requiredPermissions.every((perm) => user.permissions.includes(perm));
    }
    requiresMFA(context) {
        if (typeof this.config.mfaRequired === "boolean") {
            return this.config.mfaRequired;
        }
        return this.config.mfaRequired.includes(context);
    }
    extractTokenFromHeader(headerValue) {
        if (!headerValue)
            return null;
        const value = Array.isArray(headerValue) ? headerValue[0] : headerValue;
        if (!value)
            return null;
        const [prefix, token] = value.split(" ");
        if (prefix?.toLowerCase() !== this.config.tokenPrefix) {
            return null;
        }
        return token || null;
    }
    async makeRequest(endpoint, method, body, authToken) {
        const url = `${this.config.baseUrl}${endpoint}`;
        const headers = {
            "Content-Type": "application/json",
            "X-Client-ID": this.config.clientId,
        };
        if (authToken) {
            headers["Authorization"] = `Bearer ${authToken}`;
        }
        else if (this.config.systemKey) {
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
                .catch(() => ({ message: "Unknown error" })));
            throw new Error(errorData.message || `Request failed: ${response.status}`);
        }
        return response.json();
    }
}
export { ServerHelpers };
//# sourceMappingURL=helpers.js.map