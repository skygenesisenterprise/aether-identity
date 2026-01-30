import Foundation

public struct IdentityClientConfig {
    public let baseUrl: String
    public let clientId: String
    public var accessToken: String?
    public var storage: SessionStorage?

    public init(
        baseUrl: String,
        clientId: String,
        accessToken: String? = nil,
        storage: SessionStorage? = nil
    ) {
        self.baseUrl = baseUrl
        self.clientId = clientId
        self.accessToken = accessToken
        self.storage = storage
    }
}
