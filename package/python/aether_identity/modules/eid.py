"""Aether Identity Python SDK - EID module."""

from ..core.transport import Transport
from ..core.session import SessionManager
from ..types import EIDVerifyInput, EIDStatusResponse


class EIDModule:
    """Electronic ID verification module."""

    def __init__(self, transport: Transport, session_manager: SessionManager):
        """Initialize EID module.

        Args:
            transport: HTTP transport instance
            session_manager: Session manager instance
        """
        self._transport = transport
        self._session = session_manager

    def verify(self, input_data: EIDVerifyInput) -> dict:
        """Verify an EID document.

        Args:
            input_data: EID verification input

        Returns:
            API response
        """
        data = input_data.model_dump(exclude_none=True, by_alias=True)

        return self._transport.post(
            "/api/v1/eid/verify", data, access_token=self._session.get_access_token()
        )

    def status(self) -> EIDStatusResponse:
        """Get EID verification status.

        Returns:
            EID status response
        """
        response = self._transport.get(
            "/api/v1/eid/status", access_token=self._session.get_access_token()
        )

        return EIDStatusResponse.model_validate(response)

    def revoke(self) -> dict:
        """Revoke EID verification.

        Returns:
            API response
        """
        return self._transport.post(
            "/api/v1/eid/revoke", access_token=self._session.get_access_token()
        )
