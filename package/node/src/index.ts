import type {
  IdentityClientConfig,
  FetchLike,
  AuthInput,
  StrengthenInput,
  UserProfile,
  UserRoles,
  TokenResponse,
  SessionResponse,
  EIDVerifyInput,
  EIDStatusResponse,
  DeviceInfo,
  DeviceStatusResponse,
  MachineEnrollmentResponse,
  MachineTokenResponse,
  TOTPConfig,
  TOTPSetupResponse,
  TOTPVerifyInput,
  TOTPStatusResponse,
  TOTPLoginInput,
  RegisterInput,
  RegisterResponse,
} from "./types";
import type { Transport } from "./core/transport";
import type { SessionManager } from "./core/session";
import {
  IdentityError,
  AuthenticationError,
  AuthorizationError,
  SessionExpiredError,
  TOTPRequiredError,
  DeviceNotAvailableError,
  NetworkError,
  ServerError,
} from "./errors";

import { Transport as TransportImpl } from "./core/transport";
import { SessionManager as SessionManagerImpl } from "./core/session";

import { AuthModule, OAuthParams } from "./modules/auth";
import { SessionModule } from "./modules/session";
import { UserModule } from "./modules/user";
import { TokenModule } from "./modules/token";
import { EIDModule } from "./modules/eid";
import { MachineModule } from "./modules/machine";
import { DeviceModule } from "./modules/device";
import { TOTPModule } from "./modules/totp";

class IdentityClient {
  public readonly auth: AuthModule;
  public readonly session: SessionModule;
  public readonly user: UserModule;
  public readonly token: TokenModule;
  public readonly eid: EIDModule;
  public readonly machine: MachineModule;
  public readonly device: DeviceModule;
  public readonly totp: TOTPModule;

  private transport: Transport;
  private sessionManager: SessionManager;

  constructor(config: IdentityClientConfig) {
    const fetcher: FetchLike = config.fetcher || fetch;

    this.transport = new TransportImpl({
      baseUrl: config.baseUrl,
      fetcher,
      clientId: config.clientId,
      systemKey: config.systemKey,
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

    this.totp = new TOTPModule({
      transport: this.transport,
      session: this.sessionManager,
      config: config.totp,
    });
  }
}

function CreateIdentityClient(config: IdentityClientConfig): IdentityClient {
  return new IdentityClient(config);
}

export { CreateIdentityClient, IdentityClient };

export type {
  IdentityClientConfig,
  AuthInput,
  StrengthenInput,
  UserProfile,
  UserRoles,
  TokenResponse,
  SessionResponse,
  EIDVerifyInput,
  EIDStatusResponse,
  DeviceInfo,
  DeviceStatusResponse,
  MachineEnrollmentResponse,
  MachineTokenResponse,
  TOTPConfig,
  TOTPSetupResponse,
  TOTPVerifyInput,
  TOTPStatusResponse,
  TOTPLoginInput,
  RegisterInput,
  RegisterResponse,
  FetchLike,
  OAuthParams,
};

export {
  IdentityError,
  AuthenticationError,
  AuthorizationError,
  SessionExpiredError,
  TOTPRequiredError,
  DeviceNotAvailableError,
  NetworkError,
  ServerError,
};

export * from "./core/transport";
export * from "./core/session";
