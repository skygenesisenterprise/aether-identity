import type { Transport } from "../core/transport";
import type { SessionManager } from "../core/session";
import type { DeviceInfo, DeviceStatusResponse } from "../types";
interface DeviceModuleDeps {
    transport: Transport;
    session: SessionManager;
}
declare class DeviceModule {
    private transport;
    private session;
    constructor(deps: DeviceModuleDeps);
    detect(): Promise<DeviceInfo[]>;
    status(): Promise<DeviceStatusResponse>;
}
export { DeviceModule };
//# sourceMappingURL=device.d.ts.map