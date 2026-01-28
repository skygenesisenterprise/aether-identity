import { SessionExpiredError } from "../errors";
class TokenModule {
    transport;
    session;
    constructor(deps) {
        this.transport = deps.transport;
        this.session = deps.session;
    }
    async refresh() {
        const refreshToken = this.session.getRefreshToken();
        if (!refreshToken) {
            throw new SessionExpiredError();
        }
        const response = await this.transport.post("/api/v1/auth/refresh", { refreshToken });
        this.session.setAccessToken(response.accessToken, response.expiresIn);
    }
    async revoke() {
        const accessToken = this.session.getAccessToken();
        if (!accessToken) {
            return;
        }
        try {
            await this.transport.post("/api/v1/auth/token/revoke", undefined, accessToken);
        }
        catch { }
        this.session.clear();
    }
}
export { TokenModule };
//# sourceMappingURL=token.js.map