import type { TokenResponse } from "../types";
declare class SessionManager {
    private storage;
    private readonly ACCESS_TOKEN_KEY;
    private readonly REFRESH_TOKEN_KEY;
    private readonly EXPIRES_AT_KEY;
    constructor();
    setTokens(tokens: TokenResponse): void;
    getAccessToken(): string | null;
    getRefreshToken(): string | null;
    getExpiresAt(): number | null;
    isAuthenticated(): boolean;
    isTokenRefreshing(): boolean;
    setAccessToken(token: string, expiresIn: number): void;
    setToken(token: string): void;
    clear(): void;
}
export { SessionManager };
//# sourceMappingURL=session.d.ts.map