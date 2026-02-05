package com.aetheridentity.sdk.types;

/**
 * Device status response.
 */
public class DeviceStatusResponse {
    private boolean available;
    private DeviceInfo device;
    private Long lastSync;
    
    public DeviceStatusResponse() {}
    
    public boolean isAvailable() {
        return available;
    }
    
    public void setAvailable(boolean available) {
        this.available = available;
    }
    
    public DeviceInfo getDevice() {
        return device;
    }
    
    public void setDevice(DeviceInfo device) {
        this.device = device;
    }
    
    public Long getLastSync() {
        return lastSync;
    }
    
    public void setLastSync(Long lastSync) {
        this.lastSync = lastSync;
    }
}
