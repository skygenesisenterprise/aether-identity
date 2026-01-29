export type ErrorCode = "AUTHENTICATION_FAILED" | "AUTHORIZATION_FAILED" | "SESSION_EXPIRED" | "TOTP_REQUIRED" | "DEVICE_NOT_AVAILABLE" | "INVALID_INPUT" | "NETWORK_ERROR" | "SERVER_ERROR";
export declare class IdentityError extends Error {
    readonly code: ErrorCode;
    readonly message: string;
    readonly requestId?: string;
    constructor(message: string, code: ErrorCode, requestId?: string);
}
export declare class AuthenticationError extends IdentityError {
    constructor(message?: string, requestId?: string);
}
export declare class AuthorizationError extends IdentityError {
    constructor(message?: string, requestId?: string);
}
export declare class SessionExpiredError extends IdentityError {
    constructor(message?: string, requestId?: string);
}
export declare class TOTPRequiredError extends IdentityError {
    constructor(message?: string, requestId?: string);
}
export declare class DeviceNotAvailableError extends IdentityError {
    constructor(message?: string, requestId?: string);
}
export declare class NetworkError extends IdentityError {
    constructor(message?: string, requestId?: string);
}
export declare class ServerError extends IdentityError {
    constructor(message?: string, requestId?: string);
}
export declare function createErrorFromResponse(statusCode: number, data: unknown): IdentityError;
//# sourceMappingURL=index.d.ts.map