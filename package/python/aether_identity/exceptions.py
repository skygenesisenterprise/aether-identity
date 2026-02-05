"""Aether Identity Python SDK - Exceptions module."""

from typing import Optional, Any


class ErrorCode:
    """Error codes for Aether Identity SDK."""

    AUTHENTICATION_FAILED = "AUTHENTICATION_FAILED"
    AUTHORIZATION_FAILED = "AUTHORIZATION_FAILED"
    SESSION_EXPIRED = "SESSION_EXPIRED"
    TOTP_REQUIRED = "TOTP_REQUIRED"
    DEVICE_NOT_AVAILABLE = "DEVICE_NOT_AVAILABLE"
    INVALID_INPUT = "INVALID_INPUT"
    NETWORK_ERROR = "NETWORK_ERROR"
    SERVER_ERROR = "SERVER_ERROR"


class IdentityError(Exception):
    """Base exception for all Aether Identity SDK errors."""

    code: str = "UNKNOWN_ERROR"
    status_code: int = 500

    def __init__(
        self,
        message: str,
        code: Optional[str] = None,
        status_code: Optional[int] = None,
        request_id: Optional[str] = None,
        details: Optional[dict[str, Any]] = None,
    ):
        super().__init__(message)
        self.message = message
        self.code = code or self.code
        self.status_code = status_code or self.status_code
        self.request_id = request_id
        self.details = details or {}

    def __str__(self) -> str:
        parts = [f"[{self.code}] {self.message}"]
        if self.request_id:
            parts.append(f"(Request ID: {self.request_id})")
        return " ".join(parts)


class AuthenticationError(IdentityError):
    """Raised when authentication fails."""

    code = ErrorCode.AUTHENTICATION_FAILED
    status_code = 401


class AuthorizationError(IdentityError):
    """Raised when user lacks required permissions."""

    code = ErrorCode.AUTHORIZATION_FAILED
    status_code = 403


class SessionExpiredError(IdentityError):
    """Raised when the session has expired."""

    code = ErrorCode.SESSION_EXPIRED
    status_code = 401


class TOTPRequiredError(IdentityError):
    """Raised when TOTP/2FA verification is required."""

    code = ErrorCode.TOTP_REQUIRED
    status_code = 401


class DeviceNotAvailableError(IdentityError):
    """Raised when a device is not available for verification."""

    code = ErrorCode.DEVICE_NOT_AVAILABLE


class InvalidInputError(IdentityError):
    """Raised when input validation fails."""

    code = ErrorCode.INVALID_INPUT
    status_code = 400


class NetworkError(IdentityError):
    """Raised when a network error occurs."""

    code = ErrorCode.NETWORK_ERROR


class ServerError(IdentityError):
    """Raised when the server returns a 5xx error."""

    code = ErrorCode.SERVER_ERROR
    status_code = 500


def create_error_from_response(
    status_code: int, data: dict[str, Any], request_id: Optional[str] = None
) -> IdentityError:
    """Create appropriate error from HTTP response.

    Args:
        status_code: HTTP status code
        data: Response data dictionary
        request_id: Optional request ID

    Returns:
        Appropriate IdentityError subclass
    """
    message = data.get("message", data.get("error", "Unknown error"))
    code = data.get("code", "UNKNOWN_ERROR")

    error_map = {
        400: InvalidInputError,
        401: AuthenticationError,
        403: AuthorizationError,
        500: ServerError,
        502: ServerError,
        503: ServerError,
        504: ServerError,
    }

    # Check for specific error codes
    if code == ErrorCode.TOTP_REQUIRED:
        error_class = TOTPRequiredError
    elif code == ErrorCode.SESSION_EXPIRED:
        error_class = SessionExpiredError
    elif code == ErrorCode.DEVICE_NOT_AVAILABLE:
        error_class = DeviceNotAvailableError
    else:
        error_class = error_map.get(status_code, IdentityError)

    return error_class(
        message=message, code=code, status_code=status_code, request_id=request_id, details=data
    )
