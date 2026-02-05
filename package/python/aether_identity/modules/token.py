"""Aether Identity Python SDK - Token module."""

from ..core.transport import Transport
from ..core.session import SessionManager
from ..types import TokenResponse


class TokenModule:
    """Token operations module."""

    def __init__(self, transport: Transport, session_manager: SessionManager):
        """Initialize token module.

        Args:
            transport: HTTP transport instance
            session_manager: Session manager instance
        """
        self._transport = transport
        self._session = session_manager

    def refresh(self) -> TokenResponse:
        """Refresh the access token.

        Returns:
            New token response
        """
        refresh_token = self._session.get_refresh_token()

        if not refresh_token:
            raise ValueError("No refresh token available")

        data = {"refreshToken": refresh_token}

        response = self._transport.post("/api/v1/auth/refresh", data)

        tokens = TokenResponse.model_validate(response)
        self._session.set_tokens(tokens)

        return tokens

    def revoke(self) -> None:
        """Revoke the current token.

        Clears session regardless of API success.
        """
        token = self._session.get_access_token()

        if token:
            try:
                self._transport.post("/api/v1/auth/token/revoke", access_token=token)
            except Exception:
                pass

        self._session.clear()
