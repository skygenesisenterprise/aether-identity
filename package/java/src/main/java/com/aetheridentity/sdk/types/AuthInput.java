package com.aetheridentity.sdk.types;

/**
 * Authentication input.
 */
public class AuthInput {
    private String email;
    private String password;
    private String totpCode;
    
    public AuthInput() {}
    
    public AuthInput(String email, String password) {
        this.email = email;
        this.password = password;
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
