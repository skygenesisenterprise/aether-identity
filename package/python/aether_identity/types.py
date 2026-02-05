"""Aether Identity Python SDK - Type definitions."""

from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field


class TOTPConfig(BaseModel):
    """TOTP configuration."""

    issuer: Optional[str] = None
    digits: int = 6
    period: int = 30


class TOTPSetupResponse(BaseModel):
    """TOTP setup response."""

    secret: str
    qr_code: str = Field(alias="qrCode")
    url: str


class TOTPVerifyInput(BaseModel):
    """TOTP verification input."""

    code: str
    secret: Optional[str] = None


class TOTPStatusResponse(BaseModel):
    """TOTP status response."""

    enabled: bool


class TOTPLoginInput(BaseModel):
    """TOTP login input."""

    email: str
    password: str
    totp_code: str = Field(alias="totpCode")


class OAuthParams(BaseModel):
    """OAuth parameters."""

    client_id: Optional[str] = None
    redirect_uri: Optional[str] = None
    response_type: Optional[str] = None
    scope: Optional[str] = None
    state: Optional[str] = None


class AuthInput(BaseModel):
    """Authentication input."""

    email: str
    password: str
    _totp_code: Optional[str] = Field(default=None, alias="_totpCode")


class RegisterInput(BaseModel):
    """Registration input."""

    email: str
    password: str
    name: Optional[str] = None


class RegisterResponse(BaseModel):
    """Registration response."""

    success: bool
    message: str
    user_id: Optional[str] = Field(default=None, alias="userId")


class StrengthenInput(BaseModel):
    """Session strengthening input."""

    type: str = Field(pattern="^(totp|email|sms)$")
    value: Optional[str] = None


class UserProfile(BaseModel):
    """User profile data."""

    id: str
    name: Optional[str] = None
    email: str
    role: Optional[str] = None
    is_active: bool = Field(alias="isActive", default=True)
    account_type: Optional[str] = Field(default=None, alias="accountType")
    created_at: Optional[datetime] = Field(default=None, alias="createdAt")
    updated_at: Optional[datetime] = Field(default=None, alias="updatedAt")


class UserRole(BaseModel):
    """User role data."""

    id: str
    name: str
    permissions: List[str] = Field(default_factory=list)


class TokenResponse(BaseModel):
    """Token response."""

    access_token: str = Field(alias="accessToken")
    refresh_token: str = Field(alias="refreshToken")
    expires_in: int = Field(alias="expiresIn")


class SessionResponse(BaseModel):
    """Session response."""

    is_authenticated: bool = Field(alias="isAuthenticated")
    user: Optional[UserProfile] = None
    expires_at: Optional[datetime] = Field(default=None, alias="expiresAt")


class EIDVerifyInput(BaseModel):
    """EID verification input."""

    document_type: str = Field(alias="documentType")
    document_number: str = Field(alias="documentNumber")
    issuance_date: Optional[str] = Field(default=None, alias="issuanceDate")
    expiration_date: Optional[str] = Field(default=None, alias="expirationDate")


class EIDStatusResponse(BaseModel):
    """EID verification status."""

    verified: bool
    document_type: Optional[str] = Field(default=None, alias="documentType")
    verified_at: Optional[datetime] = Field(default=None, alias="verifiedAt")
    expires_at: Optional[datetime] = Field(default=None, alias="expiresAt")


class DeviceInfo(BaseModel):
    """Device information."""

    id: str
    name: str
    type: str
    last_seen: Optional[datetime] = Field(default=None, alias="lastSeen")
    trusted: bool


class DeviceStatusResponse(BaseModel):
    """Device status response."""

    available: bool
    device: Optional[DeviceInfo] = None
    last_sync: Optional[datetime] = Field(default=None, alias="lastSync")


class MachineEnrollmentResponse(BaseModel):
    """Machine enrollment response."""

    machine_id: str = Field(alias="machineId")
    client_id: str = Field(alias="clientId")
    secret: str
    access_token: Optional[str] = Field(default=None, alias="accessToken")


class MachineTokenResponse(BaseModel):
    """Machine token response."""

    access_token: str = Field(alias="accessToken")
    expires_in: int = Field(alias="expiresIn")
    token_type: str = Field(alias="tokenType")


class IdentityClientConfig(BaseModel):
    """Identity client configuration."""

    base_url: str
    client_id: str
    access_token: Optional[str] = None
    system_key: Optional[str] = None
    totp: Optional[TOTPConfig] = None
