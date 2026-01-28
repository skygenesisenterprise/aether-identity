import type { Transport } from "../core/transport";
import type { SessionManager } from "../core/session";
import type { DeviceInfo, DeviceStatusResponse } from "../types";
import { SessionExpiredError } from "../errors";

interface DeviceModuleDeps {
  transport: Transport;
  session: SessionManager;
}

class DeviceModule {
  private transport: Transport;
  private session: SessionManager;

  constructor(deps: DeviceModuleDeps) {
    this.transport = deps.transport;
    this.session = deps.session;
  }

  async detect(): Promise<DeviceInfo[]> {
    const accessToken = this.session.getAccessToken();

    if (!accessToken) {
      throw new SessionExpiredError();
    }

    return this.transport.get<DeviceInfo[]>("/api/v1/devices", accessToken);
  }

  async status(): Promise<DeviceStatusResponse> {
    const accessToken = this.session.getAccessToken();

    if (!accessToken) {
      throw new SessionExpiredError();
    }

    return this.transport.get<DeviceStatusResponse>(
      "/api/v1/devices/status",
      accessToken,
    );
  }
}

export { DeviceModule };
