import Foundation

private let ACCESS_TOKEN_KEY = "aether_access_token"
private let REFRESH_TOKEN_KEY = "aether_refresh_token"
private let EXPIRES_AT_KEY = "aether_expires_at"

public final class SessionManager {
    private var storage: SessionStorage

    public init(storage: SessionStorage = MemoryStorage()) {
        self.storage = storage
    }

    public func setTokens(_ tokens: TokenResponse) {
        storage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
        storage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
        let expiresAt = Date().timeIntervalSince1970 + Double(tokens.expiresIn)
        storage.setItem(EXPIRES_AT_KEY, String(Int(expiresAt)))
    }

    public func getAccessToken() -> String? {
        storage.getItem(ACCESS_TOKEN_KEY)
    }

    public func getRefreshToken() -> String? {
        storage.getItem(REFRESH_TOKEN_KEY)
    }

    public func getExpiresAt() -> Int? {
        guard let expiresAt = storage.getItem(EXPIRES_AT_KEY) else { return nil }
        return Int(expiresAt)
    }

    public func isAuthenticated() -> Bool {
        guard let expiresAt = getExpiresAt() else { return false }
        return Date().timeIntervalSince1970 < Double(expiresAt)
    }

    public func isTokenRefreshing() -> Bool {
        return false
    }

    public func setAccessToken(_ token: String, expiresIn: Int) {
        storage.setItem(ACCESS_TOKEN_KEY, token)
        let expiresAt = Date().timeIntervalSince1970 + Double(expiresIn)
        storage.setItem(EXPIRES_AT_KEY, String(Int(expiresAt)))
    }

    public func setToken(_ token: String) {
        storage.setItem(ACCESS_TOKEN_KEY, token)
        let expiresAt = Date().timeIntervalSince1970 + 3600
        storage.setItem(EXPIRES_AT_KEY, String(Int(expiresAt)))
    }

    public func clear() {
        storage.removeItem(ACCESS_TOKEN_KEY)
        storage.removeItem(REFRESH_TOKEN_KEY)
        storage.removeItem(EXPIRES_AT_KEY)
    }
}
