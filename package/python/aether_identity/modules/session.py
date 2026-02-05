"""Aether Identity Python SDK - Session module."""

from typing import Optional
from ..core.transport import Transport
from ..core.session import SessionManager
from ..types import SessionResponse, UserProfile


class SessionModule:
    """Session management module."""

    def __init__(self, transport: Transport, session_manager: SessionManager):
        """Initialize session module.

        Args:
            transport: HTTP transport instance
            session_manager: Session manager instance
        """
        self._transport = transport
        self._session = session_manager

    def current(self) -> SessionResponse:
        """Get current session information.

        Returns:
            Session response with authentication status and user info
        """
        token = self._session.get_access_token()

        if not token:
            return SessionResponse(is_authenticated=False)

        try:
            response = self._transport.get("/api/v1/userinfo", access_token=token)

            user = UserProfile.model_validate(response) if response else None

            return SessionResponse(
                is_authenticated=True,
                user=user,
                expires_at=None,  # Could be fetched from session
            )
        except Exception:
            return SessionResponse(is_authenticated=False)

    def is_authenticated(self) -> bool:
        """Check if user is authenticated.

        Returns:
            True if authenticated, False otherwise
        """
        return self._session.is_authenticated()
