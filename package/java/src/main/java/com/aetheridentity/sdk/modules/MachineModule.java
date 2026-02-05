package com.aetheridentity.sdk.modules;

import com.aetheridentity.sdk.core.Transport;
import com.aetheridentity.sdk.types.MachineEnrollmentResponse;
import com.aetheridentity.sdk.types.MachineTokenResponse;

/**
 * Machine-to-machine authentication module.
 */
public class MachineModule {
    
    private final Transport transport;
    private final String clientId;
    
    /**
     * Creates a new MachineModule.
     *
     * @param transport The transport instance
     * @param clientId The client ID
     */
    public MachineModule(Transport transport, String clientId) {
        this.transport = transport;
        this.clientId = clientId;
    }
    
    /**
     * Enrolls a new machine.
     *
     * @return The enrollment response
     */
    public MachineEnrollmentResponse enroll() {
        return transport.post(
            "/api/v1/machine/enroll",
            new EnrollRequest(clientId),
            null,
            false,
            MachineEnrollmentResponse.class
        );
    }
    
    /**
     * Gets a machine token.
     *
     * @param secret The machine secret
     * @return The token response
     */
    public MachineTokenResponse token(String secret) {
        return transport.post(
            "/oauth2/token",
            new TokenRequest(clientId, secret),
            null,
            false,
            MachineTokenResponse.class
        );
    }
    
    /**
     * Revokes a machine token.
     *
     * @param secret The machine secret
     */
    public void revoke(String secret) {
        transport.post(
            "/oauth2/revoke",
            new RevokeRequest(clientId, secret),
            null,
            false,
            Void.class
        );
    }
    
    private static class EnrollRequest {
        private final String clientId;
        
        EnrollRequest(String clientId) {
            this.clientId = clientId;
        }
        
        public String getClientId() {
            return clientId;
        }
    }
    
    private static class TokenRequest {
        private final String grantType = "client_credentials";
        private final String clientId;
        private final String clientSecret;
        
        TokenRequest(String clientId, String clientSecret) {
            this.clientId = clientId;
            this.clientSecret = clientSecret;
        }
        
        public String getGrantType() {
            return grantType;
        }
        
        public String getClientId() {
            return clientId;
        }
        
        public String getClientSecret() {
            return clientSecret;
        }
    }
    
    private static class RevokeRequest {
        private final String clientId;
        private final String clientSecret;
        
        RevokeRequest(String clientId, String clientSecret) {
            this.clientId = clientId;
            this.clientSecret = clientSecret;
        }
        
        public String getClientId() {
            return clientId;
        }
        
        public String getClientSecret() {
            return clientSecret;
        }
    }
}
