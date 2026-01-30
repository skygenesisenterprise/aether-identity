import Foundation

public final class MachineService {
    private let transport: Transport
    private let clientId: String

    public init(transport: Transport, clientId: String) {
        self.transport = transport
        self.clientId = clientId
    }

    public func enroll() async throws -> MachineEnrollmentResponse {
        return try await transport.post(
            endpoint: "/api/v1/machine/enroll",
            body: ["clientId": clientId]
        )
    }

    public func token(secret: String) async throws -> MachineTokenResponse {
        return try await transport.post(
            endpoint: "/oauth2/token",
            body: [
                "grant_type": "client_credentials",
                "client_id": clientId,
                "client_secret": secret
            ]
        )
    }

    public func revoke(secret: String) async throws {
        let _: EmptyResponse = try await transport.post(
            endpoint: "/oauth2/revoke",
            body: [
                "client_id": clientId,
                "client_secret": secret
            ]
        )
    }
}
