import type { Transport } from "../core/transport";
import type { SessionManager } from "../core/session";
import type { AuthInput, StrengthenInput } from "../types";
interface AuthModuleDeps {
    transport: Transport;
    session: SessionManager;
}
declare class AuthModule {
    private transport;
    private session;
    constructor(deps: AuthModuleDeps);
    login(input: AuthInput): Promise<void>;
    logout(): Promise<void>;
    strengthen(input: StrengthenInput): Promise<void>;
}
export { AuthModule };
//# sourceMappingURL=auth.d.ts.map