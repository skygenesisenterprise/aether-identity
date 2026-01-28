import type { Transport } from "../core/transport";
import type { SessionManager } from "../core/session";
import type { SessionResponse, UserProfile } from "../types";

interface SessionModuleDeps {
  transport: Transport;
  session: SessionManager;
}

class SessionModule {
  private transport: Transport;
  private session: SessionManager;

  constructor(deps: SessionModuleDeps) {
    this.transport = deps.transport;
    this.session = deps.session;
  }

  async current(): Promise<SessionResponse> {
    const accessToken = this.session.getAccessToken();

    if (!accessToken || !this.session.isAuthenticated()) {
      return {
        isAuthenticated: false,
      };
    }

    const user = await this.transport.get<UserProfile>(
      "/api/v1/userinfo",
      accessToken,
    );

    const expiresAt = this.session.getExpiresAt();

    return {
      isAuthenticated: true,
      user,
      expiresAt: expiresAt ?? undefined,
    };
  }

  isAuthenticated(): boolean {
    return this.session.isAuthenticated();
  }
}

export { SessionModule };
