import Foundation

public final class AuthService {
    private let transport: Transport
    private let session: SessionManager

    public init(transport: Transport, session: SessionManager) {
        self.transport = transport
        self.session = session
    }

    public func login(input: AuthInput) async throws {
        var payload: [String: Any] = [
            "email": input.email,
            "password": input.password
        ]

        if let totpCode = input.totpCode {
            payload["totpCode"] = totpCode
        }

        let response: TokenResponse = try await transport.post(
            endpoint: "/api/v1/auth/login",
            body: payload
        )

        session.setTokens(response)
    }

    public func logout() async throws {
        guard let accessToken = session.getAccessToken() else {
            return
        }

        do {
            let _: EmptyResponse = try await transport.post(
                endpoint: "/api/v1/auth/logout",
                body: nil as [String: Any]?,
                accessToken: accessToken
            )
        } catch {
        }

        session.clear()
    }

    public func strengthen(input: StrengthenInput) async throws {
        guard let accessToken = session.getAccessToken() else {
            throw SessionExpiredError()
        }

        var body: [String: Any] = [
            "type": input.type.rawValue
        ]

        if let value = input.value {
            body["value"] = value
        }

        let _: EmptyResponse = try await transport.post(
            endpoint: "/api/v1/auth/strengthen",
            body: body,
            accessToken: accessToken
        )
    }
}

private struct EmptyResponse: Decodable {}
