import { SessionExpiredError } from "../errors";
class DeviceModule {
    transport;
    session;
    constructor(deps) {
        this.transport = deps.transport;
        this.session = deps.session;
    }
    async detect() {
        const accessToken = this.session.getAccessToken();
        if (!accessToken) {
            throw new SessionExpiredError();
        }
        return this.transport.get("/api/v1/devices", accessToken);
    }
    async status() {
        const accessToken = this.session.getAccessToken();
        if (!accessToken) {
            throw new SessionExpiredError();
        }
        return this.transport.get("/api/v1/devices/status", accessToken);
    }
}
export { DeviceModule };
//# sourceMappingURL=device.js.map