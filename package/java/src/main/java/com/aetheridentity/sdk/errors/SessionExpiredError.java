package com.aetheridentity.sdk.errors;

/**
 * Exception thrown when the session has expired.
 */
public class SessionExpiredError extends IdentityError {
    
    /**
     * Creates a new SessionExpiredError.
     */
    public SessionExpiredError() {
        this("Session expired", null);
    }
    
    /**
     * Creates a new SessionExpiredError.
     *
     * @param message The error message
     */
    public SessionExpiredError(String message) {
        this(message, null);
    }
    
    /**
     * Creates a new SessionExpiredError.
     *
     * @param message The error message
     * @param requestId The request ID
     */
    public SessionExpiredError(String message, String requestId) {
        super(message, ErrorCode.SESSION_EXPIRED, requestId);
    }
}
