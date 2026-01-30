import Foundation

public func createErrorFromResponse(statusCode: Int, data: [String: Any]) -> IdentityError {
    let requestId = data["requestId"] as? String ?? (data["error"] as? [String: Any])?["requestId"] as? String

    if statusCode == 401 {
        let message = data["message"] as? String ?? "Authentication failed"
        return AuthenticationError(message: message, requestId: requestId)
    }

    if statusCode == 403 {
        let message = data["message"] as? String ?? "Authorization failed"
        return AuthorizationError(message: message, requestId: requestId)
    }

    if statusCode == 401, let code = data["code"] as? String, code == "SESSION_EXPIRED" {
        let message = data["message"] as? String ?? "Session expired"
        return SessionExpiredError(message: message, requestId: requestId)
    }

    if let code = data["code"] as? String, code == "TOTP_REQUIRED" {
        let message = data["message"] as? String ?? "TOTP verification required"
        return TOTPRequiredError(message: message, requestId: requestId)
    }

    if statusCode == 401, let requiresTOTP = data["requiresTOTP"] as? Bool, requiresTOTP {
        let message = data["message"] as? String ?? "TOTP verification required"
        return TOTPRequiredError(message: message, requestId: requestId)
    }

    if let code = data["code"] as? String, code == "DEVICE_NOT_AVAILABLE" {
        let message = data["message"] as? String ?? "Device not available"
        return DeviceNotAvailableError(message: message, requestId: requestId)
    }

    if statusCode >= 500 {
        let message = data["message"] as? String ?? "Server error occurred"
        return ServerError(message: message, requestId: requestId)
    }

    let message = data["message"] as? String ?? "An error occurred"
    let codeString = data["code"] as? String ?? "INVALID_INPUT"
    let code: ErrorCode = ErrorCode(rawValue: codeString) ?? .invalidInput

    return GenericIdentityError(message: message, code: code, requestId: requestId)
}
