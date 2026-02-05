"""Aether Identity Python SDK - Server SDK."""

from typing import Optional, List, Dict, Any, Union
from .config import IdentityServerConfig, IdentityServerHooks
from .types import UserContext, LoginHookContext, LogoutHookContext
from .cache import TokenCache
from .hooks import HookManager
from .helpers import ServerHelpers
from .middleware import MiddlewareFactory


class IdentityServer:
    """Server-side SDK for Aether Identity."""

    def __init__(self, config: IdentityServerConfig):
        """Initialize Identity Server SDK.

        Args:
            config: Server configuration
        """
        self._config = config

        # Initialize components
        self._cache = TokenCache(ttl=config.cache.ttl, max_size=config.cache.max_size)

        self._hooks = HookManager(config.hooks)

        self._helpers = ServerHelpers(
            base_url=config.base_url,
            client_id=config.client_id,
            system_key=config.system_key,
            jwt_secret=config.jwt_secret,
            cache=self._cache,
        )

        self._middleware = MiddlewareFactory(
            config=config, helpers=self._helpers, hook_manager=self._hooks
        )

    # Middleware factory methods

    def auth_middleware(self):
        """Get authentication middleware.

        Returns:
            Framework-specific middleware
        """
        return self._middleware.fastapi_auth_middleware()

    def rbac_middleware(self, roles: List[str]):
        """Get RBAC middleware.

        Args:
            roles: Required roles

        Returns:
            Framework-specific middleware
        """
        return self._middleware.fastapi_rbac_middleware(roles)

    def protect_route(self, roles: Optional[List[str]] = None):
        """Get combined auth + RBAC protection.

        Args:
            roles: Optional required roles

        Returns:
            Decorator/middleware for route protection
        """
        return self._middleware.flask_protect_route(roles)

    def mfa_middleware(self):
        """Get MFA verification middleware.

        Returns:
            Framework-specific middleware
        """
        return self._middleware.fastapi_mfa_middleware()

    def context_middleware(self, context: str):
        """Get context validation middleware.

        Args:
            context: Required context type

        Returns:
            Framework-specific middleware
        """
        # TODO: Implement context validation
        raise NotImplementedError("Context middleware not yet implemented")

    # Helper methods

    def login(
        self,
        credentials: Dict[str, str],
        ip: Optional[str] = None,
        user_agent: Optional[str] = None,
        path: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Server-side login.

        Args:
            credentials: Login credentials (email, password)
            ip: Client IP
            user_agent: Client user agent
            path: Request path

        Returns:
            Login response with tokens
        """
        try:
            response = self._helpers.make_request("POST", "/api/v1/auth/login", data=credentials)

            # Trigger hook
            self._hooks.on_login(
                user_id=response.get("userId", ""),
                email=credentials.get("email", ""),
                success=True,
                ip=ip,
                user_agent=user_agent,
                path=path,
            )

            return response

        except Exception as e:
            self._hooks.on_login(
                user_id="",
                email=credentials.get("email", ""),
                success=False,
                ip=ip,
                user_agent=user_agent,
                path=path,
            )
            raise

    def logout(
        self,
        token: str,
        ip: Optional[str] = None,
        user_agent: Optional[str] = None,
        path: Optional[str] = None,
    ) -> None:
        """Server-side logout.

        Args:
            token: User token
            ip: Client IP
            user_agent: Client user agent
            path: Request path
        """
        try:
            user = self._helpers.validate_token(token)

            if user:
                self._hooks.on_logout(user_id=user.id, ip=ip, user_agent=user_agent, path=path)

                self._cache.delete(token)

                self._helpers.make_request(
                    "POST", "/api/v1/auth/logout", headers={"Authorization": f"Bearer {token}"}
                )
        except Exception:
            pass

    def refresh_token(
        self,
        refresh_token: str,
        ip: Optional[str] = None,
        user_agent: Optional[str] = None,
        path: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Server-side token refresh.

        Args:
            refresh_token: Refresh token
            ip: Client IP
            user_agent: Client user agent
            path: Request path

        Returns:
            New token response
        """
        response = self._helpers.make_request(
            "POST", "/api/v1/auth/refresh", data={"refreshToken": refresh_token}
        )

        # Extract user ID from new token
        new_token = response.get("accessToken", "")
        user = self._helpers.validate_token(new_token)

        if user:
            self._hooks.on_token_refresh(user_id=user.id, ip=ip, user_agent=user_agent, path=path)

        return response

    def validate_token(self, token: str) -> Optional[UserContext]:
        """Validate a token.

        Args:
            token: JWT token

        Returns:
            User context if valid, None otherwise
        """
        return self._helpers.validate_token(token)

    def get_user_from_token(self, token: str) -> Optional[UserContext]:
        """Extract user from token.

        Args:
            token: JWT token

        Returns:
            User context if valid, None otherwise
        """
        return self._helpers.validate_token(token)

    def generate_token(self, user_id: str, email: str, **kwargs) -> str:
        """Generate server-side token.

        Args:
            user_id: User ID
            email: User email
            **kwargs: Additional claims

        Returns:
            JWT token
        """
        return self._helpers.generate_token(user_id, email, **kwargs)

    def has_role(self, user: UserContext, roles: List[str]) -> bool:
        """Check if user has any of the required roles.

        Args:
            user: User context
            roles: Required roles

        Returns:
            True if user has at least one role
        """
        return self._helpers.has_role(user, roles)

    def has_permission(self, user: UserContext, permissions: List[str]) -> bool:
        """Check if user has all required permissions.

        Args:
            user: User context
            permissions: Required permissions

        Returns:
            True if user has all permissions
        """
        return self._helpers.has_permission(user, permissions)

    def requires_mfa(self, context: str) -> bool:
        """Check if MFA is required for context.

        Args:
            context: Context type

        Returns:
            True if MFA required
        """
        return self._helpers.requires_mfa(context, self._config.mfa_required)

    def extract_token_from_header(self, header_value: str) -> Optional[str]:
        """Extract token from Authorization header.

        Args:
            header_value: Authorization header value

        Returns:
            Token string or None
        """
        return self._helpers.extract_token_from_header(header_value)

    # Management methods

    def register_hooks(self, hooks: IdentityServerHooks) -> None:
        """Register lifecycle hooks.

        Args:
            hooks: Hook configuration
        """
        self._config.hooks = hooks
        self._hooks = HookManager(hooks)

    def clear_cache(self) -> None:
        """Clear token cache."""
        self._cache.clear()

    def get_cache_size(self) -> int:
        """Get cache entry count.

        Returns:
            Number of cached entries
        """
        return self._cache.size

    def close(self) -> None:
        """Close server SDK and release resources."""
        self._helpers.close()


def create_identity_server(
    base_url: str,
    client_id: str,
    system_key: Optional[str] = None,
    jwt_secret: Optional[str] = None,
    **kwargs,
) -> IdentityServer:
    """Factory function to create IdentityServer.

    Args:
        base_url: API base URL
        client_id: Client ID
        system_key: System key for admin operations
        jwt_secret: JWT secret for token validation
        **kwargs: Additional configuration options

    Returns:
        Configured IdentityServer instance
    """
    config = IdentityServerConfig(
        base_url=base_url,
        client_id=client_id,
        system_key=system_key,
        jwt_secret=jwt_secret,
        **kwargs,
    )
    return IdentityServer(config)
