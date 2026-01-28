import { IdentityError, AuthenticationError, AuthorizationError, SessionExpiredError, TOTPRequiredError, DeviceNotAvailableError, NetworkError, ServerError, } from "./errors";
import { Transport as TransportImpl } from "./core/transport";
import { SessionManager as SessionManagerImpl } from "./core/session";
import { AuthModule } from "./modules/auth";
import { SessionModule } from "./modules/session";
import { UserModule } from "./modules/user";
import { TokenModule } from "./modules/token";
import { EIDModule } from "./modules/eid";
import { MachineModule } from "./modules/machine";
import { DeviceModule } from "./modules/device";
class IdentityClient {
    auth;
    session;
    user;
    token;
    eid;
    machine;
    device;
    transport;
    sessionManager;
    constructor(config) {
        const fetcher = config.fetcher ||
            (typeof fetch !== "undefined" ? fetch : require("node-fetch").default);
        this.transport = new TransportImpl({
            baseUrl: config.baseUrl,
            fetcher,
            clientId: config.clientId,
        });
        this.sessionManager = new SessionManagerImpl();
        if (config.accessToken) {
            this.sessionManager.setToken(config.accessToken);
        }
        this.auth = new AuthModule({
            transport: this.transport,
            session: this.sessionManager,
        });
        this.session = new SessionModule({
            transport: this.transport,
            session: this.sessionManager,
        });
        this.user = new UserModule({
            transport: this.transport,
            session: this.sessionManager,
        });
        this.token = new TokenModule({
            transport: this.transport,
            session: this.sessionManager,
        });
        this.eid = new EIDModule({
            transport: this.transport,
            session: this.sessionManager,
        });
        this.machine = new MachineModule({
            transport: this.transport,
            clientId: config.clientId,
        });
        this.device = new DeviceModule({
            transport: this.transport,
            session: this.sessionManager,
        });
    }
}
function CreateIdentityClient(config) {
    return new IdentityClient(config);
}
export { CreateIdentityClient, IdentityClient };
export { IdentityError, AuthenticationError, AuthorizationError, SessionExpiredError, TOTPRequiredError, DeviceNotAvailableError, NetworkError, ServerError, };
export * from "./core/transport";
export * from "./core/session";
//# sourceMappingURL=index.js.map