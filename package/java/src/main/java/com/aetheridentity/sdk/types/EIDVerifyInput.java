package com.aetheridentity.sdk.types;

/**
 * EID verification input.
 */
public class EIDVerifyInput {
    private String documentType;
    private String documentNumber;
    private String issuanceDate;
    private String expirationDate;
    
    public EIDVerifyInput() {}
    
    public EIDVerifyInput(String documentType, String documentNumber, String issuanceDate, String expirationDate) {
        this.documentType = documentType;
        this.documentNumber = documentNumber;
        this.issuanceDate = issuanceDate;
        this.expirationDate = expirationDate;
    }
    
    public String getDocumentType() {
        return documentType;
    }
    
    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }
    
    public String getDocumentNumber() {
        return documentNumber;
    }
    
    public void setDocumentNumber(String documentNumber) {
        this.documentNumber = documentNumber;
    }
    
    public String getIssuanceDate() {
        return issuanceDate;
    }
    
    public void setIssuanceDate(String issuanceDate) {
        this.issuanceDate = issuanceDate;
    }
    
    public String getExpirationDate() {
        return expirationDate;
    }
    
    public void setExpirationDate(String expirationDate) {
        this.expirationDate = expirationDate;
    }
}
