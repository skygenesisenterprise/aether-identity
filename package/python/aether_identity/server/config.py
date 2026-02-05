"""Aether Identity Python SDK - Server configuration."""

from typing import Optional, List, Union
from pydantic import BaseModel, Field


class TokenCacheConfig(BaseModel):
    """Token cache configuration."""

    ttl: int = 300  # 5 minutes
    max_size: int = 1000


class RateLimitConfig(BaseModel):
    """Rate limiting configuration."""

    window_ms: int = 900000  # 15 minutes
    max_requests: int = 100


class IdentityServerHooks(BaseModel):
    """Server lifecycle hooks configuration."""

    on_login: Optional[callable] = None
    on_logout: Optional[callable] = None
    on_token_refresh: Optional[callable] = None
    on_unauthorized_attempt: Optional[callable] = None
    on_mfa_required: Optional[callable] = None
    on_role_check: Optional[callable] = None


class IdentityServerConfig(BaseModel):
    """Identity server configuration."""

    base_url: str
    client_id: str
    system_key: Optional[str] = None
    jwt_secret: Optional[str] = None
    default_context: str = "user"
    mfa_required: Union[bool, List[str]] = False
    token_header: str = "authorization"
    cookie_name: str = "aether_token"
    token_prefix: str = "bearer"
    cache: TokenCacheConfig = Field(default_factory=TokenCacheConfig)
    rate_limit: RateLimitConfig = Field(default_factory=RateLimitConfig)
    hooks: Optional[IdentityServerHooks] = None
