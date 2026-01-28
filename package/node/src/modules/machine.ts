import type { Transport } from "../core/transport";
import type { MachineEnrollmentResponse, MachineTokenResponse } from "../types";

interface MachineModuleDeps {
  transport: Transport;
  clientId: string;
}

class MachineModule {
  private transport: Transport;
  private clientId: string;

  constructor(deps: MachineModuleDeps) {
    this.transport = deps.transport;
    this.clientId = deps.clientId;
  }

  async enroll(): Promise<MachineEnrollmentResponse> {
    return this.transport.post<MachineEnrollmentResponse>(
      "/api/v1/machine/enroll",
      {
        clientId: this.clientId,
      },
    );
  }

  async token(secret: string): Promise<MachineTokenResponse> {
    return this.transport.post<MachineTokenResponse>("/oauth2/token", {
      grant_type: "client_credentials",
      client_id: this.clientId,
      client_secret: secret,
    });
  }

  async revoke(secret: string): Promise<void> {
    await this.transport.post("/oauth2/revoke", {
      client_id: this.clientId,
      client_secret: secret,
    });
  }
}

export { MachineModule };
