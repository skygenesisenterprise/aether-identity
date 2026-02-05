package com.aetheridentity.sdk.modules;

import com.aetheridentity.sdk.core.SessionManager;
import com.aetheridentity.sdk.core.Transport;
import com.aetheridentity.sdk.errors.SessionExpiredError;
import com.aetheridentity.sdk.types.TokenResponse;

/**
 * Token management module.
 */
public class TokenModule {
    
    private final Transport transport;
    private final SessionManager session;
    
    /**
     * Creates a new TokenModule.
     *
     * @param transport The transport instance
     * @param session The session manager
     */
    public TokenModule(Transport transport, SessionManager session) {
        this.transport = transport;
        this.session = session;
    }
    
    /**
     * Refreshes the access token.
     */
    public void refresh() {
        String refreshToken = session.getRefreshToken();
        
        if (refreshToken == null) {
            throw new SessionExpiredError();
        }
        
        TokenResponse response = transport.post(
            "/api/v1/auth/refresh",
            new RefreshRequest(refreshToken),
            null,
            false,
            TokenResponse.class
        );
        
        session.setAccessToken(response.getAccessToken(), response.getExpiresIn());
    }
    
    /**
     * Revokes the current token.
     */
    public void revoke() {
        String accessToken = session.getAccessToken();
        
        if (accessToken == null) {
            return;
        }
        
        try {
            transport.post(
                "/api/v1/auth/token/revoke",
                null,
                accessToken,
                false,
                Void.class
            );
        } catch (Exception e) {
            // Ignore revoke errors
        }
        
        session.clear();
    }
    
    private static class RefreshRequest {
        private final String refreshToken;
        
        RefreshRequest(String refreshToken) {
            this.refreshToken = refreshToken;
        }
        
        public String getRefreshToken() {
            return refreshToken;
        }
    }
}
