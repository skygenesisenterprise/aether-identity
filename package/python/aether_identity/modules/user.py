"""Aether Identity Python SDK - User module."""

from typing import List
from ..core.transport import Transport
from ..core.session import SessionManager
from ..types import UserProfile, UserRole


class UserModule:
    """User operations module."""

    def __init__(self, transport: Transport, session_manager: SessionManager):
        """Initialize user module.

        Args:
            transport: HTTP transport instance
            session_manager: Session manager instance
        """
        self._transport = transport
        self._session = session_manager

    def profile(self) -> UserProfile:
        """Get current user profile.

        Returns:
            User profile data
        """
        response = self._transport.get(
            "/api/v1/users/me", access_token=self._session.get_access_token()
        )

        return UserProfile.model_validate(response)

    def roles(self) -> List[UserRole]:
        """Get user roles.

        Returns:
            List of user roles
        """
        response = self._transport.get(
            "/api/v1/userinfo", access_token=self._session.get_access_token()
        )

        # Extract role from user profile
        if response and "role" in response:
            role = UserRole(
                id=response.get("id", ""),
                name=response["role"],
                permissions=response.get("permissions", []),
            )
            return [role]

        return []

    def has_permission(self, permission: str) -> bool:
        """Check if user has a specific permission.

        Args:
            permission: Permission to check

        Returns:
            True if user has permission, False otherwise
        """
        roles = self.roles()

        for role in roles:
            if permission in role.permissions:
                return True

        return False
