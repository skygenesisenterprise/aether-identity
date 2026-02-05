"""Aether Identity Python SDK - Device module."""

from typing import List
from ..core.transport import Transport
from ..core.session import SessionManager
from ..types import DeviceInfo, DeviceStatusResponse


class DeviceModule:
    """Device management module."""

    def __init__(self, transport: Transport, session_manager: SessionManager):
        """Initialize device module.

        Args:
            transport: HTTP transport instance
            session_manager: Session manager instance
        """
        self._transport = transport
        self._session = session_manager

    def detect(self) -> List[DeviceInfo]:
        """Get list of user devices.

        Returns:
            List of device information
        """
        response = self._transport.get(
            "/api/v1/devices", access_token=self._session.get_access_token()
        )

        if isinstance(response, list):
            return [DeviceInfo.model_validate(device) for device in response]

        return []

    def status(self) -> DeviceStatusResponse:
        """Get device availability status.

        Returns:
            Device status response
        """
        response = self._transport.get(
            "/api/v1/devices/status", access_token=self._session.get_access_token()
        )

        return DeviceStatusResponse.model_validate(response)
