import Foundation

public final class EIDService {
    private let transport: Transport
    private let session: SessionManager

    public init(transport: Transport, session: SessionManager) {
        self.transport = transport
        self.session = session
    }

    public func verify(input: EIDVerifyInput) async throws {
        guard let accessToken = session.getAccessToken() else {
            throw SessionExpiredError()
        }

        let _: EmptyResponse = try await transport.post(
            endpoint: "/api/v1/eid/verify",
            body: [
                "documentType": input.documentType,
                "documentNumber": input.documentNumber,
                "issuanceDate": input.issuanceDate,
                "expirationDate": input.expirationDate
            ],
            accessToken: accessToken
        )
    }

    public func status() async throws -> EIDStatusResponse {
        guard let accessToken = session.getAccessToken() else {
            throw SessionExpiredError()
        }

        return try await transport.get(
            endpoint: "/api/v1/eid/status",
            accessToken: accessToken
        )
    }

    public func revoke() async throws {
        guard let accessToken = session.getAccessToken() else {
            throw SessionExpiredError()
        }

        let _: EmptyResponse = try await transport.post(
            endpoint: "/api/v1/eid/revoke",
            body: nil as [String: Any]?,
            accessToken: accessToken
        )
    }
}
