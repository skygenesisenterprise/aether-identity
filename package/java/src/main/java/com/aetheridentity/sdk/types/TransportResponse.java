package com.aetheridentity.sdk.types;

/**
 * Represents an HTTP response from transport.
 */
public class TransportResponse {
    private int statusCode;
    private String body;
    private boolean ok;
    
    public TransportResponse() {}
    
    public TransportResponse(int statusCode, String body) {
        this.statusCode = statusCode;
        this.body = body;
        this.ok = statusCode >= 200 && statusCode < 300;
    }
    
    public int getStatusCode() {
        return statusCode;
    }
    
    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
        this.ok = statusCode >= 200 && statusCode < 300;
    }
    
    public String getBody() {
        return body;
    }
    
    public void setBody(String body) {
        this.body = body;
    }
    
    public boolean isOk() {
        return ok;
    }
    
    public void setOk(boolean ok) {
        this.ok = ok;
    }
}
