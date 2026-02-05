package com.aetheridentity.sdk.modules;

import com.aetheridentity.sdk.core.SessionManager;
import com.aetheridentity.sdk.core.Transport;
import com.aetheridentity.sdk.errors.SessionExpiredError;
import com.aetheridentity.sdk.types.*;

/**
 * TOTP (Time-based One-Time Password) module.
 */
public class TOTPModule {
    
    private final Transport transport;
    private final SessionManager session;
    private final TOTPConfig config;
    
    /**
     * Creates a new TOTPModule.
     *
     * @param transport The transport instance
     * @param session The session manager
     * @param config The TOTP configuration
     */
    public TOTPModule(Transport transport, SessionManager session, TOTPConfig config) {
        this.transport = transport;
        this.session = session;
        this.config = config;
    }
    
    /**
     * Sets up TOTP for the current user.
     *
     * @return The setup response with secret and QR code
     */
    public TOTPSetupResponse setup() {
        String accessToken = session.getAccessToken();
        
        if (accessToken == null) {
            throw new SessionExpiredError();
        }
        
        return transport.post(
            "/api/v1/auth/totp/setup",
            null,
            accessToken,
            false,
            TOTPSetupResponse.class
        );
    }
    
    /**
     * Verifies a TOTP code.
     *
     * @param input The verification input
     */
    public void verify(TOTPVerifyInput input) {
        String accessToken = session.getAccessToken();
        
        if (accessToken == null) {
            throw new SessionExpiredError();
        }
        
        transport.post(
            "/api/v1/auth/totp/verify",
            input,
            accessToken,
            false,
            Void.class
        );
    }
    
    /**
     * Disables TOTP for the current user.
     */
    public void disable() {
        String accessToken = session.getAccessToken();
        
        if (accessToken == null) {
            throw new SessionExpiredError();
        }
        
        transport.post(
            "/api/v1/auth/totp/disable",
            null,
            accessToken,
            false,
            Void.class
        );
    }
    
    /**
     * Gets the TOTP status.
     *
     * @return The TOTP status
     */
    public TOTPStatusResponse getStatus() {
        String accessToken = session.getAccessToken();
        
        if (accessToken == null) {
            throw new SessionExpiredError();
        }
        
        return transport.get("/api/v1/auth/totp/status", accessToken, TOTPStatusResponse.class);
    }
    
    /**
     * Logs in with TOTP.
     *
     * @param input The TOTP login input
     * @return The token response
     */
    public TokenResponse login(TOTPLoginInput input) {
        return login(input, null);
    }
    
    /**
     * Logs in with TOTP and OAuth parameters.
     *
     * @param input The TOTP login input
     * @param oauthParams The OAuth parameters
     * @return The token response
     */
    public TokenResponse login(TOTPLoginInput input, OAuthParams oauthParams) {
        String endpoint = buildLoginEndpoint(oauthParams);
        
        TokenResponse response = transport.post(
            endpoint,
            input,
            null,
            false,
            TokenResponse.class
        );
        
        session.setTokens(response);
        return response;
    }
    
    private String buildLoginEndpoint(OAuthParams oauthParams) {
        if (oauthParams == null || oauthParams.isEmpty()) {
            return "/api/v1/auth/totp/login";
        }
        
        return "/api/v1/auth/totp/login?" + oauthParams.toQueryString();
    }
}
