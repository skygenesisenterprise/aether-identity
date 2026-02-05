package com.aetheridentity.sdk.errors;

/**
 * Exception thrown when authorization fails.
 */
public class AuthorizationError extends IdentityError {
    
    /**
     * Creates a new AuthorizationError.
     */
    public AuthorizationError() {
        this("Authorization failed", null);
    }
    
    /**
     * Creates a new AuthorizationError.
     *
     * @param message The error message
     */
    public AuthorizationError(String message) {
        this(message, null);
    }
    
    /**
     * Creates a new AuthorizationError.
     *
     * @param message The error message
     * @param requestId The request ID
     */
    public AuthorizationError(String message, String requestId) {
        super(message, ErrorCode.AUTHORIZATION_FAILED, requestId);
    }
}
