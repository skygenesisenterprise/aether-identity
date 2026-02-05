"""Aether Identity Python SDK - Auth module."""

from typing import Optional
from ..core.transport import Transport
from ..core.session import SessionManager
from ..types import (
    AuthInput,
    RegisterInput,
    RegisterResponse,
    StrengthenInput,
    TokenResponse,
    OAuthParams,
)


class AuthModule:
    """Authentication operations module."""

    def __init__(self, transport: Transport, session_manager: SessionManager):
        """Initialize auth module.

        Args:
            transport: HTTP transport instance
            session_manager: Session manager instance
        """
        self._transport = transport
        self._session = session_manager

    def login(
        self, input_data: AuthInput, oauth_params: Optional[OAuthParams] = None
    ) -> TokenResponse:
        """Authenticate user.

        Args:
            input_data: Authentication credentials
            oauth_params: Optional OAuth parameters

        Returns:
            Token response with access and refresh tokens
        """
        data = {
            "email": input_data.email,
            "password": input_data.password,
        }

        if input_data._totp_code:
            data["totpCode"] = input_data._totp_code

        if oauth_params:
            data.update(oauth_params.model_dump(exclude_none=True, by_alias=True))

        response = self._transport.post("/api/v1/auth/login", data)

        tokens = TokenResponse.model_validate(response)
        self._session.set_tokens(tokens)

        return tokens

    def register(self, input_data: RegisterInput) -> RegisterResponse:
        """Register a new user.

        Args:
            input_data: Registration data

        Returns:
            Registration response
        """
        data = input_data.model_dump(exclude_none=True, by_alias=True)

        response = self._transport.post("/api/v1/auth/register", data, use_system_key_as_auth=True)

        return RegisterResponse.model_validate(response)

    def logout(self) -> None:
        """Sign out the current user.

        Clears local session even if API call fails.
        """
        try:
            token = self._session.get_access_token()
            if token:
                self._transport.post("/api/v1/auth/logout", access_token=token)
        except Exception:
            pass
        finally:
            self._session.clear()

    def strengthen(self, input_data: StrengthenInput) -> dict:
        """Strengthen the current session.

        Args:
            input_data: Strengthening parameters (totp, email, or sms)

        Returns:
            API response
        """
        data = input_data.model_dump(exclude_none=True, by_alias=True)

        return self._transport.post(
            "/api/v1/auth/strengthen", data, access_token=self._session.get_access_token()
        )
