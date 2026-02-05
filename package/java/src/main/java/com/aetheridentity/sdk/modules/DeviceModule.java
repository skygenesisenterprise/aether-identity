package com.aetheridentity.sdk.modules;

import com.aetheridentity.sdk.core.SessionManager;
import com.aetheridentity.sdk.core.Transport;
import com.aetheridentity.sdk.errors.SessionExpiredError;
import com.aetheridentity.sdk.types.DeviceInfo;
import com.aetheridentity.sdk.types.DeviceStatusResponse;

import java.util.List;

/**
 * Device management module.
 */
public class DeviceModule {
    
    private final Transport transport;
    private final SessionManager session;
    
    /**
     * Creates a new DeviceModule.
     *
     * @param transport The transport instance
     * @param session The session manager
     */
    public DeviceModule(Transport transport, SessionManager session) {
        this.transport = transport;
        this.session = session;
    }
    
    /**
     * Detects all devices.
     *
     * @return The list of devices
     */
    public List<DeviceInfo> detect() {
        String accessToken = session.getAccessToken();
        
        if (accessToken == null) {
            throw new SessionExpiredError();
        }
        
        return transport.get("/api/v1/devices", accessToken, List.class);
    }
    
    /**
     * Gets the device status.
     *
     * @return The device status
     */
    public DeviceStatusResponse status() {
        String accessToken = session.getAccessToken();
        
        if (accessToken == null) {
            throw new SessionExpiredError();
        }
        
        return transport.get("/api/v1/devices/status", accessToken, DeviceStatusResponse.class);
    }
}
