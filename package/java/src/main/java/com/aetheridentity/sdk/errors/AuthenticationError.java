package com.aetheridentity.sdk.errors;

/**
 * Exception thrown when authentication fails.
 */
public class AuthenticationError extends IdentityError {
    
    /**
     * Creates a new AuthenticationError.
     */
    public AuthenticationError() {
        this("Authentication failed", null);
    }
    
    /**
     * Creates a new AuthenticationError.
     *
     * @param message The error message
     */
    public AuthenticationError(String message) {
        this(message, null);
    }
    
    /**
     * Creates a new AuthenticationError.
     *
     * @param message The error message
     * @param requestId The request ID
     */
    public AuthenticationError(String message, String requestId) {
        super(message, ErrorCode.AUTHENTICATION_FAILED, requestId);
    }
}
