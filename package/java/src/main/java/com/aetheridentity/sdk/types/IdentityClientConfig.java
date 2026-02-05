package com.aetheridentity.sdk.types;

import java.util.function.Function;

/**
 * Configuration for the IdentityClient.
 */
public class IdentityClientConfig {
    private String baseUrl;
    private String clientId;
    private String accessToken;
    private Function<TransportRequest, TransportResponse> fetcher;
    private String systemKey;
    private TOTPConfig totpConfig;
    
    public IdentityClientConfig() {}
    
    public IdentityClientConfig(String baseUrl, String clientId) {
        this.baseUrl = baseUrl;
        this.clientId = clientId;
    }
    
    public String getBaseUrl() {
        return baseUrl;
    }
    
    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
    }
    
    public String getClientId() {
        return clientId;
    }
    
    public void setClientId(String clientId) {
        this.clientId = clientId;
    }
    
    public String getAccessToken() {
        return accessToken;
    }
    
    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }
    
    public Function<TransportRequest, TransportResponse> getFetcher() {
        return fetcher;
    }
    
    public void setFetcher(Function<TransportRequest, TransportResponse> fetcher) {
        this.fetcher = fetcher;
    }
    
    public String getSystemKey() {
        return systemKey;
    }
    
    public void setSystemKey(String systemKey) {
        this.systemKey = systemKey;
    }
    
    public TOTPConfig getTotpConfig() {
        return totpConfig;
    }
    
    public void setTotpConfig(TOTPConfig totpConfig) {
        this.totpConfig = totpConfig;
    }
    
    public static Builder builder() {
        return new Builder();
    }
    
    public static class Builder {
        private final IdentityClientConfig config = new IdentityClientConfig();
        
        public Builder baseUrl(String baseUrl) {
            config.setBaseUrl(baseUrl);
            return this;
        }
        
        public Builder clientId(String clientId) {
            config.setClientId(clientId);
            return this;
        }
        
        public Builder accessToken(String accessToken) {
            config.setAccessToken(accessToken);
            return this;
        }
        
        public Builder fetcher(Function<TransportRequest, TransportResponse> fetcher) {
            config.setFetcher(fetcher);
            return this;
        }
        
        public Builder systemKey(String systemKey) {
            config.setSystemKey(systemKey);
            return this;
        }
        
        public Builder totpConfig(TOTPConfig totpConfig) {
            config.setTotpConfig(totpConfig);
            return this;
        }
        
        public IdentityClientConfig build() {
            return config;
        }
    }
}
