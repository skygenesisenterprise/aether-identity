import type { IdentityClientConfig, FetchLike, AuthInput, StrengthenInput, UserProfile, UserRoles, TokenResponse, SessionResponse, EIDVerifyInput, EIDStatusResponse, DeviceInfo, DeviceStatusResponse, MachineEnrollmentResponse, MachineTokenResponse, TOTPConfig, TOTPSetupResponse, TOTPVerifyInput, TOTPStatusResponse, TOTPLoginInput, RegisterInput, RegisterResponse } from "./types";
import { IdentityError, AuthenticationError, AuthorizationError, SessionExpiredError, TOTPRequiredError, DeviceNotAvailableError, NetworkError, ServerError } from "./errors";
import { AuthModule, OAuthParams } from "./modules/auth";
import { SessionModule } from "./modules/session";
import { UserModule } from "./modules/user";
import { TokenModule } from "./modules/token";
import { EIDModule } from "./modules/eid";
import { MachineModule } from "./modules/machine";
import { DeviceModule } from "./modules/device";
import { TOTPModule } from "./modules/totp";
declare class IdentityClient {
    readonly auth: AuthModule;
    readonly session: SessionModule;
    readonly user: UserModule;
    readonly token: TokenModule;
    readonly eid: EIDModule;
    readonly machine: MachineModule;
    readonly device: DeviceModule;
    readonly totp: TOTPModule;
    private transport;
    private sessionManager;
    constructor(config: IdentityClientConfig);
}
declare function CreateIdentityClient(config: IdentityClientConfig): IdentityClient;
export { CreateIdentityClient, IdentityClient };
export type { IdentityClientConfig, AuthInput, StrengthenInput, UserProfile, UserRoles, TokenResponse, SessionResponse, EIDVerifyInput, EIDStatusResponse, DeviceInfo, DeviceStatusResponse, MachineEnrollmentResponse, MachineTokenResponse, TOTPConfig, TOTPSetupResponse, TOTPVerifyInput, TOTPStatusResponse, TOTPLoginInput, RegisterInput, RegisterResponse, FetchLike, OAuthParams, };
export { IdentityError, AuthenticationError, AuthorizationError, SessionExpiredError, TOTPRequiredError, DeviceNotAvailableError, NetworkError, ServerError, };
export * from "./core/transport";
export * from "./core/session";
//# sourceMappingURL=index.d.ts.map