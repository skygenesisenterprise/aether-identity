package com.aetheridentity.sdk.types;

/**
 * TOTP configuration options.
 */
public class TOTPConfig {
    private String issuer;
    private Integer digits;
    private Integer period;
    
    public TOTPConfig() {}
    
    public String getIssuer() {
        return issuer;
    }
    
    public void setIssuer(String issuer) {
        this.issuer = issuer;
    }
    
    public Integer getDigits() {
        return digits;
    }
    
    public void setDigits(Integer digits) {
        this.digits = digits;
    }
    
    public Integer getPeriod() {
        return period;
    }
    
    public void setPeriod(Integer period) {
        this.period = period;
    }
}
