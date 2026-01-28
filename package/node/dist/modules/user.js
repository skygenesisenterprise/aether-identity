import { SessionExpiredError } from "../errors";
class UserModule {
    transport;
    session;
    constructor(deps) {
        this.transport = deps.transport;
        this.session = deps.session;
    }
    async profile() {
        const accessToken = this.session.getAccessToken();
        if (!accessToken) {
            throw new SessionExpiredError();
        }
        return this.transport.get("/api/v1/users/me", accessToken);
    }
    async roles() {
        const accessToken = this.session.getAccessToken();
        if (!accessToken) {
            throw new SessionExpiredError();
        }
        const user = await this.transport.get("/api/v1/userinfo", accessToken);
        return [
            {
                id: user.id,
                name: user.role,
                permissions: [],
            },
        ];
    }
    async hasPermission(permission) {
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
//# sourceMappingURL=user.js.map