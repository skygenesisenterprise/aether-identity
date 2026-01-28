import type { Transport } from "../core/transport";
import type { MachineEnrollmentResponse, MachineTokenResponse } from "../types";
interface MachineModuleDeps {
    transport: Transport;
    clientId: string;
}
declare class MachineModule {
    private transport;
    private clientId;
    constructor(deps: MachineModuleDeps);
    enroll(): Promise<MachineEnrollmentResponse>;
    token(secret: string): Promise<MachineTokenResponse>;
    revoke(secret: string): Promise<void>;
}
export { MachineModule };
//# sourceMappingURL=machine.d.ts.map