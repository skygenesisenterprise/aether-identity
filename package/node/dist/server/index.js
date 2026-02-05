import { validateAndNormalizeConfig } from "./config";
import { TokenCache } from "./cache";
import { HookManager } from "./hooks";
import { ServerHelpers } from "./helpers";
import { MiddlewareFactory } from "./middleware";
class IdentityServer {
    config;
    cache;
    hooks;
    helpers;
    middlewares;
    constructor(config) {
        this.config = validateAndNormalizeConfig(config);
        this.cache = new TokenCache(this.config.cache.maxSize, this.config.cache.ttl);
        this.hooks = new HookManager(config.hooks);
        this.helpers = new ServerHelpers(this.config, this.cache, this.hooks, fetch);
        const deps = {
            config: this.config,
            cache: this.cache,
            hooks: this.hooks,
            helpers: this.helpers,
        };
        this.middlewares = new MiddlewareFactory(deps);
    }
    authMiddleware() {
        return this.middlewares.authMiddleware();
    }
    rbacMiddleware(roles) {
        return this.middlewares.rbacMiddleware(roles);
    }
    protectRoute(roles) {
        return this.middlewares.protectRoute(roles);
    }
    mfaMiddleware() {
        return this.middlewares.mfaMiddleware();
    }
    contextMiddleware(context) {
        return this.middlewares.contextMiddleware(context);
    }
    async login(credentials, ip, userAgent, path) {
        return this.helpers.login(credentials, ip, userAgent, path);
    }
    async logout(token, ip, userAgent, path) {
        return this.helpers.logout(token, ip, userAgent, path);
    }
    async refreshToken(refreshToken, ip, userAgent, path) {
        return this.helpers.refreshToken(refreshToken, ip, userAgent, path);
    }
    async validateToken(token) {
        return this.helpers.validateToken(token);
    }
    async generateToken(input) {
        return this.helpers.generateToken(input);
    }
    async getUserFromToken(token) {
        return this.helpers.getUserFromToken(token);
    }
    hasRole(user, roles) {
        return this.helpers.hasRole(user, roles);
    }
    hasPermission(user, permissions) {
        return this.helpers.hasPermission(user, permissions);
    }
    requiresMFA(context) {
        return this.helpers.requiresMFA(context);
    }
    extractTokenFromHeader(headerValue) {
        return this.helpers.extractTokenFromHeader(headerValue);
    }
    registerHooks(hooks) {
        this.hooks = new HookManager(hooks);
    }
    clearCache() {
        this.cache.clear();
    }
    getCacheSize() {
        return this.cache.size;
    }
}
function CreateIdentityServer(config) {
    const server = new IdentityServer(config);
    return {
        // Middlewares
        authMiddleware: () => server.authMiddleware(),
        rbacMiddleware: (roles) => server.rbacMiddleware(roles),
        protectRoute: (roles) => server.protectRoute(roles),
        mfaMiddleware: () => server.mfaMiddleware(),
        contextMiddleware: (context) => server.contextMiddleware(context),
        // Helpers
        login: (credentials, ip, userAgent, path) => server.login(credentials, ip, userAgent, path),
        logout: (token, ip, userAgent, path) => server.logout(token, ip, userAgent, path),
        refreshToken: (refreshToken, ip, userAgent, path) => server.refreshToken(refreshToken, ip, userAgent, path),
        validateToken: (token) => server.validateToken(token),
        generateToken: (input) => server.generateToken(input),
        getUserFromToken: (token) => server.getUserFromToken(token),
        hasRole: (user, roles) => server.hasRole(user, roles),
        hasPermission: (user, permissions) => server.hasPermission(user, permissions),
        requiresMFA: (context) => server.requiresMFA(context),
        extractTokenFromHeader: (headerValue) => server.extractTokenFromHeader(headerValue),
        // Hooks
        registerHooks: (hooks) => server.registerHooks(hooks),
        // Cache
        clearCache: () => server.clearCache(),
        getCacheSize: () => server.getCacheSize(),
    };
}
export { CreateIdentityServer, IdentityServer };
//# sourceMappingURL=index.js.map