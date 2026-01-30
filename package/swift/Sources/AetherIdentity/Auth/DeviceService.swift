import Foundation

public final class DeviceService {
    private let transport: Transport
    private let session: SessionManager

    public init(transport: Transport, session: SessionManager) {
        self.transport = transport
        self.session = session
    }

    public func detect() async throws -> [DeviceInfo] {
        guard let accessToken = session.getAccessToken() else {
            throw SessionExpiredError()
        }

        return try await transport.get(
            endpoint: "/api/v1/devices",
            accessToken: accessToken
        )
    }

    public func status() async throws -> DeviceStatusResponse {
        guard let accessToken = session.getAccessToken() else {
            throw SessionExpiredError()
        }

        return try await transport.get(
            endpoint: "/api/v1/devices/status",
            accessToken: accessToken
        )
    }
}
