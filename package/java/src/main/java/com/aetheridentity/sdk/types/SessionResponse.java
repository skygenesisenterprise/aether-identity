package com.aetheridentity.sdk.types;

/**
 * Session response.
 */
public class SessionResponse {
    private boolean isAuthenticated;
    private UserProfile user;
    private Long expiresAt;
    
    public SessionResponse() {}
    
    public boolean isAuthenticated() {
        return isAuthenticated;
    }
    
    public void setAuthenticated(boolean authenticated) {
        isAuthenticated = authenticated;
    }
    
    public UserProfile getUser() {
        return user;
    }
    
    public void setUser(UserProfile user) {
        this.user = user;
    }
    
    public Long getExpiresAt() {
        return expiresAt;
    }
    
    public void setExpiresAt(Long expiresAt) {
        this.expiresAt = expiresAt;
    }
}
