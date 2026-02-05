"""Aether Identity Python SDK - Machine module."""

from ..core.transport import Transport
from ..types import MachineEnrollmentResponse, MachineTokenResponse


class MachineModule:
    """Machine-to-machine authentication module."""

    def __init__(self, transport: Transport):
        """Initialize machine module.

        Args:
            transport: HTTP transport instance
        """
        self._transport = transport

    def enroll(self) -> MachineEnrollmentResponse:
        """Enroll a new machine.

        Returns:
            Machine enrollment data
        """
        response = self._transport.post("/api/v1/machine/enroll", use_system_key_as_auth=True)

        return MachineEnrollmentResponse.model_validate(response)

    def token(self, secret: str) -> MachineTokenResponse:
        """Get machine token.

        Args:
            secret: Machine secret

        Returns:
            Machine token response
        """
        data = {
            "grant_type": "client_credentials",
            "client_id": self._transport.client_id,
            "client_secret": secret,
        }

        response = self._transport.post("/oauth2/token", data)

        return MachineTokenResponse.model_validate(response)

    def revoke(self, secret: str) -> dict:
        """Revoke machine credentials.

        Args:
            secret: Machine secret

        Returns:
            API response
        """
        data = {"client_secret": secret}

        return self._transport.post("/oauth2/revoke", data)
