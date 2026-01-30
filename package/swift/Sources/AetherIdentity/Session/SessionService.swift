import Foundation

public final class SessionService {
    private let transport: Transport
    private let session: SessionManager

    public init(transport: Transport, session: SessionManager) {
        self.transport = transport
        self.session = session
    }

    public func current() async throws -> SessionResponse {
        guard let accessToken = session.getAccessToken(),
              session.isAuthenticated() else {
            return SessionResponse(isAuthenticated: false)
        }

        let user: UserProfile = try await transport.get(
            endpoint: "/api/v1/userinfo",
            accessToken: accessToken
        )

        let expiresAt = session.getExpiresAt()

        return SessionResponse(
            isAuthenticated: true,
            user: user,
            expiresAt: expiresAt
        )
    }

    public func isAuthenticated() -> Bool {
        return session.isAuthenticated()
    }
}
