import type { AuthConfig } from "../types/index.js";
import { configManager } from "./config.js";

export class AuthManager {
  private getAuthConfig(): AuthConfig | undefined {
    return configManager.getAuth();
  }

  isAuthenticated(): boolean {
    const auth = this.getAuthConfig();
    if (!auth || !auth.accessToken) {
      return false;
    }
    return Date.now() < auth.expiresAt;
  }

  getAccessToken(): string | undefined {
    const auth = this.getAuthConfig();
    return auth?.accessToken;
  }

  getRefreshToken(): string | undefined {
    const auth = this.getAuthConfig();
    return auth?.refreshToken;
  }

  setAuth(auth: AuthConfig): void {
    configManager.setAuth(auth);
  }

  clearAuth(): void {
    configManager.clearAuth();
  }

  saveTokens(accessToken: string, refreshToken: string, expiresIn: number): void {
    const expiresAt = Date.now() + expiresIn * 1000;
    configManager.setAuth({
      accessToken,
      refreshToken,
      expiresAt,
    });
  }
}

export const authManager = new AuthManager();
