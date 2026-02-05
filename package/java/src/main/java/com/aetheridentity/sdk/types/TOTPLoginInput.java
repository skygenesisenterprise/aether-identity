package com.aetheridentity.sdk.types;

/**
 * TOTP login input.
 */
public class TOTPLoginInput {
    private String email;
    private String password;
    private String totpCode;
    
    public TOTPLoginInput() {}
    
    public TOTPLoginInput(String email, String password, String totpCode) {
        this.email = email;
        this.password = password;
        this.totpCode = totpCode;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getTotpCode() {
        return totpCode;
    }
    
    public void setTotpCode(String totpCode) {
        this.totpCode = totpCode;
    }
}
