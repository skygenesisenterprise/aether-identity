"""Aether Identity Python SDK - Hook manager."""

import uuid
from typing import Optional, Dict, Any
from .types import (
    HookContext,
    LoginHookContext,
    LogoutHookContext,
    TokenRefreshHookContext,
    UnauthorizedAttemptHookContext,
    MFARequiredHookContext,
    RoleCheckHookContext,
)
from .config import IdentityServerHooks


class HookManager:
    """Manages lifecycle hooks for the server SDK."""

    def __init__(self, hooks: Optional[IdentityServerHooks] = None):
        """Initialize hook manager.

        Args:
            hooks: Hook configuration
        """
        self._hooks = hooks

    def _generate_request_id(self) -> str:
        """Generate unique request ID."""
        return str(uuid.uuid4())

    def _make_context(
        self, ip: Optional[str] = None, user_agent: Optional[str] = None, path: Optional[str] = None
    ) -> Dict[str, Any]:
        """Create base context dictionary."""
        return {
            "ip": ip,
            "user_agent": user_agent,
            "request_id": self._generate_request_id(),
            "path": path,
        }

    async def on_login(
        self,
        user_id: str,
        email: str,
        success: bool,
        ip: Optional[str] = None,
        user_agent: Optional[str] = None,
        path: Optional[str] = None,
    ) -> None:
        """Trigger login hook."""
        if not self._hooks or not self._hooks.on_login:
            return

        context = LoginHookContext(
            **self._make_context(ip, user_agent, path),
            user_id=user_id,
            email=email,
            success=success,
        )

        try:
            if hasattr(self._hooks.on_login, "__call__"):
                import asyncio

                if asyncio.iscoroutinefunction(self._hooks.on_login):
                    await self._hooks.on_login(context)
                else:
                    self._hooks.on_login(context)
        except Exception:
            # Hooks are fire-and-forget
            pass

    async def on_logout(
        self,
        user_id: str,
        ip: Optional[str] = None,
        user_agent: Optional[str] = None,
        path: Optional[str] = None,
    ) -> None:
        """Trigger logout hook."""
        if not self._hooks or not self._hooks.on_logout:
            return

        context = LogoutHookContext(**self._make_context(ip, user_agent, path), user_id=user_id)

        try:
            if hasattr(self._hooks.on_logout, "__call__"):
                import asyncio

                if asyncio.iscoroutinefunction(self._hooks.on_logout):
                    await self._hooks.on_logout(context)
                else:
                    self._hooks.on_logout(context)
        except Exception:
            pass

    async def on_token_refresh(
        self,
        user_id: str,
        ip: Optional[str] = None,
        user_agent: Optional[str] = None,
        path: Optional[str] = None,
    ) -> None:
        """Trigger token refresh hook."""
        if not self._hooks or not self._hooks.on_token_refresh:
            return

        context = TokenRefreshHookContext(
            **self._make_context(ip, user_agent, path), user_id=user_id
        )

        try:
            if hasattr(self._hooks.on_token_refresh, "__call__"):
                import asyncio

                if asyncio.iscoroutinefunction(self._hooks.on_token_refresh):
                    await self._hooks.on_token_refresh(context)
                else:
                    self._hooks.on_token_refresh(context)
        except Exception:
            pass

    async def on_unauthorized_attempt(
        self,
        reason: str,
        token: Optional[str] = None,
        ip: Optional[str] = None,
        user_agent: Optional[str] = None,
        path: Optional[str] = None,
    ) -> None:
        """Trigger unauthorized attempt hook."""
        if not self._hooks or not self._hooks.on_unauthorized_attempt:
            return

        context = UnauthorizedAttemptHookContext(
            **self._make_context(ip, user_agent, path), reason=reason, token=token
        )

        try:
            if hasattr(self._hooks.on_unauthorized_attempt, "__call__"):
                import asyncio

                if asyncio.iscoroutinefunction(self._hooks.on_unauthorized_attempt):
                    await self._hooks.on_unauthorized_attempt(context)
                else:
                    self._hooks.on_unauthorized_attempt(context)
        except Exception:
            pass

    async def on_mfa_required(
        self,
        user_id: str,
        ip: Optional[str] = None,
        user_agent: Optional[str] = None,
        path: Optional[str] = None,
    ) -> None:
        """Trigger MFA required hook."""
        if not self._hooks or not self._hooks.on_mfa_required:
            return

        context = MFARequiredHookContext(
            **self._make_context(ip, user_agent, path), user_id=user_id
        )

        try:
            if hasattr(self._hooks.on_mfa_required, "__call__"):
                import asyncio

                if asyncio.iscoroutinefunction(self._hooks.on_mfa_required):
                    await self._hooks.on_mfa_required(context)
                else:
                    self._hooks.on_mfa_required(context)
        except Exception:
            pass

    async def on_role_check(
        self,
        user_id: str,
        required_roles: list,
        has_role: bool,
        ip: Optional[str] = None,
        user_agent: Optional[str] = None,
        path: Optional[str] = None,
    ) -> None:
        """Trigger role check hook."""
        if not self._hooks or not self._hooks.on_role_check:
            return

        context = RoleCheckHookContext(
            **self._make_context(ip, user_agent, path),
            user_id=user_id,
            required_roles=required_roles,
            has_role=has_role,
        )

        try:
            if hasattr(self._hooks.on_role_check, "__call__"):
                import asyncio

                if asyncio.iscoroutinefunction(self._hooks.on_role_check):
                    await self._hooks.on_role_check(context)
                else:
                    self._hooks.on_role_check(context)
        except Exception:
            pass
