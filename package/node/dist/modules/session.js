class SessionModule {
    transport;
    session;
    constructor(deps) {
        this.transport = deps.transport;
        this.session = deps.session;
    }
    async current() {
        const accessToken = this.session.getAccessToken();
        if (!accessToken || !this.session.isAuthenticated()) {
            return {
                isAuthenticated: false,
            };
        }
        const user = await this.transport.get("/api/v1/userinfo", accessToken);
        const expiresAt = this.session.getExpiresAt();
        return {
            isAuthenticated: true,
            user,
            expiresAt: expiresAt ?? undefined,
        };
    }
    isAuthenticated() {
        return this.session.isAuthenticated();
    }
}
export { SessionModule };
//# sourceMappingURL=session.js.map