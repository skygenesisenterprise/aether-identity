import type { ExpressMiddleware } from "./types";
import type { ValidatedConfig } from "./config";
import type { TokenCache } from "./cache";
import type { HookManager } from "./hooks";
import type { ServerHelpers } from "./helpers";
interface MiddlewareDependencies {
    config: ValidatedConfig;
    cache: TokenCache;
    hooks: HookManager;
    helpers: ServerHelpers;
}
declare class MiddlewareFactory {
    private deps;
    constructor(deps: MiddlewareDependencies);
    authMiddleware(): ExpressMiddleware;
    rbacMiddleware(roles: string[]): ExpressMiddleware;
    protectRoute(roles?: string[]): ExpressMiddleware;
    mfaMiddleware(): ExpressMiddleware;
    contextMiddleware(context: string): ExpressMiddleware;
    private extractToken;
    private getUserAgent;
    private triggerUnauthorized;
}
export { MiddlewareFactory };
export type { MiddlewareDependencies };
//# sourceMappingURL=middleware.d.ts.map