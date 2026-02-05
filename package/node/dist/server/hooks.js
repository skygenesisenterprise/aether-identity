class HookManager {
    hooks;
    constructor(hooks) {
        this.hooks = hooks || {};
    }
    async triggerLogin(context) {
        if (this.hooks.onLogin) {
            try {
                await this.hooks.onLogin(context);
            }
            catch {
                // Hooks should not throw - log silently in production
            }
        }
    }
    async triggerLogout(context) {
        if (this.hooks.onLogout) {
            try {
                await this.hooks.onLogout(context);
            }
            catch {
                // Hooks should not throw
            }
        }
    }
    async triggerTokenRefresh(context) {
        if (this.hooks.onTokenRefresh) {
            try {
                await this.hooks.onTokenRefresh(context);
            }
            catch {
                // Hooks should not throw
            }
        }
    }
    async triggerUnauthorizedAttempt(context, info) {
        if (this.hooks.onUnauthorizedAttempt) {
            try {
                await this.hooks.onUnauthorizedAttempt(context, info);
            }
            catch {
                // Hooks should not throw
            }
        }
    }
    async triggerMFARequired(context) {
        if (this.hooks.onMFARequired) {
            try {
                await this.hooks.onMFARequired(context);
            }
            catch {
                // Hooks should not throw
            }
        }
    }
    async triggerRoleCheck(context) {
        if (this.hooks.onRoleCheck) {
            try {
                await this.hooks.onRoleCheck(context);
            }
            catch {
                // Hooks should not throw
            }
        }
    }
    createBaseContext(ip, userAgent, path) {
        return {
            ip,
            userAgent,
            timestamp: Date.now(),
            requestId: this.generateRequestId(),
            path,
        };
    }
    generateRequestId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}
export { HookManager };
//# sourceMappingURL=hooks.js.map