import Foundation

public enum ErrorCode: String, Codable {
    case authenticationFailed = "AUTHENTICATION_FAILED"
    case authorizationFailed = "AUTHORIZATION_FAILED"
    case sessionExpired = "SESSION_EXPIRED"
    case totpRequired = "TOTP_REQUIRED"
    case deviceNotAvailable = "DEVICE_NOT_AVAILABLE"
    case invalidInput = "INVALID_INPUT"
    case networkError = "NETWORK_ERROR"
    case serverError = "SERVER_ERROR"
}

public struct APIErrorResponse: Codable {
    public var code: String?
    public var message: String?
    public var requestId: String?
}

public struct APIErrorData: Codable {
    public var requestId: String?
}

public protocol IdentityError: Error, CustomStringConvertible {
    var code: ErrorCode { get }
    var message: String { get }
    var requestId: String? { get }
}

public struct GenericIdentityError: IdentityError, Codable {
    public let code: ErrorCode
    public let message: String
    public var requestId: String?
    public var description: String { message }

    public init(message: String, code: ErrorCode, requestId: String? = nil) {
        self.message = message
        self.code = code
        self.requestId = requestId
    }
}

public struct AuthenticationError: IdentityError, Codable {
    public let code: ErrorCode
    public let message: String
    public var requestId: String?
    public var description: String { message }

    public init(message: String = "Authentication failed", requestId: String? = nil) {
        self.code = .authenticationFailed
        self.message = message
        self.requestId = requestId
    }
}

public struct AuthorizationError: IdentityError, Codable {
    public let code: ErrorCode
    public let message: String
    public var requestId: String?
    public var description: String { message }

    public init(message: String = "Authorization failed", requestId: String? = nil) {
        self.code = .authorizationFailed
        self.message = message
        self.requestId = requestId
    }
}

public struct SessionExpiredError: IdentityError, Codable {
    public let code: ErrorCode
    public let message: String
    public var requestId: String?
    public var description: String { message }

    public init(message: String = "Session expired", requestId: String? = nil) {
        self.code = .sessionExpired
        self.message = message
        self.requestId = requestId
    }
}

public struct TOTPRequiredError: IdentityError, Codable {
    public let code: ErrorCode
    public let message: String
    public var requestId: String?
    public var description: String { message }

    public init(message: String = "TOTP verification required", requestId: String? = nil) {
        self.code = .totpRequired
        self.message = message
        self.requestId = requestId
    }
}

public struct DeviceNotAvailableError: IdentityError, Codable {
    public let code: ErrorCode
    public let message: String
    public var requestId: String?
    public var description: String { message }

    public init(message: String = "Device not available", requestId: String? = nil) {
        self.code = .deviceNotAvailable
        self.message = message
        self.requestId = requestId
    }
}

public struct NetworkError: IdentityError, Codable {
    public let code: ErrorCode
    public let message: String
    public var requestId: String?
    public var description: String { message }

    public init(message: String = "Network error occurred", requestId: String? = nil) {
        self.code = .networkError
        self.message = message
        self.requestId = requestId
    }
}

public struct ServerError: IdentityError, Codable {
    public let code: ErrorCode
    public let message: String
    public var requestId: String?
    public var description: String { message }

    public init(message: String = "Server error occurred", requestId: String? = nil) {
        self.code = .serverError
        self.message = message
        self.requestId = requestId
    }
}
