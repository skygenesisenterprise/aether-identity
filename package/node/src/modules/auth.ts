import type { Transport } from "../core/transport";
import type { SessionManager } from "../core/session";
import type { AuthInput, StrengthenInput, TokenResponse } from "../types";
import { SessionExpiredError } from "../errors";

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

class AuthModule {
  private transport: Transport;
  private session: SessionManager;

  constructor(deps: AuthModuleDeps) {
    this.transport = deps.transport;
    this.session = deps.session;
  }

  async login(input: AuthInput, oauthParams?: OAuthParams): Promise<void> {
    const payload: {
      email: string;
      password: string;
      totpCode?: string;
    } = {
      email: input.email,
      password: input.password,
    };

    if (input._totpCode) {
      payload.totpCode = input._totpCode;
    }

    const endpoint = this.buildLoginEndpoint(oauthParams);

    const response = await this.transport.post<TokenResponse>(
      endpoint,
      payload,
    );

    this.session.setTokens(response);
  }

  private buildLoginEndpoint(oauthParams?: OAuthParams): string {
    if (!oauthParams || Object.keys(oauthParams).length === 0) {
      return "/api/v1/auth/login";
    }

    const params = new URLSearchParams();
    if (oauthParams.client_id) params.set("client_id", oauthParams.client_id);
    if (oauthParams.redirect_uri)
      params.set("redirect_uri", oauthParams.redirect_uri);
    if (oauthParams.response_type)
      params.set("response_type", oauthParams.response_type);
    if (oauthParams.scope) params.set("scope", oauthParams.scope);
    if (oauthParams.state) params.set("state", oauthParams.state);

    return `/api/v1/auth/login?${params.toString()}`;
  }

  async logout(): Promise<void> {
    const accessToken = this.session.getAccessToken();

    if (accessToken) {
      try {
        await this.transport.post(
          "/api/v1/auth/logout",
          undefined,
          accessToken,
        );
      } catch {}
    }

    this.session.clear();
  }

  async strengthen(input: StrengthenInput): Promise<void> {
    const accessToken = this.session.getAccessToken();

    if (!accessToken) {
      throw new SessionExpiredError();
    }

    await this.transport.post(
      "/api/v1/auth/strengthen",
      {
        type: input.type,
        value: input.value,
      },
      accessToken,
    );
  }
}

export type { OAuthParams };
export { AuthModule };
