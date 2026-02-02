import type { Transport } from "../core/transport";
import type { SessionManager } from "../core/session";
import type {
  TOTPConfig,
  TOTPSetupResponse,
  TOTPStatusResponse,
  TOTPVerifyInput,
  TOTPLoginInput,
  TokenResponse,
} from "../types";
import { SessionExpiredError } from "../errors";

interface TOTPModuleDeps {
  transport: Transport;
  session: SessionManager;
  config?: TOTPConfig;
}

class TOTPModule {
  private transport: Transport;
  private session: SessionManager;
  private config?: TOTPConfig;

  constructor(deps: TOTPModuleDeps) {
    this.transport = deps.transport;
    this.session = deps.session;
    this.config = deps.config;
  }

  async setup(): Promise<TOTPSetupResponse> {
    const accessToken = this.session.getAccessToken();

    if (!accessToken) {
      throw new SessionExpiredError();
    }

    const headers: Record<string, string> = {};
    if (this.config?.issuer) {
      headers["X-TOTP-Issuer"] = this.config.issuer;
    }

    return this.transport.post<TOTPSetupResponse>(
      "/api/v1/auth/totp/setup",
      undefined,
      accessToken,
    );
  }

  async verify(input: TOTPVerifyInput): Promise<void> {
    const accessToken = this.session.getAccessToken();

    if (!accessToken) {
      throw new SessionExpiredError();
    }

    await this.transport.post(
      "/api/v1/auth/totp/verify",
      {
        code: input.code,
        secret: input.secret,
      },
      accessToken,
    );
  }

  async disable(): Promise<void> {
    const accessToken = this.session.getAccessToken();

    if (!accessToken) {
      throw new SessionExpiredError();
    }

    await this.transport.post(
      "/api/v1/auth/totp/disable",
      undefined,
      accessToken,
    );
  }

  async getStatus(): Promise<TOTPStatusResponse> {
    const accessToken = this.session.getAccessToken();

    if (!accessToken) {
      throw new SessionExpiredError();
    }

    return this.transport.get<TOTPStatusResponse>(
      "/api/v1/auth/totp/status",
      accessToken,
    );
  }

  async login(
    input: TOTPLoginInput,
    oauthParams?: OAuthParams,
  ): Promise<TokenResponse> {
    const endpoint = this.buildLoginEndpoint(oauthParams);

    const response = await this.transport.post<TokenResponse>(endpoint, {
      email: input.email,
      password: input.password,
      totpCode: input.totpCode,
    });

    this.session.setTokens(response);
    return response;
  }

  private buildLoginEndpoint(oauthParams?: OAuthParams): string {
    if (!oauthParams || Object.keys(oauthParams).length === 0) {
      return "/api/v1/auth/totp/login";
    }

    const params = new URLSearchParams();
    if (oauthParams.client_id) params.set("client_id", oauthParams.client_id);
    if (oauthParams.redirect_uri)
      params.set("redirect_uri", oauthParams.redirect_uri);
    if (oauthParams.response_type)
      params.set("response_type", oauthParams.response_type);
    if (oauthParams.scope) params.set("scope", oauthParams.scope);
    if (oauthParams.state) params.set("state", oauthParams.state);

    return `/api/v1/auth/totp/login?${params.toString()}`;
  }
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
