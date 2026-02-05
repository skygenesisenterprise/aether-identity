package com.aetheridentity.sdk.types;

/**
 * TOTP verification input.
 */
public class TOTPVerifyInput {
    private String code;
    private String secret;
    
    public TOTPVerifyInput() {}
    
    public TOTPVerifyInput(String code, String secret) {
        this.code = code;
        this.secret = secret;
    }
    
    public String getCode() {
        return code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }
    
    public String getSecret() {
        return secret;
    }
    
    public void setSecret(String secret) {
        this.secret = secret;
    }
}
