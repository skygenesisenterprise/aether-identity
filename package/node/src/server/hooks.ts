import type {
  IdentityServerHooks,
  HookContext,
  LoginHookContext,
  LogoutHookContext,
  TokenRefreshHookContext,
  MFARequiredHookContext,
  RoleCheckHookContext,
  UnauthorizedInfo,
} from "./types";

class HookManager {
  private hooks: IdentityServerHooks;

  constructor(hooks?: IdentityServerHooks) {
    this.hooks = hooks || {};
  }

  async triggerLogin(context: LoginHookContext): Promise<void> {
    if (this.hooks.onLogin) {
      try {
        await this.hooks.onLogin(context);
      } catch {
        // Hooks should not throw - log silently in production
      }
    }
  }

  async triggerLogout(context: LogoutHookContext): Promise<void> {
    if (this.hooks.onLogout) {
      try {
        await this.hooks.onLogout(context);
      } catch {
        // Hooks should not throw
      }
    }
  }

  async triggerTokenRefresh(context: TokenRefreshHookContext): Promise<void> {
    if (this.hooks.onTokenRefresh) {
      try {
        await this.hooks.onTokenRefresh(context);
      } catch {
        // Hooks should not throw
      }
    }
  }

  async triggerUnauthorizedAttempt(
    context: HookContext,
    info: UnauthorizedInfo,
  ): Promise<void> {
    if (this.hooks.onUnauthorizedAttempt) {
      try {
        await this.hooks.onUnauthorizedAttempt(context, info);
      } catch {
        // Hooks should not throw
      }
    }
  }

  async triggerMFARequired(context: MFARequiredHookContext): Promise<void> {
    if (this.hooks.onMFARequired) {
      try {
        await this.hooks.onMFARequired(context);
      } catch {
        // Hooks should not throw
      }
    }
  }

  async triggerRoleCheck(context: RoleCheckHookContext): Promise<void> {
    if (this.hooks.onRoleCheck) {
      try {
        await this.hooks.onRoleCheck(context);
      } catch {
        // Hooks should not throw
      }
    }
  }

  createBaseContext(ip: string, userAgent: string, path: string): HookContext {
    return {
      ip,
      userAgent,
      timestamp: Date.now(),
      requestId: this.generateRequestId(),
      path,
    };
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export { HookManager };
