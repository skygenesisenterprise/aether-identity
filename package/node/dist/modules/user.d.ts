import type { Transport } from "../core/transport";
import type { SessionManager } from "../core/session";
import type { UserProfile, UserRoles } from "../types";
interface UserModuleDeps {
    transport: Transport;
    session: SessionManager;
}
declare class UserModule {
    private transport;
    private session;
    constructor(deps: UserModuleDeps);
    profile(): Promise<UserProfile>;
    roles(): Promise<UserRoles[]>;
    hasPermission(permission: string): Promise<boolean>;
}
export { UserModule };
//# sourceMappingURL=user.d.ts.map