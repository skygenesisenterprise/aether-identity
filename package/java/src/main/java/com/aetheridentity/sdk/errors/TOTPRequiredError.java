package com.aetheridentity.sdk.errors;

/**
 * Exception thrown when TOTP verification is required.
 */
public class TOTPRequiredError extends IdentityError {
    
    /**
     * Creates a new TOTPRequiredError.
     */
    public TOTPRequiredError() {
        this("TOTP verification required", null);
    }
    
    /**
     * Creates a new TOTPRequiredError.
     *
     * @param message The error message
     */
    public TOTPRequiredError(String message) {
        this(message, null);
    }
    
    /**
     * Creates a new TOTPRequiredError.
     *
     * @param message The error message
     * @param requestId The request ID
     */
    public TOTPRequiredError(String message, String requestId) {
        super(message, ErrorCode.TOTP_REQUIRED, requestId);
    }
}
