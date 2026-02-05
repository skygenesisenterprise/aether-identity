import type { IdentityServerHooks, HookContext, LoginHookContext, LogoutHookContext, TokenRefreshHookContext, MFARequiredHookContext, RoleCheckHookContext, UnauthorizedInfo } from "./types";
declare class HookManager {
    private hooks;
    constructor(hooks?: IdentityServerHooks);
    triggerLogin(context: LoginHookContext): Promise<void>;
    triggerLogout(context: LogoutHookContext): Promise<void>;
    triggerTokenRefresh(context: TokenRefreshHookContext): Promise<void>;
    triggerUnauthorizedAttempt(context: HookContext, info: UnauthorizedInfo): Promise<void>;
    triggerMFARequired(context: MFARequiredHookContext): Promise<void>;
    triggerRoleCheck(context: RoleCheckHookContext): Promise<void>;
    createBaseContext(ip: string, userAgent: string, path: string): HookContext;
    private generateRequestId;
}
export { HookManager };
//# sourceMappingURL=hooks.d.ts.map