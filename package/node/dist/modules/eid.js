import { SessionExpiredError } from "../errors";
class EIDModule {
    transport;
    session;
    constructor(deps) {
        this.transport = deps.transport;
        this.session = deps.session;
    }
    async verify(input) {
        const accessToken = this.session.getAccessToken();
        if (!accessToken) {
            throw new SessionExpiredError();
        }
        await this.transport.post("/api/v1/eid/verify", input, accessToken);
    }
    async status() {
        const accessToken = this.session.getAccessToken();
        if (!accessToken) {
            throw new SessionExpiredError();
        }
        return this.transport.get("/api/v1/eid/status", accessToken);
    }
    async revoke() {
        const accessToken = this.session.getAccessToken();
        if (!accessToken) {
            throw new SessionExpiredError();
        }
        await this.transport.post("/api/v1/eid/revoke", undefined, accessToken);
    }
}
export { EIDModule };
//# sourceMappingURL=eid.js.map