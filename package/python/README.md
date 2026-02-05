<div align="center">

# 🐍 Aether Identity Python SDK

[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](https://github.com/skygenesisenterprise/aether-identity/blob/main/package/python/LICENSE) [![Python](https://img.shields.io/badge/Python-3.9+-blue?style=for-the-badge&logo=python)](https://python.org/) [![PyPI](https://img.shields.io/badge/PyPI-Package-blue?style=for-the-badge&logo=pypi)](https://pypi.org/) [![FastAPI](https://img.shields.io/badge/FastAPI-Supported-green?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/) [![Flask](https://img.shields.io/badge/Flask-Supported-lightgrey?style=for-the-badge&logo=flask)](https://flask.palletsprojects.com/)

**🔐 Official Python SDK for Aether Identity - Complete Authentication & Identity Management**

A comprehensive Python SDK providing client-side and server-side authentication capabilities for the Aether Identity platform. Features complete OAuth2/OIDC support, session management, 2FA/TOTP, device management, and enterprise-ready server middleware.

[🚀 Quick Start](#-quick-start) • [📦 Installation](#-installation) • [🔧 Usage](#-usage) • [🛡️ Server SDK](#️-server-sdk) • [📚 API Reference](#-api-reference)

</div>

---

## 🌟 What is Aether Identity Python SDK?

**Aether Identity Python SDK** is the official Python client library for the Aether Identity platform. It provides a complete toolkit for integrating authentication and identity management into Python applications, with support for both client-side usage and server-side middleware.

### 🎯 Key Features

- **🔐 Complete Authentication** - Login, register, logout with JWT tokens
- **🔄 Session Management** - Automatic token refresh and secure storage
- **🛡️ 2FA/TOTP Support** - Time-based one-time password verification
- **📱 Device Management** - Multi-device detection and status
- **🆔 EID Verification** - Electronic ID document verification
- **🤖 Machine-to-Machine** - Service account authentication
- **⚡ Server Middleware** - FastAPI/Flask authentication middleware
- **📦 Zero Dependencies** - Only requires `httpx` and `pydantic`
- **🔒 Type Safe** - Full type hints with Pydantic models

---

## 📦 Installation

### Standard Installation

```bash
pip install aether-identity
```

### With Server Dependencies

For FastAPI/Flask middleware support:

```bash
pip install aether-identity[server]
```

### Development Installation

```bash
git clone https://github.com/skygenesisenterprise/aether-identity.git
cd aether-identity/package/python
pip install -e ".[dev]"
```

---

## 🚀 Quick Start

### Client-Side Usage

```python
from aether_identity import create_identity_client, AuthInput

# Initialize client
client = create_identity_client(
    base_url="https://identity.skygenesisenterprise.com",
    client_id="your-client-id"
)

# Login
auth_input = AuthInput(email="user@example.com", password="password")
tokens = client.auth.login(auth_input)

# Get user profile
profile = client.user.profile()
print(f"Logged in as: {profile.name} ({profile.email})")

# Check authentication
if client.session.is_authenticated():
    print("User is authenticated!")

# Logout
client.auth.logout()
```

### Server-Side Usage (FastAPI)

```python
from fastapi import FastAPI, Depends
from aether_identity.server import create_identity_server

app = FastAPI()

# Initialize server SDK
identity_server = create_identity_server(
    base_url="https://identity.skygenesisenterprise.com",
    client_id="your-client-id",
    system_key="your-system-key"
)

# Protected route
@app.get("/protected")
async def protected_route(
    user=Depends(identity_server.auth_middleware())
):
    return {"message": f"Hello {user.email}!"}

# Route with role requirement
@app.get("/admin")
async def admin_route(
    user=Depends(identity_server.rbac_middleware(["admin"]))
):
    return {"message": "Admin area"}
```

---

## 🔧 Usage

### Authentication

```python
from aether_identity import (
    create_identity_client,
    AuthInput,
    RegisterInput,
    StrengthenInput
)

client = create_identity_client(
    base_url="https://identity.skygenesisenterprise.com",
    client_id="your-client-id"
)

# Register new user
register_input = RegisterInput(
    email="newuser@example.com",
    password="securepassword",
    name="John Doe"
)
response = client.auth.register(register_input)

# Login
auth_input = AuthInput(email="user@example.com", password="password")
tokens = client.auth.login(auth_input)

# Strengthen session with TOTP
strengthen = StrengthenInput(type="totp", value="123456")
client.auth.strengthen(strengthen)

# Logout
client.auth.logout()
```

### Token Management

```python
# Refresh access token
new_tokens = client.token.refresh()

# Revoke token
client.token.revoke()
```

### User Operations

```python
# Get profile
profile = client.user.profile()

# Get roles
roles = client.user.roles()

# Check permission
has_access = client.user.has_permission("users:read")
```

### TOTP/2FA

```python
from aether_identity import TOTPLoginInput

# Setup TOTP
setup = client.totp.setup()
print(f"Secret: {setup.secret}")
print(f"QR Code: {setup.qr_code}")

# Verify TOTP code
from aether_identity import TOTPVerifyInput
verify_input = TOTPVerifyInput(code="123456")
client.totp.verify(verify_input)

# Login with TOTP
totp_login = TOTPLoginInput(
    email="user@example.com",
    password="password",
    totp_code="123456"
)
tokens = client.totp.login(totp_login)
```

### Device Management

```python
# List devices
devices = client.device.detect()
for device in devices:
    print(f"{device.name} ({device.type}) - Trusted: {device.trusted}")

# Get device status
status = client.device.status()
```

### EID Verification

```python
from aether_identity import EIDVerifyInput

# Verify EID document
eid_input = EIDVerifyInput(
    document_type="passport",
    document_number="AB123456",
    issuance_date="2020-01-01",
    expiration_date="2030-01-01"
)
client.eid.verify(eid_input)

# Check status
status = client.eid.status()
print(f"Verified: {status.verified}")
```

### Machine-to-Machine

```python
# Enroll machine (requires system key)
enrollment = client.machine.enroll()
print(f"Machine ID: {enrollment.machine_id}")
print(f"Secret: {enrollment.secret}")

# Get machine token
token_response = client.machine.token(enrollment.secret)

# Revoke machine
client.machine.revoke(enrollment.secret)
```

---

## 🛡️ Server SDK

The Server SDK provides middleware and utilities for protecting routes in FastAPI and Flask applications.

### FastAPI Integration

```python
from fastapi import FastAPI, Depends, HTTPException
from aether_identity.server import create_identity_server

app = FastAPI()

identity_server = create_identity_server(
    base_url="https://identity.skygenesisenterprise.com",
    client_id="your-client-id",
    system_key="your-system-key",
    mfa_required=["admin", "console"]  # Require MFA for these contexts
)

# Basic authentication
@app.get("/profile")
async def get_profile(
    user=Depends(identity_server.auth_middleware())
):
    return {"user": user}

# Role-based access control
@app.post("/admin/users")
async def create_user(
    user=Depends(identity_server.rbac_middleware(["admin"]))
):
    return {"message": "User created"}

# Combined protection
@app.get("/admin/dashboard")
async def admin_dashboard(
    user=Depends(identity_server.protect_route(["admin"]))
):
    return {"message": "Admin dashboard"}

# MFA required
@app.post("/sensitive-action")
async def sensitive_action(
    user=Depends(identity_server.mfa_middleware())
):
    return {"message": "Action performed"}
```

### Flask Integration

```python
from flask import Flask, g, jsonify
from aether_identity.server import create_identity_server

app = Flask(__name__)

identity_server = create_identity_server(
    base_url="https://identity.skygenesisenterprise.com",
    client_id="your-client-id"
)

# Register auth middleware
@app.before_request
def check_auth():
    # Your auth logic here using identity_server
    pass

# Protected route with decorator
@app.route("/admin")
@identity_server.protect_route(["admin"])
def admin():
    return jsonify({"message": "Admin area"})
```

### Server Configuration

```python
from aether_identity.server import create_identity_server
from aether_identity.server.config import IdentityServerHooks

# Define hooks
async def on_login(context):
    print(f"User {context.email} logged in from {context.ip}")

async def on_unauthorized(context):
    print(f"Unauthorized attempt: {context.reason}")

hooks = IdentityServerHooks(
    on_login=on_login,
    on_unauthorized_attempt=on_unauthorized
)

# Create server with custom config
identity_server = create_identity_server(
    base_url="https://identity.skygenesisenterprise.com",
    client_id="your-client-id",
    cache_ttl=600,  # 10 minutes
    mfa_required=True,
    hooks=hooks
)
```

---

## 📚 API Reference

### Client Modules

| Module           | Description               | Key Methods                                         |
| ---------------- | ------------------------- | --------------------------------------------------- |
| `client.auth`    | Authentication operations | `login()`, `register()`, `logout()`, `strengthen()` |
| `client.session` | Session management        | `current()`, `is_authenticated()`                   |
| `client.user`    | User operations           | `profile()`, `roles()`, `has_permission()`          |
| `client.token`   | Token operations          | `refresh()`, `revoke()`                             |
| `client.totp`    | TOTP/2FA operations       | `setup()`, `verify()`, `disable()`, `login()`       |
| `client.eid`     | EID verification          | `verify()`, `status()`, `revoke()`                  |
| `client.device`  | Device management         | `detect()`, `status()`                              |
| `client.machine` | Machine auth              | `enroll()`, `token()`, `revoke()`                   |

### Server SDK

| Component                | Description               |
| ------------------------ | ------------------------- |
| `auth_middleware()`      | Validates JWT tokens      |
| `rbac_middleware(roles)` | Checks user roles         |
| `protect_route(roles)`   | Combined auth + RBAC      |
| `mfa_middleware()`       | Enforces MFA verification |
| `validate_token(token)`  | Validates a token         |
| `has_role(user, roles)`  | Check user roles          |

### Exception Types

| Exception             | Status Code | Description              |
| --------------------- | ----------- | ------------------------ |
| `AuthenticationError` | 401         | Invalid credentials      |
| `AuthorizationError`  | 403         | Insufficient permissions |
| `SessionExpiredError` | 401         | Token expired            |
| `TOTPRequiredError`   | 401         | 2FA code required        |
| `NetworkError`        | -           | Network failure          |
| `ServerError`         | 5xx         | Server error             |

---

## 🔧 Configuration

### Client Configuration

```python
from aether_identity import IdentityClientConfig

config = IdentityClientConfig(
    base_url="https://identity.skygenesisenterprise.com",
    client_id="your-client-id",
    access_token="optional-existing-token",
    system_key="optional-system-key"
)

client = IdentityClient(config)
```

### Custom Storage Backend

```python
from aether_identity.core.session import SessionManager, Storage

class RedisStorage(Storage):
    def __init__(self, redis_client):
        self._redis = redis_client

    def get(self, key: str) -> Optional[str]:
        return self._redis.get(key)

    def set(self, key: str, value: str) -> None:
        self._redis.set(key, value)

    def remove(self, key: str) -> None:
        self._redis.delete(key)

# Use custom storage
storage = RedisStorage(redis_client)
session_manager = SessionManager(storage)
```

---

## 🧪 Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=aether_identity

# Run specific test file
pytest tests/test_auth.py
```

---

## 📝 Examples

See the `examples/` directory for complete working examples:

- `basic_auth.py` - Basic authentication flow
- `fastapi_server.py` - FastAPI server integration
- `flask_server.py` - Flask server integration
- `totp_setup.py` - TOTP/2FA setup and usage
- `machine_auth.py` - Machine-to-machine authentication

---

## 🤝 Contributing

We welcome contributions! Please see the [main repository](https://github.com/skygenesisenterprise/aether-identity) for contribution guidelines.

### Development Setup

```bash
# Clone repository
git clone https://github.com/skygenesisenterprise/aether-identity.git
cd aether-identity/package/python

# Install dependencies
pip install -e ".[dev]"

# Run tests
pytest

# Format code
black aether_identity/
ruff check aether_identity/

# Type check
mypy aether_identity/
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- **Documentation**: [https://docs.aether-identity.skygenesisenterprise.com](https://docs.aether-identity.skygenesisenterprise.com)
- **PyPI**: [https://pypi.org/project/aether-identity](https://pypi.org/project/aether-identity)
- **Repository**: [https://github.com/skygenesisenterprise/aether-identity](https://github.com/skygenesisenterprise/aether-identity)
- **Issues**: [https://github.com/skygenesisenterprise/aether-identity/issues](https://github.com/skygenesisenterprise/aether-identity/issues)

---

<div align="center">

**Made with ❤️ by [Sky Genesis Enterprise](https://skygenesisenterprise.com)**

</div>
