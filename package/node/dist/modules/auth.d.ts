import type { Transport } from "../core/transport";
import type { SessionManager } from "../core/session";
import type { AuthInput, StrengthenInput, RegisterInput, RegisterResponse } from "../types";
interface OAuthParams {
    client_id?: string;
    redirect_uri?: string;
    response_type?: string;
    scope?: string;
    state?: string;
}
interface AuthModuleDeps {
    transport: Transport;
    session: SessionManager;
}
declare class AuthModule {
    private transport;
    private session;
    constructor(deps: AuthModuleDeps);
    login(input: AuthInput, oauthParams?: OAuthParams): Promise<void>;
    register(input: RegisterInput): Promise<RegisterResponse>;
    private buildLoginEndpoint;
    logout(): Promise<void>;
    strengthen(input: StrengthenInput): Promise<void>;
}
export type { OAuthParams };
export { AuthModule };
//# sourceMappingURL=auth.d.ts.map