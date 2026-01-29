import type { TokenResponse } from "../types";

interface SessionStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

class MemoryStorage implements SessionStorage {
  private store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.get(key) || null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }
}

function getStorage(): SessionStorage {
  if (typeof globalThis !== "undefined" && "localStorage" in globalThis) {
    return (globalThis as unknown as { localStorage: SessionStorage }).localStorage;
  }
  return new MemoryStorage();
}

class SessionManager {
  private storage: SessionStorage;
  private readonly ACCESS_TOKEN_KEY = "aether_access_token";
  private readonly REFRESH_TOKEN_KEY = "aether_refresh_token";
  private readonly EXPIRES_AT_KEY = "aether_expires_at";

  constructor() {
    this.storage = getStorage();
  }

  setTokens(tokens: TokenResponse): void {
    this.storage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
    this.storage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
    const expiresAt = Date.now() + tokens.expiresIn * 1000;
    this.storage.setItem(this.EXPIRES_AT_KEY, expiresAt.toString());
  }

  getAccessToken(): string | null {
    return this.storage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return this.storage.getItem(this.REFRESH_TOKEN_KEY);
  }

  getExpiresAt(): number | null {
    const expiresAt = this.storage.getItem(this.EXPIRES_AT_KEY);
    return expiresAt ? parseInt(expiresAt, 10) : null;
  }

  isAuthenticated(): boolean {
    const expiresAt = this.getExpiresAt();
    if (!expiresAt) return false;
    return Date.now() < expiresAt;
  }

  isTokenRefreshing(): boolean {
    return false;
  }

  setAccessToken(token: string, expiresIn: number): void {
    this.storage.setItem(this.ACCESS_TOKEN_KEY, token);
    const expiresAt = Date.now() + expiresIn * 1000;
    this.storage.setItem(this.EXPIRES_AT_KEY, expiresAt.toString());
  }

  setToken(token: string): void {
    this.storage.setItem(this.ACCESS_TOKEN_KEY, token);
    const expiresAt = Date.now() + 3600 * 1000;
    this.storage.setItem(this.EXPIRES_AT_KEY, expiresAt.toString());
  }

  clear(): void {
    this.storage.removeItem(this.ACCESS_TOKEN_KEY);
    this.storage.removeItem(this.REFRESH_TOKEN_KEY);
    this.storage.removeItem(this.EXPIRES_AT_KEY);
  }
}

export { SessionManager };
