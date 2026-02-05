package com.aetheridentity.sdk.errors;

/**
 * Exception thrown when a server error occurs.
 */
public class ServerError extends IdentityError {
    
    /**
     * Creates a new ServerError.
     */
    public ServerError() {
        this("Server error occurred", null);
    }
    
    /**
     * Creates a new ServerError.
     *
     * @param message The error message
     */
    public ServerError(String message) {
        this(message, null);
    }
    
    /**
     * Creates a new ServerError.
     *
     * @param message The error message
     * @param requestId The request ID
     */
    public ServerError(String message, String requestId) {
        super(message, ErrorCode.SERVER_ERROR, requestId);
    }
}
