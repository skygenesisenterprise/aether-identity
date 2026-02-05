"""Aether Identity Python SDK - Main client."""

from typing import Optional
from .core.transport import Transport
from .core.session import SessionManager
from .modules.auth import AuthModule
from .modules.session import SessionModule
from .modules.user import UserModule
from .modules.token import TokenModule
from .modules.eid import EIDModule
from .modules.machine import MachineModule
from .modules.device import DeviceModule
from .modules.totp import TOTPModule
from .types import IdentityClientConfig


class IdentityClient:
    """Main Aether Identity SDK client."""

    def __init__(self, config: IdentityClientConfig):
        """Initialize the Identity client.

        Args:
            config: Client configuration
        """
        self._config = config

        # Initialize core components
        self._transport = Transport(
            base_url=config.base_url,
            client_id=config.client_id,
            system_key=config.system_key,
        )

        self._session = SessionManager()

        # Initialize modules
        self._auth = AuthModule(self._transport, self._session)
        self._session_module = SessionModule(self._transport, self._session)
        self._user = UserModule(self._transport, self._session)
        self._token = TokenModule(self._transport, self._session)
        self._eid = EIDModule(self._transport, self._session)
        self._machine = MachineModule(self._transport)
        self._device = DeviceModule(self._transport, self._session)
        self._totp = TOTPModule(self._transport, self._session)

        # Set initial token if provided
        if config.access_token:
            self._session.set_token(config.access_token)

    @property
    def auth(self) -> AuthModule:
        """Access authentication module."""
        return self._auth

    @property
    def session(self) -> SessionModule:
        """Access session module."""
        return self._session_module

    @property
    def user(self) -> UserModule:
        """Access user module."""
        return self._user

    @property
    def token(self) -> TokenModule:
        """Access token module."""
        return self._token

    @property
    def eid(self) -> EIDModule:
        """Access EID module."""
        return self._eid

    @property
    def machine(self) -> MachineModule:
        """Access machine module."""
        return self._machine

    @property
    def device(self) -> DeviceModule:
        """Access device module."""
        return self._device

    @property
    def totp(self) -> TOTPModule:
        """Access TOTP module."""
        return self._totp

    def close(self) -> None:
        """Close the client and release resources."""
        self._transport.close()

    def __enter__(self):
        """Context manager entry."""
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit."""
        self.close()
        return False


def create_identity_client(
    base_url: str,
    client_id: str,
    access_token: Optional[str] = None,
    system_key: Optional[str] = None,
) -> IdentityClient:
    """Factory function to create an IdentityClient.

    Args:
        base_url: Base URL of the Aether Identity API
        client_id: Client ID
        access_token: Optional initial access token
        system_key: Optional system key for admin operations

    Returns:
        Configured IdentityClient instance
    """
    config = IdentityClientConfig(
        base_url=base_url,
        client_id=client_id,
        access_token=access_token,
        system_key=system_key,
    )
    return IdentityClient(config)
