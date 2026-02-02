import type { Transport } from "../core/transport";
import type { SessionManager } from "../core/session";
import type { TOTPConfig, TOTPSetupResponse, TOTPStatusResponse, TOTPVerifyInput, TOTPLoginInput, TokenResponse } from "../types";
interface TOTPModuleDeps {
    transport: Transport;
    session: SessionManager;
    config?: TOTPConfig;
}
declare class TOTPModule {
    private transport;
    private session;
    private config?;
    constructor(deps: TOTPModuleDeps);
    setup(): Promise<TOTPSetupResponse>;
    verify(input: TOTPVerifyInput): Promise<void>;
    disable(): Promise<void>;
    getStatus(): Promise<TOTPStatusResponse>;
    login(input: TOTPLoginInput, oauthParams?: OAuthParams): Promise<TokenResponse>;
    private buildLoginEndpoint;
}
interface OAuthParams {
    client_id?: string;
    redirect_uri?: string;
    response_type?: string;
    scope?: string;
    state?: string;
}
export { TOTPModule };
export type { OAuthParams };
//# sourceMappingURL=totp.d.ts.map