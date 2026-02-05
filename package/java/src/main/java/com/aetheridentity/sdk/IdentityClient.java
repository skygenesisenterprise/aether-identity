package com.aetheridentity.sdk;

import com.aetheridentity.sdk.core.SessionManager;
import com.aetheridentity.sdk.core.Transport;
import com.aetheridentity.sdk.errors.*;
import com.aetheridentity.sdk.modules.*;
import com.aetheridentity.sdk.types.*;

import java.util.function.Function;

/**
 * Main client for Aether Identity SDK.
 * Provides access to all authentication and identity management features.
 */
public class IdentityClient {
    
    private final AuthModule auth;
    private final SessionModule session;
    private final UserModule user;
    private final TokenModule token;
    private final EIDModule eid;
    private final MachineModule machine;
    private final DeviceModule device;
    private final TOTPModule totp;
    
    private final Transport transport;
    private final SessionManager sessionManager;
    
    /**
     * Creates a new IdentityClient instance.
     *
     * @param config The client configuration
     */
    public IdentityClient(IdentityClientConfig config) {
        Function<TransportRequest, TransportResponse> fetcher = 
            config.getFetcher() != null ? config.getFetcher() : new HttpTransportFetcher();
        
        this.transport = new Transport(
            config.getBaseUrl(),
            fetcher,
            config.getClientId(),
            config.getSystemKey()
        );
        
        this.sessionManager = new SessionManager();
        
        if (config.getAccessToken() != null) {
            this.sessionManager.setToken(config.getAccessToken());
        }
        
        this.auth = new AuthModule(transport, sessionManager);
        this.session = new SessionModule(transport, sessionManager);
        this.user = new UserModule(transport, sessionManager);
        this.token = new TokenModule(transport, sessionManager);
        this.eid = new EIDModule(transport, sessionManager);
        this.machine = new MachineModule(transport, config.getClientId());
        this.device = new DeviceModule(transport, sessionManager);
        this.totp = new TOTPModule(transport, sessionManager, config.getTotpConfig());
    }
    
    public AuthModule getAuth() {
        return auth;
    }
    
    public SessionModule getSession() {
        return session;
    }
    
    public UserModule getUser() {
        return user;
    }
    
    public TokenModule getToken() {
        return token;
    }
    
    public EIDModule getEid() {
        return eid;
    }
    
    public MachineModule getMachine() {
        return machine;
    }
    
    public DeviceModule getDevice() {
        return device;
    }
    
    public TOTPModule getTotp() {
        return totp;
    }
    
    public Transport getTransport() {
        return transport;
    }
    
    public SessionManager getSessionManager() {
        return sessionManager;
    }
    
    /**
     * Factory method to create a new IdentityClient.
     *
     * @param config The client configuration
     * @return A new IdentityClient instance
     */
    public static IdentityClient create(IdentityClientConfig config) {
        return new IdentityClient(config);
    }
}
