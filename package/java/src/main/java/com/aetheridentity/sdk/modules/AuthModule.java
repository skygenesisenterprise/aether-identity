package com.aetheridentity.sdk.modules;

import com.aetheridentity.sdk.core.SessionManager;
import com.aetheridentity.sdk.core.Transport;
import com.aetheridentity.sdk.errors.SessionExpiredError;
import com.aetheridentity.sdk.types.*;

/**
 * Authentication module for login, logout, and registration.
 */
public class AuthModule {
    
    private final Transport transport;
    private final SessionManager session;
    
    /**
     * Creates a new AuthModule.
     *
     * @param transport The transport instance
     * @param session The session manager
     */
    public AuthModule(Transport transport, SessionManager session) {
        this.transport = transport;
        this.session = session;
    }
    
    /**
     * Logs in a user.
     *
     * @param input The authentication input
     */
    public void login(AuthInput input) {
        login(input, null);
    }
    
    /**
     * Logs in a user with OAuth parameters.
     *
     * @param input The authentication input
     * @param oauthParams The OAuth parameters
     */
    public void login(AuthInput input, OAuthParams oauthParams) {
        String endpoint = buildLoginEndpoint(oauthParams);
        
        TokenResponse response = transport.post(
            endpoint,
            input,
            null,
            false,
            TokenResponse.class
        );
        
        session.setTokens(response);
    }
    
    /**
     * Registers a new user.
     *
     * @param input The registration input
     * @return The registration response
     */
    public RegisterResponse register(RegisterInput input) {
        return transport.post(
            "/api/v1/auth/register",
            input,
            null,
            true,
            RegisterResponse.class
        );
    }
    
    /**
     * Logs out the current user.
     */
    public void logout() {
        String accessToken = session.getAccessToken();
        
        if (accessToken != null) {
            try {
                transport.post(
                    "/api/v1/auth/logout",
                    null,
                    accessToken,
                    false,
                    Void.class
                );
            } catch (Exception e) {
                // Ignore logout errors
            }
        }
        
        session.clear();
    }
    
    /**
     * Strengthens the current session with additional authentication.
     *
     * @param input The strengthen input
     */
    public void strengthen(StrengthenInput input) {
        String accessToken = session.getAccessToken();
        
        if (accessToken == null) {
            throw new SessionExpiredError();
        }
        
        transport.post(
            "/api/v1/auth/strengthen",
            input,
            accessToken,
            false,
            Void.class
        );
    }
    
    private String buildLoginEndpoint(OAuthParams oauthParams) {
        if (oauthParams == null || oauthParams.isEmpty()) {
            return "/api/v1/auth/login";
        }
        
        return "/api/v1/auth/login?" + oauthParams.toQueryString();
    }
}
