import type { Transport } from "../core/transport";
import type { SessionManager } from "../core/session";
import type { SessionResponse } from "../types";
interface SessionModuleDeps {
    transport: Transport;
    session: SessionManager;
}
declare class SessionModule {
    private transport;
    private session;
    constructor(deps: SessionModuleDeps);
    current(): Promise<SessionResponse>;
    isAuthenticated(): boolean;
}
export { SessionModule };
//# sourceMappingURL=session.d.ts.map