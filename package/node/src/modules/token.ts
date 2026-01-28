import type { Transport } from "../core/transport";
import type { SessionManager } from "../core/session";
import type { TokenResponse } from "../types";
import { SessionExpiredError } from "../errors";

interface TokenModuleDeps {
  transport: Transport;
  session: SessionManager;
}

class TokenModule {
  private transport: Transport;
  private session: SessionManager;

  constructor(deps: TokenModuleDeps) {
    this.transport = deps.transport;
    this.session = deps.session;
  }

  async refresh(): Promise<void> {
    const refreshToken = this.session.getRefreshToken();

    if (!refreshToken) {
      throw new SessionExpiredError();
    }

    const response = await this.transport.post<TokenResponse>(
      "/api/v1/auth/refresh",
      { refreshToken },
    );

    this.session.setAccessToken(response.accessToken, response.expiresIn);
  }

  async revoke(): Promise<void> {
    const accessToken = this.session.getAccessToken();

    if (!accessToken) {
      return;
    }

    try {
      await this.transport.post(
        "/api/v1/auth/token/revoke",
        undefined,
        accessToken,
      );
    } catch {}

    this.session.clear();
  }
}

export { TokenModule };
