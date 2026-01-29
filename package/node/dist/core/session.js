class MemoryStorage {
    store = new Map();
    getItem(key) {
        return this.store.get(key) || null;
    }
    setItem(key, value) {
        this.store.set(key, value);
    }
    removeItem(key) {
        this.store.delete(key);
    }
}
function getStorage() {
    if (typeof globalThis !== "undefined" && "localStorage" in globalThis) {
        return globalThis.localStorage;
    }
    return new MemoryStorage();
}
class SessionManager {
    storage;
    ACCESS_TOKEN_KEY = "aether_access_token";
    REFRESH_TOKEN_KEY = "aether_refresh_token";
    EXPIRES_AT_KEY = "aether_expires_at";
    constructor() {
        this.storage = getStorage();
    }
    setTokens(tokens) {
        this.storage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
        this.storage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
        const expiresAt = Date.now() + tokens.expiresIn * 1000;
        this.storage.setItem(this.EXPIRES_AT_KEY, expiresAt.toString());
    }
    getAccessToken() {
        return this.storage.getItem(this.ACCESS_TOKEN_KEY);
    }
    getRefreshToken() {
        return this.storage.getItem(this.REFRESH_TOKEN_KEY);
    }
    getExpiresAt() {
        const expiresAt = this.storage.getItem(this.EXPIRES_AT_KEY);
        return expiresAt ? parseInt(expiresAt, 10) : null;
    }
    isAuthenticated() {
        const expiresAt = this.getExpiresAt();
        if (!expiresAt)
            return false;
        return Date.now() < expiresAt;
    }
    isTokenRefreshing() {
        return false;
    }
    setAccessToken(token, expiresIn) {
        this.storage.setItem(this.ACCESS_TOKEN_KEY, token);
        const expiresAt = Date.now() + expiresIn * 1000;
        this.storage.setItem(this.EXPIRES_AT_KEY, expiresAt.toString());
    }
    setToken(token) {
        this.storage.setItem(this.ACCESS_TOKEN_KEY, token);
        const expiresAt = Date.now() + 3600 * 1000;
        this.storage.setItem(this.EXPIRES_AT_KEY, expiresAt.toString());
    }
    clear() {
        this.storage.removeItem(this.ACCESS_TOKEN_KEY);
        this.storage.removeItem(this.REFRESH_TOKEN_KEY);
        this.storage.removeItem(this.EXPIRES_AT_KEY);
    }
}
export { SessionManager };
//# sourceMappingURL=session.js.map