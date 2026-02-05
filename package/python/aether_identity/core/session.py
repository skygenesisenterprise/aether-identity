"""Aether Identity Python SDK - Session management module."""

import time
from typing import Optional, Protocol, TYPE_CHECKING

if TYPE_CHECKING:
    from ..types import TokenResponse


class Storage(Protocol):
    """Protocol for token storage backends."""

    def get(self, key: str) -> Optional[str]:
        """Get value by key."""
        ...

    def set(self, key: str, value: str) -> None:
        """Set value by key."""
        ...

    def remove(self, key: str) -> None:
        """Remove value by key."""
        ...


class MemoryStorage:
    """In-memory storage backend."""

    def __init__(self):
        self._data: dict[str, str] = {}

    def get(self, key: str) -> Optional[str]:
        return self._data.get(key)

    def set(self, key: str, value: str) -> None:
        self._data[key] = value

    def remove(self, key: str) -> None:
        self._data.pop(key, None)


class SessionManager:
    """Manages session tokens and state."""

    # Storage keys
    ACCESS_TOKEN_KEY = "aether_access_token"
    REFRESH_TOKEN_KEY = "aether_refresh_token"
    EXPIRES_AT_KEY = "aether_expires_at"

    def __init__(self, storage: Optional[Storage] = None):
        """Initialize session manager.

        Args:
            storage: Optional storage backend (defaults to MemoryStorage)
        """
        self._storage = storage or MemoryStorage()

    def set_tokens(self, tokens: TokenResponse) -> None:
        """Store all tokens from a token response.

        Args:
            tokens: Token response containing access_token, refresh_token, expires_in
        """
        self._storage.set(self.ACCESS_TOKEN_KEY, tokens.access_token)
        self._storage.set(self.REFRESH_TOKEN_KEY, tokens.refresh_token)

        expires_at = int(time.time()) + tokens.expires_in
        self._storage.set(self.EXPIRES_AT_KEY, str(expires_at))

    def set_token(self, token: str, expires_in: int = 3600) -> None:
        """Store access token with expiration.

        Args:
            token: Access token string
            expires_in: Token lifetime in seconds (default: 1 hour)
        """
        self._storage.set(self.ACCESS_TOKEN_KEY, token)
        expires_at = int(time.time()) + expires_in
        self._storage.set(self.EXPIRES_AT_KEY, str(expires_at))

    def set_access_token(self, token: str, expires_in: int = 3600) -> None:
        """Store access token with custom expiration.

        Args:
            token: Access token string
            expires_in: Token lifetime in seconds
        """
        self._storage.set(self.ACCESS_TOKEN_KEY, token)
        expires_at = int(time.time()) + expires_in
        self._storage.set(self.EXPIRES_AT_KEY, str(expires_at))

    def get_access_token(self) -> Optional[str]:
        """Get current access token.

        Returns:
            Access token or None if not set
        """
        return self._storage.get(self.ACCESS_TOKEN_KEY)

    def get_refresh_token(self) -> Optional[str]:
        """Get current refresh token.

        Returns:
            Refresh token or None if not set
        """
        return self._storage.get(self.REFRESH_TOKEN_KEY)

    def get_expires_at(self) -> Optional[int]:
        """Get token expiration timestamp.

        Returns:
            Expiration timestamp or None if not set
        """
        value = self._storage.get(self.EXPIRES_AT_KEY)
        return int(value) if value else None

    def is_authenticated(self) -> bool:
        """Check if user is authenticated and token is not expired.

        Returns:
            True if authenticated and token valid, False otherwise
        """
        token = self.get_access_token()
        if not token:
            return False

        expires_at = self.get_expires_at()
        if not expires_at:
            return False

        # Check if token is expired (with 60 second buffer)
        return time.time() < (expires_at - 60)

    def clear(self) -> None:
        """Clear all stored tokens."""
        self._storage.remove(self.ACCESS_TOKEN_KEY)
        self._storage.remove(self.REFRESH_TOKEN_KEY)
        self._storage.remove(self.EXPIRES_AT_KEY)
