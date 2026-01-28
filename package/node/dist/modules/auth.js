import { SessionExpiredError } from "../errors";
class AuthModule {
    transport;
    session;
    constructor(deps) {
        this.transport = deps.transport;
        this.session = deps.session;
    }
    async login(input) {
        const payload = {
            email: input.email,
            password: input.password,
        };
        if (input._totpCode) {
            payload.totpCode = input._totpCode;
        }
        const response = await this.transport.post("/api/v1/auth/login", payload);
        this.session.setTokens(response);
    }
    async logout() {
        const accessToken = this.session.getAccessToken();
        if (accessToken) {
            try {
                await this.transport.post("/api/v1/auth/logout", undefined, accessToken);
            }
            catch { }
        }
        this.session.clear();
    }
    async strengthen(input) {
        const accessToken = this.session.getAccessToken();
        if (!accessToken) {
            throw new SessionExpiredError();
        }
        await this.transport.post("/api/v1/auth/strengthen", {
            type: input.type,
            value: input.value,
        }, accessToken);
    }
}
export { AuthModule };
//# sourceMappingURL=auth.js.map