import type { Transport } from "../core/transport";
import type { SessionManager } from "../core/session";
import type { UserProfile, UserRoles } from "../types";
import { SessionExpiredError } from "../errors";

interface UserModuleDeps {
  transport: Transport;
  session: SessionManager;
}

class UserModule {
  private transport: Transport;
  private session: SessionManager;

  constructor(deps: UserModuleDeps) {
    this.transport = deps.transport;
    this.session = deps.session;
  }

  async profile(): Promise<UserProfile> {
    const accessToken = this.session.getAccessToken();

    if (!accessToken) {
      throw new SessionExpiredError();
    }

    return this.transport.get<UserProfile>("/api/v1/users/me", accessToken);
  }

  async roles(): Promise<UserRoles[]> {
    const accessToken = this.session.getAccessToken();

    if (!accessToken) {
      throw new SessionExpiredError();
    }

    const user = await this.transport.get<UserProfile>(
      "/api/v1/userinfo",
      accessToken,
    );

    return [
      {
        id: user.id,
        name: user.role,
        permissions: [],
      },
    ];
  }

  async hasPermission(permission: string): Promise<boolean> {
    const accessToken = this.session.getAccessToken();

    if (!accessToken) {
      throw new SessionExpiredError();
    }

    const roles = await this.roles();

    for (const role of roles) {
      if (role.permissions.includes(permission)) {
        return true;
      }
    }

    return false;
  }
}

export { UserModule };
