"""Aether Identity Python SDK - Server middleware."""

from typing import Optional, List, Callable, Any
from functools import wraps
from .helpers import ServerHelpers
from .hooks import HookManager
from .types import UserContext
from .config import IdentityServerConfig
from ..exceptions import AuthenticationError, AuthorizationError


class MiddlewareFactory:
    """Factory for creating middleware for various frameworks."""

    def __init__(
        self, config: IdentityServerConfig, helpers: ServerHelpers, hook_manager: HookManager
    ):
        """Initialize middleware factory.

        Args:
            config: Server configuration
            helpers: Server helpers instance
            hook_manager: Hook manager instance
        """
        self._config = config
        self._helpers = helpers
        self._hooks = hook_manager

    def _extract_token(self, request: Any) -> Optional[str]:
        """Extract token from request."""
        # Try header first
        header_name = self._config.token_header.lower()
        header_value = None

        if hasattr(request, "headers"):
            # FastAPI/Starlette style
            header_value = request.headers.get(header_name)
        elif hasattr(request, "META"):
            # Django style
            header_value = request.META.get(f"HTTP_{header_name.upper().replace('-', '_')}")
        elif hasattr(request, "headers"):
            # Flask style
            header_value = request.headers.get(header_name)

        if header_value:
            return self._helpers.extract_token_from_header(header_value)

        # Try cookie
        if hasattr(request, "cookies"):
            return request.cookies.get(self._config.cookie_name)

        return None

    def _get_client_info(self, request: Any):
        """Extract client IP and user agent."""
        ip = None
        user_agent = None

        if hasattr(request, "client") and request.client:
            ip = request.client.host
        elif hasattr(request, "META"):
            ip = request.META.get("REMOTE_ADDR")

        if hasattr(request, "headers"):
            user_agent = request.headers.get("user-agent")
        elif hasattr(request, "META"):
            user_agent = request.META.get("HTTP_USER_AGENT")

        return ip, user_agent

    # FastAPI Middleware

    def fastapi_auth_middleware(self):
        """Create FastAPI dependency for authentication."""
        from fastapi import Request, HTTPException

        async def auth_dependency(request: Request) -> UserContext:
            token = self._extract_token(request)

            if not token:
                await self._hooks.on_unauthorized_attempt(
                    reason="No token provided",
                    ip=request.client.host if request.client else None,
                    user_agent=request.headers.get("user-agent"),
                    path=str(request.url),
                )
                raise HTTPException(status_code=401, detail="Authentication required")

            user = self._helpers.validate_token(token)

            if not user:
                await self._hooks.on_unauthorized_attempt(
                    reason="Invalid token",
                    token=token,
                    ip=request.client.host if request.client else None,
                    user_agent=request.headers.get("user-agent"),
                    path=str(request.url),
                )
                raise HTTPException(status_code=401, detail="Invalid token")

            # Attach to request state
            request.state.user = user
            request.state.token = token
            request.state.context = user.context

            return user

        return auth_dependency

    def fastapi_rbac_middleware(self, roles: List[str]):
        """Create FastAPI dependency for role-based access control."""
        from fastapi import Request, HTTPException

        async def rbac_dependency(request: Request) -> UserContext:
            user = getattr(request.state, "user", None)

            if not user:
                raise HTTPException(status_code=401, detail="Authentication required")

            has_role = self._helpers.has_role(user, roles)

            await self._hooks.on_role_check(
                user_id=user.id,
                required_roles=roles,
                has_role=has_role,
                ip=request.client.host if request.client else None,
                user_agent=request.headers.get("user-agent"),
                path=str(request.url),
            )

            if not has_role:
                raise HTTPException(status_code=403, detail="Insufficient permissions")

            return user

        return rbac_dependency

    def fastapi_mfa_middleware(self):
        """Create FastAPI dependency for MFA verification."""
        from fastapi import Request, HTTPException

        async def mfa_dependency(request: Request) -> UserContext:
            user = getattr(request.state, "user", None)

            if not user:
                raise HTTPException(status_code=401, detail="Authentication required")

            if self._helpers.requires_mfa(user.context, self._config.mfa_required):
                if not user.mfa_verified:
                    await self._hooks.on_mfa_required(
                        user_id=user.id,
                        ip=request.client.host if request.client else None,
                        user_agent=request.headers.get("user-agent"),
                        path=str(request.url),
                    )
                    raise HTTPException(status_code=401, detail="MFA verification required")

            return user

        return mfa_dependency

    # Flask Middleware

    def flask_auth_middleware(self):
        """Create Flask middleware for authentication."""
        from flask import request, g

        def middleware():
            token = self._extract_token(request)

            if not token:
                self._hooks.on_unauthorized_attempt(
                    reason="No token provided",
                    ip=request.remote_addr,
                    user_agent=request.user_agent.string if request.user_agent else None,
                    path=request.path,
                )
                return None, 401

            user = self._helpers.validate_token(token)

            if not user:
                self._hooks.on_unauthorized_attempt(
                    reason="Invalid token",
                    token=token,
                    ip=request.remote_addr,
                    user_agent=request.user_agent.string if request.user_agent else None,
                    path=request.path,
                )
                return None, 401

            g.user = user
            g.token = token
            g.context = user.context

            return None, None

        return middleware

    def flask_protect_route(self, roles: Optional[List[str]] = None):
        """Create Flask decorator for protected routes."""
        from flask import g, jsonify

        def decorator(f):
            @wraps(f)
            def wrapper(*args, **kwargs):
                # Check auth
                user = getattr(g, "user", None)

                if not user:
                    return jsonify({"error": "Authentication required"}), 401

                # Check roles if specified
                if roles:
                    has_role = self._helpers.has_role(user, roles)

                    self._hooks.on_role_check(
                        user_id=user.id, required_roles=roles, has_role=has_role
                    )

                    if not has_role:
                        return jsonify({"error": "Insufficient permissions"}), 403

                return f(*args, **kwargs)

            return wrapper

        return decorator

    # Generic middleware for any framework

    def protect_route(self, roles: Optional[List[str]] = None):
        """Generic route protection decorator.

        Works with frameworks that attach user to request object.
        """

        def decorator(f):
            @wraps(f)
            def wrapper(request, *args, **kwargs):
                # Try to get user from request
                user = getattr(request, "user", None)

                if not user:
                    raise AuthenticationError("Authentication required")

                if roles and not self._helpers.has_role(user, roles):
                    raise AuthorizationError("Insufficient permissions")

                return f(request, *args, **kwargs)

            return wrapper

        return decorator
