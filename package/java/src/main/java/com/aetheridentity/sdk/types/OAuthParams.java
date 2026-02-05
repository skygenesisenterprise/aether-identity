package com.aetheridentity.sdk.types;

/**
 * OAuth parameters for authentication flows.
 */
public class OAuthParams {
    private String clientId;
    private String redirectUri;
    private String responseType;
    private String scope;
    private String state;
    
    public OAuthParams() {}
    
    public String getClientId() {
        return clientId;
    }
    
    public void setClientId(String clientId) {
        this.clientId = clientId;
    }
    
    public String getRedirectUri() {
        return redirectUri;
    }
    
    public void setRedirectUri(String redirectUri) {
        this.redirectUri = redirectUri;
    }
    
    public String getResponseType() {
        return responseType;
    }
    
    public void setResponseType(String responseType) {
        this.responseType = responseType;
    }
    
    public String getScope() {
        return scope;
    }
    
    public void setScope(String scope) {
        this.scope = scope;
    }
    
    public String getState() {
        return state;
    }
    
    public void setState(String state) {
        this.state = state;
    }
    
    public boolean isEmpty() {
        return clientId == null && redirectUri == null && responseType == null 
            && scope == null && state == null;
    }
    
    public String toQueryString() {
        StringBuilder sb = new StringBuilder();
        if (clientId != null) sb.append("client_id=").append(clientId).append("&");
        if (redirectUri != null) sb.append("redirect_uri=").append(redirectUri).append("&");
        if (responseType != null) sb.append("response_type=").append(responseType).append("&");
        if (scope != null) sb.append("scope=").append(scope).append("&");
        if (state != null) sb.append("state=").append(state).append("&");
        
        String result = sb.toString();
        if (result.endsWith("&")) {
            result = result.substring(0, result.length() - 1);
        }
        return result;
    }
}
