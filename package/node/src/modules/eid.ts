import type { Transport } from "../core/transport";
import type { SessionManager } from "../core/session";
import type { EIDVerifyInput, EIDStatusResponse } from "../types";
import { SessionExpiredError } from "../errors";

interface EIDModuleDeps {
  transport: Transport;
  session: SessionManager;
}

class EIDModule {
  private transport: Transport;
  private session: SessionManager;

  constructor(deps: EIDModuleDeps) {
    this.transport = deps.transport;
    this.session = deps.session;
  }

  async verify(input: EIDVerifyInput): Promise<void> {
    const accessToken = this.session.getAccessToken();

    if (!accessToken) {
      throw new SessionExpiredError();
    }

    await this.transport.post("/api/v1/eid/verify", input, accessToken);
  }

  async status(): Promise<EIDStatusResponse> {
    const accessToken = this.session.getAccessToken();

    if (!accessToken) {
      throw new SessionExpiredError();
    }

    return this.transport.get<EIDStatusResponse>(
      "/api/v1/eid/status",
      accessToken,
    );
  }

  async revoke(): Promise<void> {
    const accessToken = this.session.getAccessToken();

    if (!accessToken) {
      throw new SessionExpiredError();
    }

    await this.transport.post("/api/v1/eid/revoke", undefined, accessToken);
  }
}

export { EIDModule };
