"""Aether Identity Python SDK - TOTP module."""

from typing import Optional
from ..core.transport import Transport
from ..core.session import SessionManager
from ..types import (
    TOTPSetupResponse,
    TOTPVerifyInput,
    TOTPStatusResponse,
    TOTPLoginInput,
    TokenResponse,
    OAuthParams,
)


class TOTPModule:
    """TOTP/2FA operations module."""

    def __init__(self, transport: Transport, session_manager: SessionManager):
        """Initialize TOTP module.

        Args:
            transport: HTTP transport instance
            session_manager: Session manager instance
        """
        self._transport = transport
        self._session = session_manager

    def setup(self) -> TOTPSetupResponse:
        """Setup TOTP for user.

        Returns:
            TOTP setup data with secret and QR code
        """
        response = self._transport.post(
            "/api/v1/auth/totp/setup", access_token=self._session.get_access_token()
        )

        return TOTPSetupResponse.model_validate(response)

    def verify(self, input_data: TOTPVerifyInput) -> dict:
        """Verify TOTP code.

        Args:
            input_data: TOTP verification input

        Returns:
            API response
        """
        data = input_data.model_dump(exclude_none=True, by_alias=True)

        return self._transport.post(
            "/api/v1/auth/totp/verify", data, access_token=self._session.get_access_token()
        )

    def disable(self) -> dict:
        """Disable TOTP.

        Returns:
            API response
        """
        return self._transport.post(
            "/api/v1/auth/totp/disable", access_token=self._session.get_access_token()
        )

    def get_status(self) -> TOTPStatusResponse:
        """Check TOTP status.

        Returns:
            TOTP status response
        """
        response = self._transport.get(
            "/api/v1/auth/totp/status", access_token=self._session.get_access_token()
        )

        return TOTPStatusResponse.model_validate(response)

    def login(
        self, input_data: TOTPLoginInput, oauth_params: Optional[OAuthParams] = None
    ) -> TokenResponse:
        """Login with TOTP.

        Args:
            input_data: TOTP login input
            oauth_params: Optional OAuth parameters

        Returns:
            Token response
        """
        data = input_data.model_dump(by_alias=True)

        if oauth_params:
            data.update(oauth_params.model_dump(exclude_none=True, by_alias=True))

        response = self._transport.post("/api/v1/auth/totp/login", data)

        tokens = TokenResponse.model_validate(response)
        self._session.set_tokens(tokens)

        return tokens
