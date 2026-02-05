package com.aetheridentity.sdk.types;

/**
 * EID status response.
 */
public class EIDStatusResponse {
    private boolean verified;
    private String documentType;
    private Long verifiedAt;
    private Long expiresAt;
    
    public EIDStatusResponse() {}
    
    public boolean isVerified() {
        return verified;
    }
    
    public void setVerified(boolean verified) {
        this.verified = verified;
    }
    
    public String getDocumentType() {
        return documentType;
    }
    
    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }
    
    public Long getVerifiedAt() {
        return verifiedAt;
    }
    
    public void setVerifiedAt(Long verifiedAt) {
        this.verifiedAt = verifiedAt;
    }
    
    public Long getExpiresAt() {
        return expiresAt;
    }
    
    public void setExpiresAt(Long expiresAt) {
        this.expiresAt = expiresAt;
    }
}
