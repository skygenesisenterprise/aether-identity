import type { Transport } from "../core/transport";
import type { SessionManager } from "../core/session";
interface TokenModuleDeps {
    transport: Transport;
    session: SessionManager;
}
declare class TokenModule {
    private transport;
    private session;
    constructor(deps: TokenModuleDeps);
    refresh(): Promise<void>;
    revoke(): Promise<void>;
}
export { TokenModule };
//# sourceMappingURL=token.d.ts.map