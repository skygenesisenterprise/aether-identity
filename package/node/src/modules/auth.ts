import type { Transport } from "../core/transport";
import type { SessionManager } from "../core/session";
import type { AuthInput, StrengthenInput, TokenResponse } from "../types";
import { SessionExpiredError } from "../errors";

interface AuthModuleDeps {
  transport: Transport;
  session: SessionManager;
}

class AuthModule {
  private transport: Transport;
  private session: SessionManager;

  constructor(deps: AuthModuleDeps) {
    this.transport = deps.transport;
    this.session = deps.session;
  }

  async login(input: AuthInput): Promise<void> {
    const payload: any = {
      email: input.email,
      password: input.password,
    };

    if (input._totpCode) {
      payload.totpCode = input._totpCode;
    }

    const response = await this.transport.post<TokenResponse>(
      "/api/v1/auth/login",
      payload,
    );

    this.session.setTokens(response);
  }

  async logout(): Promise<void> {
    const accessToken = this.session.getAccessToken();

    if (accessToken) {
      try {
        await this.transport.post(
          "/api/v1/auth/logout",
          undefined,
          accessToken,
        );
      } catch {}
    }

    this.session.clear();
  }

  async strengthen(input: StrengthenInput): Promise<void> {
    const accessToken = this.session.getAccessToken();

    if (!accessToken) {
      throw new SessionExpiredError();
    }

    await this.transport.post(
      "/api/v1/auth/strengthen",
      {
        type: input.type,
        value: input.value,
      },
      accessToken,
    );
  }
}

export { AuthModule };
