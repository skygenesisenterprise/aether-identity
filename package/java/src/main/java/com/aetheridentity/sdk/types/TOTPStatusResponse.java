package com.aetheridentity.sdk.types;

/**
 * TOTP status response.
 */
public class TOTPStatusResponse {
    private boolean enabled;
    
    public TOTPStatusResponse() {}
    
    public boolean isEnabled() {
        return enabled;
    }
    
    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
}
