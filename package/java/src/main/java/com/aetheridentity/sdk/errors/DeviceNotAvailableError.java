package com.aetheridentity.sdk.errors;

/**
 * Exception thrown when the device is not available.
 */
public class DeviceNotAvailableError extends IdentityError {
    
    /**
     * Creates a new DeviceNotAvailableError.
     */
    public DeviceNotAvailableError() {
        this("Device not available", null);
    }
    
    /**
     * Creates a new DeviceNotAvailableError.
     *
     * @param message The error message
     */
    public DeviceNotAvailableError(String message) {
        this(message, null);
    }
    
    /**
     * Creates a new DeviceNotAvailableError.
     *
     * @param message The error message
     * @param requestId The request ID
     */
    public DeviceNotAvailableError(String message, String requestId) {
        super(message, ErrorCode.DEVICE_NOT_AVAILABLE, requestId);
    }
}
