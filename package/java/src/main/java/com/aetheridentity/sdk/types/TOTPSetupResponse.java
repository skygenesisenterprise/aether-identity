package com.aetheridentity.sdk.types;

/**
 * Response from TOTP setup.
 */
public class TOTPSetupResponse {
    private String secret;
    private String qrCode;
    private String url;
    
    public TOTPSetupResponse() {}
    
    public String getSecret() {
        return secret;
    }
    
    public void setSecret(String secret) {
        this.secret = secret;
    }
    
    public String getQrCode() {
        return qrCode;
    }
    
    public void setQrCode(String qrCode) {
        this.qrCode = qrCode;
    }
    
    public String getUrl() {
        return url;
    }
    
    public void setUrl(String url) {
        this.url = url;
    }
}
