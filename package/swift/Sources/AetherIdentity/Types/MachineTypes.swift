import Foundation

public struct MachineEnrollmentResponse: Codable {
    public let machineId: String
    public let clientId: String
    public let secret: String
    public var accessToken: String?

    public init(machineId: String, clientId: String, secret: String, accessToken: String? = nil) {
        self.machineId = machineId
        self.clientId = clientId
        self.secret = secret
        self.accessToken = accessToken
    }
}

public struct MachineTokenResponse: Codable {
    public let accessToken: String
    public let expiresIn: Int
    public let tokenType: String

    public init(accessToken: String, expiresIn: Int, tokenType: String) {
        self.accessToken = accessToken
        self.expiresIn = expiresIn
        self.tokenType = tokenType
    }
}
