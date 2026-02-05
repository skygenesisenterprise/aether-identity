package com.aetheridentity.sdk.modules;

import com.aetheridentity.sdk.core.SessionManager;
import com.aetheridentity.sdk.core.Transport;
import com.aetheridentity.sdk.errors.SessionExpiredError;
import com.aetheridentity.sdk.types.EIDStatusResponse;
import com.aetheridentity.sdk.types.EIDVerifyInput;

/**
 * Electronic ID (EID) module.
 */
public class EIDModule {
    
    private final Transport transport;
    private final SessionManager session;
    
    /**
     * Creates a new EIDModule.
     *
     * @param transport The transport instance
     * @param session The session manager
     */
    public EIDModule(Transport transport, SessionManager session) {
        this.transport = transport;
        this.session = session;
    }
    
    /**
     * Verifies an EID document.
     *
     * @param input The verification input
     */
    public void verify(EIDVerifyInput input) {
        String accessToken = session.getAccessToken();
        
        if (accessToken == null) {
            throw new SessionExpiredError();
        }
        
        transport.post(
            "/api/v1/eid/verify",
            input,
            accessToken,
            false,
            Void.class
        );
    }
    
    /**
     * Gets the EID verification status.
     *
     * @return The EID status
     */
    public EIDStatusResponse status() {
        String accessToken = session.getAccessToken();
        
        if (accessToken == null) {
            throw new SessionExpiredError();
        }
        
        return transport.get("/api/v1/eid/status", accessToken, EIDStatusResponse.class);
    }
    
    /**
     * Revokes the EID verification.
     */
    public void revoke() {
        String accessToken = session.getAccessToken();
        
        if (accessToken == null) {
            throw new SessionExpiredError();
        }
        
        transport.post(
            "/api/v1/eid/revoke",
            null,
            accessToken,
            false,
            Void.class
        );
    }
}
