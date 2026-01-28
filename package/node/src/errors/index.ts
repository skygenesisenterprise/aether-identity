export type ErrorCode =
  | "AUTHENTICATION_FAILED"
  | "AUTHORIZATION_FAILED"
  | "SESSION_EXPIRED"
  | "TOTP_REQUIRED"
  | "DEVICE_NOT_AVAILABLE"
  | "INVALID_INPUT"
  | "NETWORK_ERROR"
  | "SERVER_ERROR";

export class IdentityError extends Error {
  readonly code: ErrorCode;
  readonly message: string;
  readonly requestId?: string;

  constructor(message: string, code: ErrorCode, requestId?: string) {
    super(message);
    this.name = "IdentityError";
    this.message = message;
    this.code = code;
    this.requestId = requestId;
    Error.captureStackTrace?.(this, IdentityError);
  }
}

export class AuthenticationError extends IdentityError {
  constructor(message: string = "Authentication failed", requestId?: string) {
    super(message, "AUTHENTICATION_FAILED", requestId);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends IdentityError {
  constructor(message: string = "Authorization failed", requestId?: string) {
    super(message, "AUTHORIZATION_FAILED", requestId);
    this.name = "AuthorizationError";
  }
}

export class SessionExpiredError extends IdentityError {
  constructor(message: string = "Session expired", requestId?: string) {
    super(message, "SESSION_EXPIRED", requestId);
    this.name = "SessionExpiredError";
  }
}

export class TOTPRequiredError extends IdentityError {
  constructor(
    message: string = "TOTP verification required",
    requestId?: string,
  ) {
    super(message, "TOTP_REQUIRED", requestId);
    this.name = "TOTPRequiredError";
  }
}

export class DeviceNotAvailableError extends IdentityError {
  constructor(message: string = "Device not available", requestId?: string) {
    super(message, "DEVICE_NOT_AVAILABLE", requestId);
    this.name = "DeviceNotAvailableError";
  }
}

export class NetworkError extends IdentityError {
  constructor(message: string = "Network error occurred", requestId?: string) {
    super(message, "NETWORK_ERROR", requestId);
    this.name = "NetworkError";
  }
}

export class ServerError extends IdentityError {
  constructor(message: string = "Server error occurred", requestId?: string) {
    super(message, "SERVER_ERROR", requestId);
    this.name = "ServerError";
  }
}

export function createErrorFromResponse(
  statusCode: number,
  data: any,
): IdentityError {
  const requestId = data?.requestId || data?.error?.requestId;

  if (statusCode === 401) {
    return new AuthenticationError(
      data?.message || "Authentication failed",
      requestId,
    );
  }

  if (statusCode === 403) {
    return new AuthorizationError(
      data?.message || "Authorization failed",
      requestId,
    );
  }

  if (statusCode === 401 && data?.code === "SESSION_EXPIRED") {
    return new SessionExpiredError(
      data?.message || "Session expired",
      requestId,
    );
  }

  if (
    data?.code === "TOTP_REQUIRED" ||
    (statusCode === 401 && data?.requiresTOTP)
  ) {
    return new TOTPRequiredError(
      data?.message || "TOTP verification required",
      requestId,
    );
  }

  if (data?.code === "DEVICE_NOT_AVAILABLE") {
    return new DeviceNotAvailableError(
      data?.message || "Device not available",
      requestId,
    );
  }

  if (statusCode >= 500) {
    return new ServerError(data?.message || "Server error occurred", requestId);
  }

  return new IdentityError(
    data?.message || "An error occurred",
    data?.code || "INVALID_INPUT",
    requestId,
  );
}
