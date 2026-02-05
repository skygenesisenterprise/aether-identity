"""Aether Identity Python SDK."""

from .client import IdentityClient, create_identity_client
from .core import Transport, SessionManager, Storage, MemoryStorage
from .exceptions import (
    IdentityError,
    AuthenticationError,
    AuthorizationError,
    SessionExpiredError,
    TOTPRequiredError,
    DeviceNotAvailableError,
    InvalidInputError,
    NetworkError,
    ServerError,
    ErrorCode,
)
from .types import (
    IdentityClientConfig,
    TokenResponse,
    AuthInput,
    RegisterInput,
    RegisterResponse,
    UserProfile,
    UserRole,
    SessionResponse,
    OAuthParams,
    StrengthenInput,
    EIDVerifyInput,
    EIDStatusResponse,
    DeviceInfo,
    DeviceStatusResponse,
    MachineEnrollmentResponse,
    MachineTokenResponse,
    TOTPConfig,
    TOTPSetupResponse,
    TOTPVerifyInput,
    TOTPStatusResponse,
    TOTPLoginInput,
)

__version__ = "1.0.0"

__all__ = [
    # Client
    "IdentityClient",
    "create_identity_client",
    # Core
    "Transport",
    "SessionManager",
    "Storage",
    "MemoryStorage",
    # Exceptions
    "IdentityError",
    "AuthenticationError",
    "AuthorizationError",
    "SessionExpiredError",
    "TOTPRequiredError",
    "DeviceNotAvailableError",
    "InvalidInputError",
    "NetworkError",
    "ServerError",
    "ErrorCode",
    # Types
    "IdentityClientConfig",
    "TokenResponse",
    "AuthInput",
    "RegisterInput",
    "RegisterResponse",
    "UserProfile",
    "UserRole",
    "SessionResponse",
    "OAuthParams",
    "StrengthenInput",
    "EIDVerifyInput",
    "EIDStatusResponse",
    "DeviceInfo",
    "DeviceStatusResponse",
    "MachineEnrollmentResponse",
    "MachineTokenResponse",
    "TOTPConfig",
    "TOTPSetupResponse",
    "TOTPVerifyInput",
    "TOTPStatusResponse",
    "TOTPLoginInput",
]
