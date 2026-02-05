"""Aether Identity Python SDK - Server types."""

from typing import Optional, List, Dict, Any, Callable
from datetime import datetime
from pydantic import BaseModel, Field


ContextType = str  # "user", "admin", "cli", "device", "console"


class UserContext(BaseModel):
    """User context from token."""

    id: str
    email: str
    roles: List[str] = Field(default_factory=list)
    permissions: List[str] = Field(default_factory=list)
    mfa_verified: bool = False
    context: str = "user"


class HookContext(BaseModel):
    """Base hook context."""

    ip: Optional[str] = None
    user_agent: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    request_id: Optional[str] = None
    path: Optional[str] = None


class LoginHookContext(HookContext):
    """Login hook context."""

    user_id: str
    email: str
    success: bool


class LogoutHookContext(HookContext):
    """Logout hook context."""

    user_id: str


class TokenRefreshHookContext(HookContext):
    """Token refresh hook context."""

    user_id: str


class UnauthorizedAttemptHookContext(HookContext):
    """Unauthorized attempt hook context."""

    reason: str
    token: Optional[str] = None


class MFARequiredHookContext(HookContext):
    """MFA required hook context."""

    user_id: str


class RoleCheckHookContext(HookContext):
    """Role check hook context."""

    user_id: str
    required_roles: List[str]
    has_role: bool


# Type aliases for middleware
MiddlewareCallable = Callable[..., Any]
FastAPIDependency = Callable[..., Any]
FlaskMiddleware = Callable[..., Any]
