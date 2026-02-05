package com.aetheridentity.sdk.errors;

/**
 * Exception thrown when a network error occurs.
 */
public class NetworkError extends IdentityError {
    
    /**
     * Creates a new NetworkError.
     */
    public NetworkError() {
        this("Network error occurred", null);
    }
    
    /**
     * Creates a new NetworkError.
     *
     * @param message The error message
     */
    public NetworkError(String message) {
        this(message, null);
    }
    
    /**
     * Creates a new NetworkError.
     *
     * @param message The error message
     * @param requestId The request ID
     */
    public NetworkError(String message, String requestId) {
        super(message, ErrorCode.NETWORK_ERROR, requestId);
    }
}
