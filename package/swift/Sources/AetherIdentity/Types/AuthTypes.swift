import Foundation

public struct AuthInput {
    public let email: String
    public let password: String
    public var totpCode: String?

    public init(email: String, password: String, totpCode: String? = nil) {
        self.email = email
        self.password = password
        self.totpCode = totpCode
    }
}

public enum StrengthenType: String, Codable {
    case totp
    case email
    case sms
}

public struct StrengthenInput {
    public let type: StrengthenType
    public var value: String?

    public init(type: StrengthenType, value: String? = nil) {
        self.type = type
        self.value = value
    }
}
