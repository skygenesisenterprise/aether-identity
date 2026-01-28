import type { Transport } from "../core/transport";
import type { SessionManager } from "../core/session";
import type { EIDVerifyInput, EIDStatusResponse } from "../types";
interface EIDModuleDeps {
    transport: Transport;
    session: SessionManager;
}
declare class EIDModule {
    private transport;
    private session;
    constructor(deps: EIDModuleDeps);
    verify(input: EIDVerifyInput): Promise<void>;
    status(): Promise<EIDStatusResponse>;
    revoke(): Promise<void>;
}
export { EIDModule };
//# sourceMappingURL=eid.d.ts.map