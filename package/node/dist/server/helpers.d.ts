import type { UserContext, ServerLoginCredentials, GenerateTokenInput, ServerTokenResponse, TokenValidationResult, ContextType } from "./types";
import type { ValidatedConfig } from "./config";
import type { TokenCache } from "./cache";
import type { HookManager } from "./hooks";
declare class ServerHelpers {
    private config;
    private cache;
    private hooks;
    private fetcher;
    constructor(config: ValidatedConfig, cache: TokenCache, hooks: HookManager, fetcher: typeof fetch);
    login(credentials: ServerLoginCredentials, ip: string, userAgent: string, path: string): Promise<ServerTokenResponse>;
    logout(token: string, ip: string, userAgent: string, path: string): Promise<void>;
    refreshToken(refreshToken: string, ip: string, userAgent: string, path: string): Promise<ServerTokenResponse>;
    validateToken(token: string): Promise<TokenValidationResult>;
    generateToken(input: GenerateTokenInput): Promise<ServerTokenResponse>;
    getUserFromToken(token: string): Promise<UserContext | null>;
    hasRole(user: UserContext, requiredRoles: string[]): boolean;
    hasPermission(user: UserContext, requiredPermissions: string[]): boolean;
    requiresMFA(context: ContextType): boolean;
    extractTokenFromHeader(headerValue: string | undefined): string | null;
    private makeRequest;
}
export { ServerHelpers };
//# sourceMappingURL=helpers.d.ts.map