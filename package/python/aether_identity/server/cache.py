"""Aether Identity Python SDK - Token cache."""

import time
from typing import Optional, Dict
from collections import OrderedDict
from .types import UserContext


class TokenCache:
    """LRU cache for validated tokens."""

    def __init__(self, ttl: int = 300, max_size: int = 1000):
        """Initialize token cache.

        Args:
            ttl: Time-to-live in seconds
            max_size: Maximum number of cached entries
        """
        self._ttl = ttl
        self._max_size = max_size
        self._cache: OrderedDict[str, Dict] = OrderedDict()

    def get(self, token: str) -> Optional[UserContext]:
        """Get cached user context for token.

        Args:
            token: JWT token

        Returns:
            User context if cached and not expired, None otherwise
        """
        if token not in self._cache:
            return None

        entry = self._cache[token]

        # Check if expired
        if time.time() > entry["expires_at"]:
            del self._cache[token]
            return None

        # Move to end (most recently used)
        self._cache.move_to_end(token)

        return entry["user"]

    def set(self, token: str, user: UserContext, token_expires_at: Optional[float] = None) -> None:
        """Cache user context for token.

        Args:
            token: JWT token
            user: User context
            token_expires_at: Token expiration timestamp
        """
        # Calculate expiration
        cache_expires = time.time() + self._ttl
        if token_expires_at:
            cache_expires = min(cache_expires, token_expires_at)

        # Evict oldest if at capacity
        if len(self._cache) >= self._max_size and token not in self._cache:
            self._cache.popitem(last=False)

        self._cache[token] = {
            "user": user,
            "expires_at": cache_expires,
            "cached_at": time.time(),
        }

        # Move to end (most recently used)
        self._cache.move_to_end(token)

    def delete(self, token: str) -> None:
        """Remove token from cache.

        Args:
            token: JWT token
        """
        self._cache.pop(token, None)

    def clear(self) -> None:
        """Clear all cached entries."""
        self._cache.clear()

    @property
    def size(self) -> int:
        """Get number of cached entries."""
        return len(self._cache)

    def cleanup(self) -> int:
        """Remove expired entries.

        Returns:
            Number of entries removed
        """
        now = time.time()
        expired = [token for token, entry in self._cache.items() if now > entry["expires_at"]]

        for token in expired:
            del self._cache[token]

        return len(expired)
