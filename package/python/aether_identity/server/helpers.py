"""Aether Identity Python SDK - Server helpers."""

from typing import Optional, List, Dict, Any
import httpx
from .cache import TokenCache
from .types import UserContext
from ..exceptions import AuthenticationError, AuthorizationError


class ServerHelpers:
    """Helper functions for server-side operations."""

    def __init__(
        self,
        base_url: str,
        client_id: str,
        system_key: Optional[str] = None,
        jwt_secret: Optional[str] = None,
        cache: Optional[TokenCache] = None,
    ):
        """Initialize server helpers.

        Args:
            base_url: API base URL
            client_id: Client ID
            system_key: System key for admin operations
            jwt_secret: JWT secret for token validation
            cache: Token cache instance
        """
        self._base_url = base_url.rstrip("/")
        self._client_id = client_id
        self._system_key = system_key
        self._jwt_secret = jwt_secret
        self._cache = cache
        self._client = httpx.Client(base_url=self._base_url, headers={"X-Client-ID": client_id})

    def make_request(
        self,
        method: str,
        endpoint: str,
        data: Optional[Dict] = None,
        headers: Optional[Dict] = None,
    ) -> Dict[str, Any]:
        """Make HTTP request to API.

        Args:
            method: HTTP method
            endpoint: API endpoint
            data: Request body
            headers: Additional headers

        Returns:
            Response data
        """
        url = endpoint if endpoint.startswith("/") else f"/{endpoint}"
        request_headers = headers or {}

        if self._system_key:
            request_headers["X-System-Key"] = self._system_key

        if method == "GET":
            response = self._client.get(url, headers=request_headers)
        elif method == "POST":
            response = self._client.post(url, json=data, headers=request_headers)
        elif method == "PUT":
            response = self._client.put(url, json=data, headers=request_headers)
        elif method == "DELETE":
            response = self._client.delete(url, headers=request_headers)
        else:
            raise ValueError(f"Unsupported method: {method}")

        response.raise_for_status()
        return response.json() if response.content else {}

    def validate_token(self, token: str) -> Optional[UserContext]:
        """Validate JWT token.

        Args:
            token: JWT token

        Returns:
            User context if valid, None otherwise
        """
        # Check cache first
        if self._cache:
            cached = self._cache.get(token)
            if cached:
                return cached

        try:
            # Call validation endpoint
            response = self._client.get(
                "/api/v1/auth/validate", headers={"Authorization": f"Bearer {token}"}
            )

            if response.status_code != 200:
                return None

            data = response.json()
            user = UserContext(
                id=data.get("id", ""),
                email=data.get("email", ""),
                roles=data.get("roles", []),
                permissions=data.get("permissions", []),
                mfa_verified=data.get("mfaVerified", False),
                context=data.get("context", "user"),
            )

            # Cache the result
            if self._cache:
                expires_at = data.get("expiresAt")
                self._cache.set(token, user, expires_at)

            return user

        except Exception:
            return None

    def generate_token(self, user_id: str, email: str, **kwargs) -> str:
        """Generate server-side token.

        Args:
            user_id: User ID
            email: User email
            **kwargs: Additional claims

        Returns:
            JWT token
        """
        # This would typically use a JWT library
        # For now, this is a placeholder
        raise NotImplementedError("Token generation requires JWT implementation")

    def extract_token_from_header(self, header_value: Optional[str]) -> Optional[str]:
        """Extract token from Authorization header.

        Args:
            header_value: Authorization header value

        Returns:
            Token string or None
        """
        if not header_value:
            return None

        parts = header_value.split()
        if len(parts) == 2 and parts[0].lower() == "bearer":
            return parts[1]

        return None

    def has_role(self, user: UserContext, roles: List[str]) -> bool:
        """Check if user has any of the required roles.

        Args:
            user: User context
            roles: Required roles

        Returns:
            True if user has at least one role
        """
        return any(role in user.roles for role in roles)

    def has_permission(self, user: UserContext, permissions: List[str]) -> bool:
        """Check if user has all required permissions.

        Args:
            user: User context
            permissions: Required permissions

        Returns:
            True if user has all permissions
        """
        return all(perm in user.permissions for perm in permissions)

    def requires_mfa(self, context: str, mfa_config: Any) -> bool:
        """Check if MFA is required for context.

        Args:
            context: Context type
            mfa_config: MFA requirement config (bool or list of contexts)

        Returns:
            True if MFA required
        """
        if isinstance(mfa_config, bool):
            return mfa_config

        if isinstance(mfa_config, list):
            return context in mfa_config

        return False

    def close(self) -> None:
        """Close HTTP client."""
        self._client.close()
