package com.aetheridentity.sdk.types;

/**
 * Registration response.
 */
public class RegisterResponse {
    private boolean success;
    private String message;
    private String userId;
    
    public RegisterResponse() {}
    
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
}
