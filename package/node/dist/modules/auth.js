import { SessionExpiredError } from "../errors";
class AuthModule {
    transport;
    session;
    constructor(deps) {
        this.transport = deps.transport;
        this.session = deps.session;
    }
    async login(input, oauthParams) {
        const payload = {
            email: input.email,
            password: input.password,
        };
        if (input._totpCode) {
            payload.totpCode = input._totpCode;
        }
        const endpoint = this.buildLoginEndpoint(oauthParams);
        const response = await this.transport.post(endpoint, payload);
        this.session.setTokens(response);
    }
    async register(input) {
        const payload = {
            email: input.email,
            password: input.password,
        };
        if (input.name) {
            payload.name = input.name;
        }
        return this.transport.post("/api/v1/auth/register", payload, undefined, true);
    }
    buildLoginEndpoint(oauthParams) {
        if (!oauthParams || Object.keys(oauthParams).length === 0) {
            return "/api/v1/auth/login";
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
        return `/api/v1/auth/login?${params.toString()}`;
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