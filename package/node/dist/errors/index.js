export class IdentityError extends Error {
    code;
    message;
    requestId;
    constructor(message, code, requestId) {
        super(message);
        this.name = "IdentityError";
        this.message = message;
        this.code = code;
        this.requestId = requestId;
        Error.captureStackTrace?.(this, IdentityError);
    }
}
export class AuthenticationError extends IdentityError {
    constructor(message = "Authentication failed", requestId) {
        super(message, "AUTHENTICATION_FAILED", requestId);
        this.name = "AuthenticationError";
    }
}
export class AuthorizationError extends IdentityError {
    constructor(message = "Authorization failed", requestId) {
        super(message, "AUTHORIZATION_FAILED", requestId);
        this.name = "AuthorizationError";
    }
}
export class SessionExpiredError extends IdentityError {
    constructor(message = "Session expired", requestId) {
        super(message, "SESSION_EXPIRED", requestId);
        this.name = "SessionExpiredError";
    }
}
export class TOTPRequiredError extends IdentityError {
    constructor(message = "TOTP verification required", requestId) {
        super(message, "TOTP_REQUIRED", requestId);
        this.name = "TOTPRequiredError";
    }
}
export class DeviceNotAvailableError extends IdentityError {
    constructor(message = "Device not available", requestId) {
        super(message, "DEVICE_NOT_AVAILABLE", requestId);
        this.name = "DeviceNotAvailableError";
    }
}
export class NetworkError extends IdentityError {
    constructor(message = "Network error occurred", requestId) {
        super(message, "NETWORK_ERROR", requestId);
        this.name = "NetworkError";
    }
}
export class ServerError extends IdentityError {
    constructor(message = "Server error occurred", requestId) {
        super(message, "SERVER_ERROR", requestId);
        this.name = "ServerError";
    }
}
export function createErrorFromResponse(statusCode, data) {
    const dataObj = data;
    const requestId = dataObj?.requestId ||
        dataObj?.error?.requestId;
    if (statusCode === 401) {
        return new AuthenticationError(dataObj?.message || "Authentication failed", requestId);
    }
    if (statusCode === 403) {
        return new AuthorizationError(dataObj?.message || "Authorization failed", requestId);
    }
    if (statusCode === 401 && dataObj?.code === "SESSION_EXPIRED") {
        return new SessionExpiredError(dataObj?.message || "Session expired", requestId);
    }
    if (dataObj?.code === "TOTP_REQUIRED" ||
        (statusCode === 401 && dataObj?.requiresTOTP)) {
        return new TOTPRequiredError(dataObj?.message || "TOTP verification required", requestId);
    }
    if (dataObj?.code === "DEVICE_NOT_AVAILABLE") {
        return new DeviceNotAvailableError(dataObj?.message || "Device not available", requestId);
    }
    if (statusCode >= 500) {
        return new ServerError(dataObj?.message || "Server error occurred", requestId);
    }
    return new IdentityError(dataObj?.message || "An error occurred", dataObj?.code || "INVALID_INPUT", requestId);
}
//# sourceMappingURL=index.js.map