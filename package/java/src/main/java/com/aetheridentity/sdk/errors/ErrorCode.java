package com.aetheridentity.sdk.errors;

/**
 * Error codes for identity-related errors.
 */
public enum ErrorCode {
    AUTHENTICATION_FAILED,
    AUTHORIZATION_FAILED,
    SESSION_EXPIRED,
    TOTP_REQUIRED,
    DEVICE_NOT_AVAILABLE,
    INVALID_INPUT,
    NETWORK_ERROR,
    SERVER_ERROR
}
