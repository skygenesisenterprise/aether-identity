import Foundation

public final class TokenService {
    private let transport: Transport
    private let session: SessionManager

    public init(transport: Transport, session: SessionManager) {
        self.transport = transport
        self.session = session
    }

    public func refresh() async throws {
        guard let refreshToken = session.getRefreshToken() else {
            throw SessionExpiredError()
        }

        let response: TokenResponse = try await transport.post(
            endpoint: "/api/v1/auth/refresh",
            body: ["refreshToken": refreshToken]
        )

        session.setAccessToken(response.accessToken, expiresIn: response.expiresIn)
    }

    public func revoke() async throws {
        guard let accessToken = session.getAccessToken() else {
            return
        }

        do {
            let _: EmptyResponse = try await transport.post(
                endpoint: "/api/v1/auth/token/revoke",
                body: nil as [String: Any]?,
                accessToken: accessToken
            )
        } catch {
        }

        session.clear()
    }
}
