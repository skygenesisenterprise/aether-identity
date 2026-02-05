package com.aetheridentity.sdk.modules;

import com.aetheridentity.sdk.core.SessionManager;
import com.aetheridentity.sdk.core.Transport;
import com.aetheridentity.sdk.types.SessionResponse;
import com.aetheridentity.sdk.types.UserProfile;

/**
 * Session management module.
 */
public class SessionModule {
    
    private final Transport transport;
    private final SessionManager session;
    
    /**
     * Creates a new SessionModule.
     *
     * @param transport The transport instance
     * @param session The session manager
     */
    public SessionModule(Transport transport, SessionManager session) {
        this.transport = transport;
        this.session = session;
    }
    
    /**
     * Gets the current session information.
     *
     * @return The session response
     */
    public SessionResponse current() {
        String accessToken = session.getAccessToken();
        
        if (accessToken == null || !session.isAuthenticated()) {
            SessionResponse response = new SessionResponse();
            response.setAuthenticated(false);
            return response;
        }
        
        UserProfile user = transport.get("/api/v1/userinfo", accessToken, UserProfile.class);
        
        SessionResponse response = new SessionResponse();
        response.setAuthenticated(true);
        response.setUser(user);
        response.setExpiresAt(session.getExpiresAt());
        
        return response;
    }
    
    /**
     * Checks if the user is authenticated.
     *
     * @return true if authenticated
     */
    public boolean isAuthenticated() {
        return session.isAuthenticated();
    }
}
