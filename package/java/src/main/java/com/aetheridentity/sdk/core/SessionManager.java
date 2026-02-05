package com.aetheridentity.sdk.core;

import com.aetheridentity.sdk.types.TokenResponse;

import java.util.HashMap;
import java.util.Map;

/**
 * Manages session tokens and authentication state.
 */
public class SessionManager {
    
    private static final String ACCESS_TOKEN_KEY = "aether_access_token";
    private static final String REFRESH_TOKEN_KEY = "aether_refresh_token";
    private static final String EXPIRES_AT_KEY = "aether_expires_at";
    private static final int DEFAULT_EXPIRES_IN = 3600;
    
    private final Map<String, String> storage;
    
    /**
     * Creates a new SessionManager with in-memory storage.
     */
    public SessionManager() {
        this.storage = new HashMap<>();
    }
    
    /**
     * Creates a new SessionManager with custom storage.
     *
     * @param storage The storage implementation
     */
    public SessionManager(Map<String, String> storage) {
        this.storage = storage;
    }
    
    /**
     * Sets both access and refresh tokens.
     *
     * @param tokens The token response
     */
    public void setTokens(TokenResponse tokens) {
        storage.put(ACCESS_TOKEN_KEY, tokens.getAccessToken());
        storage.put(REFRESH_TOKEN_KEY, tokens.getRefreshToken());
        long expiresAt = System.currentTimeMillis() + (tokens.getExpiresIn() * 1000L);
        storage.put(EXPIRES_AT_KEY, String.valueOf(expiresAt));
    }
    
    /**
     * Gets the access token.
     *
     * @return The access token or null if not set
     */
    public String getAccessToken() {
        return storage.get(ACCESS_TOKEN_KEY);
    }
    
    /**
     * Gets the refresh token.
     *
     * @return The refresh token or null if not set
     */
    public String getRefreshToken() {
        return storage.get(REFRESH_TOKEN_KEY);
    }
    
    /**
     * Gets the expiration timestamp.
     *
     * @return The expiration timestamp or null if not set
     */
    public Long getExpiresAt() {
        String expiresAt = storage.get(EXPIRES_AT_KEY);
        return expiresAt != null ? Long.parseLong(expiresAt) : null;
    }
    
    /**
     * Checks if the session is authenticated and not expired.
     *
     * @return true if authenticated
     */
    public boolean isAuthenticated() {
        Long expiresAt = getExpiresAt();
        if (expiresAt == null) return false;
        return System.currentTimeMillis() < expiresAt;
    }
    
    /**
     * Sets only the access token with expiration.
     *
     * @param token The access token
     * @param expiresIn The expiration time in seconds
     */
    public void setAccessToken(String token, int expiresIn) {
        storage.put(ACCESS_TOKEN_KEY, token);
        long expiresAt = System.currentTimeMillis() + (expiresIn * 1000L);
        storage.put(EXPIRES_AT_KEY, String.valueOf(expiresAt));
    }
    
    /**
     * Sets a token with default expiration (1 hour).
     *
     * @param token The access token
     */
    public void setToken(String token) {
        setAccessToken(token, DEFAULT_EXPIRES_IN);
    }
    
    /**
     * Clears all session data.
     */
    public void clear() {
        storage.remove(ACCESS_TOKEN_KEY);
        storage.remove(REFRESH_TOKEN_KEY);
        storage.remove(EXPIRES_AT_KEY);
    }
}
