package com.aetheridentity.sdk.types;

/**
 * Machine enrollment response.
 */
public class MachineEnrollmentResponse {
    private String machineId;
    private String clientId;
    private String secret;
    private String accessToken;
    
    public MachineEnrollmentResponse() {}
    
    public String getMachineId() {
        return machineId;
    }
    
    public void setMachineId(String machineId) {
        this.machineId = machineId;
    }
    
    public String getClientId() {
        return clientId;
    }
    
    public void setClientId(String clientId) {
        this.clientId = clientId;
    }
    
    public String getSecret() {
        return secret;
    }
    
    public void setSecret(String secret) {
        this.secret = secret;
    }
    
    public String getAccessToken() {
        return accessToken;
    }
    
    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }
}
