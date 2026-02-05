package com.aetheridentity.sdk.errors;

/**
 * Base exception for all identity-related errors.
 */
public class IdentityError extends RuntimeException {
    
    private final ErrorCode code;
    private final String requestId;
    
    /**
     * Creates a new IdentityError.
     *
     * @param message The error message
     * @param code The error code
     */
    public IdentityError(String message, ErrorCode code) {
        this(message, code, null);
    }
    
    /**
     * Creates a new IdentityError.
     *
     * @param message The error message
     * @param code The error code
     * @param requestId The request ID
     */
    public IdentityError(String message, ErrorCode code, String requestId) {
        super(message);
        this.code = code;
        this.requestId = requestId;
    }
    
    public ErrorCode getCode() {
        return code;
    }
    
    public String getRequestId() {
        return requestId;
    }
}
