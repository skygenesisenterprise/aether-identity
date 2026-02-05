package com.aetheridentity.sdk.types;

/**
 * Machine token response.
 */
public class MachineTokenResponse {
    private String accessToken;
    private int expiresIn;
    private String tokenType;
    
    public MachineTokenResponse() {}
    
    public String getAccessToken() {
        return accessToken;
    }
    
    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }
    
    public int getExpiresIn() {
        return expiresIn;
    }
    
    public void setExpiresIn(int expiresIn) {
        this.expiresIn = expiresIn;
    }
    
    public String getTokenType() {
        return tokenType;
    }
    
    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }
}
