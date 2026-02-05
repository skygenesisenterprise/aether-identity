"""Aether Identity Python SDK - Core transport module."""

import time
from typing import Optional, Any
import httpx

from .exceptions import create_error_from_response, NetworkError, IdentityError


class Transport:
    """HTTP transport layer for Aether Identity API."""

    def __init__(
        self,
        base_url: str,
        client_id: str,
        system_key: Optional[str] = None,
        max_retries: int = 3,
        retry_delay: float = 1.0,
        timeout: float = 30.0,
    ):
        """Initialize transport layer.

        Args:
            base_url: Base URL of the Aether Identity API
            client_id: Client ID for authentication
            system_key: Optional system key for administrative operations
            max_retries: Maximum number of retries for failed requests
            retry_delay: Base delay between retries in seconds
            timeout: Request timeout in seconds
        """
        self.base_url = base_url.rstrip("/")
        self.client_id = client_id
        self.system_key = system_key
        self.max_retries = max_retries
        self.retry_delay = retry_delay
        self.timeout = timeout

        # Initialize HTTP client
        self._client = httpx.Client(
            base_url=self.base_url,
            timeout=timeout,
            headers={
                "Content-Type": "application/json",
                "X-Client-ID": client_id,
            },
        )

    def _get_headers(
        self, access_token: Optional[str] = None, use_system_key_as_auth: bool = False
    ) -> dict[str, str]:
        """Build request headers.

        Args:
            access_token: Optional access token for authorization
            use_system_key_as_auth: Whether to use system key as auth header

        Returns:
            Dictionary of headers
        """
        headers: dict[str, str] = {}

        if access_token:
            headers["Authorization"] = f"Bearer {access_token}"
        elif use_system_key_as_auth and self.system_key:
            headers["Authorization"] = f"Bearer {self.system_key}"
        elif self.system_key:
            headers["X-System-Key"] = self.system_key

        return headers

    def _make_request(
        self,
        method: str,
        endpoint: str,
        data: Optional[dict[str, Any]] = None,
        access_token: Optional[str] = None,
        use_system_key_as_auth: bool = False,
    ) -> dict[str, Any]:
        """Make HTTP request with retry logic.

        Args:
            method: HTTP method (GET, POST, PUT, DELETE)
            endpoint: API endpoint (without base URL)
            data: Optional request body data
            access_token: Optional access token
            use_system_key_as_auth: Whether to use system key for auth

        Returns:
            Response data as dictionary

        Raises:
            IdentityError: On API errors
            NetworkError: On network failures
        """
        url = endpoint if endpoint.startswith("/") else f"/{endpoint}"
        headers = self._get_headers(access_token, use_system_key_as_auth)

        last_error: Optional[Exception] = None

        for attempt in range(self.max_retries):
            try:
                if method == "GET":
                    response = self._client.get(url, headers=headers)
                elif method == "POST":
                    response = self._client.post(url, json=data, headers=headers)
                elif method == "PUT":
                    response = self._client.put(url, json=data, headers=headers)
                elif method == "DELETE":
                    response = self._client.delete(url, headers=headers)
                else:
                    raise ValueError(f"Unsupported HTTP method: {method}")

                # Handle response
                if response.status_code >= 200 and response.status_code < 300:
                    if response.content:
                        return response.json()
                    return {}
                elif response.status_code >= 500:
                    # Server error - retry
                    last_error = create_error_from_response(
                        response.status_code,
                        response.json() if response.content else {"message": "Server error"},
                    )
                    if attempt < self.max_retries - 1:
                        time.sleep(self.retry_delay * (2**attempt))  # Exponential backoff
                        continue
                else:
                    # Client error - don't retry
                    error_data = (
                        response.json() if response.content else {"message": "Request failed"}
                    )
                    raise create_error_from_response(response.status_code, error_data)

            except httpx.NetworkError as e:
                last_error = NetworkError(f"Network error: {str(e)}")
                if attempt < self.max_retries - 1:
                    time.sleep(self.retry_delay * (2**attempt))
                    continue
            except IdentityError:
                raise
            except Exception as e:
                last_error = IdentityError(f"Request failed: {str(e)}")
                if attempt < self.max_retries - 1:
                    time.sleep(self.retry_delay * (2**attempt))
                    continue

        # All retries exhausted
        if isinstance(last_error, IdentityError):
            raise last_error
        raise NetworkError(f"Request failed after {self.max_retries} attempts: {str(last_error)}")

    def get(self, endpoint: str, access_token: Optional[str] = None) -> dict[str, Any]:
        """Make GET request.

        Args:
            endpoint: API endpoint
            access_token: Optional access token

        Returns:
            Response data
        """
        return self._make_request("GET", endpoint, access_token=access_token)

    def post(
        self,
        endpoint: str,
        data: Optional[dict[str, Any]] = None,
        access_token: Optional[str] = None,
        use_system_key_as_auth: bool = False,
    ) -> dict[str, Any]:
        """Make POST request.

        Args:
            endpoint: API endpoint
            data: Request body data
            access_token: Optional access token
            use_system_key_as_auth: Whether to use system key for auth

        Returns:
            Response data
        """
        return self._make_request("POST", endpoint, data, access_token, use_system_key_as_auth)

    def put(
        self,
        endpoint: str,
        data: Optional[dict[str, Any]] = None,
        access_token: Optional[str] = None,
    ) -> dict[str, Any]:
        """Make PUT request.

        Args:
            endpoint: API endpoint
            data: Request body data
            access_token: Optional access token

        Returns:
            Response data
        """
        return self._make_request("PUT", endpoint, data, access_token)

    def delete(self, endpoint: str, access_token: Optional[str] = None) -> dict[str, Any]:
        """Make DELETE request.

        Args:
            endpoint: API endpoint
            access_token: Optional access token

        Returns:
            Response data
        """
        return self._make_request("DELETE", endpoint, access_token=access_token)

    def close(self) -> None:
        """Close the HTTP client."""
        self._client.close()

    def __enter__(self):
        """Context manager entry."""
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit."""
        self.close()
        return False
