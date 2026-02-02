import { SessionExpiredError } from "../errors";
class TOTPModule {
    transport;
    session;
    config;
    constructor(deps) {
        this.transport = deps.transport;
        this.session = deps.session;
        this.config = deps.config;
    }
    async setup() {
        const accessToken = this.session.getAccessToken();
        if (!accessToken) {
            throw new SessionExpiredError();
        }
        const headers = {};
        if (this.config?.issuer) {
            headers["X-TOTP-Issuer"] = this.config.issuer;
        }
        return this.transport.post("/api/v1/auth/totp/setup", undefined, accessToken);
    }
    async verify(input) {
        const accessToken = this.session.getAccessToken();
        if (!accessToken) {
            throw new SessionExpiredError();
        }
        await this.transport.post("/api/v1/auth/totp/verify", {
            code: input.code,
            secret: input.secret,
        }, accessToken);
    }
    async disable() {
        const accessToken = this.session.getAccessToken();
        if (!accessToken) {
            throw new SessionExpiredError();
        }
        await this.transport.post("/api/v1/auth/totp/disable", undefined, accessToken);
    }
    async getStatus() {
        const accessToken = this.session.getAccessToken();
        if (!accessToken) {
            throw new SessionExpiredError();
        }
        return this.transport.get("/api/v1/auth/totp/status", accessToken);
    }
    async login(input, oauthParams) {
        const endpoint = this.buildLoginEndpoint(oauthParams);
        const response = await this.transport.post(endpoint, {
            email: input.email,
            password: input.password,
            totpCode: input.totpCode,
        });
        this.session.setTokens(response);
        return response;
    }
    buildLoginEndpoint(oauthParams) {
        if (!oauthParams || Object.keys(oauthParams).length === 0) {
            return "/api/v1/auth/totp/login";
        }
        const params = new URLSearchParams();
        if (oauthParams.client_id)
            params.set("client_id", oauthParams.client_id);
        if (oauthParams.redirect_uri)
            params.set("redirect_uri", oauthParams.redirect_uri);
        if (oauthParams.response_type)
            params.set("response_type", oauthParams.response_type);
        if (oauthParams.scope)
            params.set("scope", oauthParams.scope);
        if (oauthParams.state)
            params.set("state", oauthParams.state);
        return `/api/v1/auth/totp/login?${params.toString()}`;
    }
}
export { TOTPModule };
//# sourceMappingURL=totp.js.map