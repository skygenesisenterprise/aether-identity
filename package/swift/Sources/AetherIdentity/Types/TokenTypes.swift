import Foundation

public struct TokenResponse: Codable {
    public let accessToken: String
    public let refreshToken: String
    public let expiresIn: Int

    public init(accessToken: String, refreshToken: String, expiresIn: Int) {
        self.accessToken = accessToken
        self.refreshToken = refreshToken
        self.expiresIn = expiresIn
    }
}

public struct SessionResponse {
    public let isAuthenticated: Bool
    public var user: UserProfile?
    public var expiresAt: Int?

    public init(isAuthenticated: Bool, user: UserProfile? = nil, expiresAt: Int? = nil) {
        self.isAuthenticated = isAuthenticated
        self.user = user
        self.expiresAt = expiresAt
    }
}
