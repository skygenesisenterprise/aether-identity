import Foundation

public final class UserService {
    private let transport: Transport
    private let session: SessionManager

    public init(transport: Transport, session: SessionManager) {
        self.transport = transport
        self.session = session
    }

    public func profile() async throws -> UserProfile {
        guard let accessToken = session.getAccessToken() else {
            throw SessionExpiredError()
        }

        return try await transport.get(
            endpoint: "/api/v1/users/me",
            accessToken: accessToken
        )
    }

    public func roles() async throws -> [UserRoles] {
        guard let accessToken = session.getAccessToken() else {
            throw SessionExpiredError()
        }

        let user: UserProfile = try await transport.get(
            endpoint: "/api/v1/userinfo",
            accessToken: accessToken
        )

        return [
            UserRoles(
                id: user.id,
                name: user.role,
                permissions: []
            )
        ]
    }

    public func hasPermission(_ permission: String) async throws -> Bool {
        guard let accessToken = session.getAccessToken() else {
            throw SessionExpiredError()
        }

        let roles = try await self.roles()

        for role in roles {
            if role.permissions.contains(permission) {
                return true
            }
        }

        return false
    }
}
