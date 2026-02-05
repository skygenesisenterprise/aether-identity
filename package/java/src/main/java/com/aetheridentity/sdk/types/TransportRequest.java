package com.aetheridentity.sdk.types;

import java.util.Map;

/**
 * Represents an HTTP request for transport.
 */
public class TransportRequest {
    private String url;
    private String method;
    private Map<String, String> headers;
    private String body;
    
    public TransportRequest() {}
    
    public TransportRequest(String url, String method, Map<String, String> headers, String body) {
        this.url = url;
        this.method = method;
        this.headers = headers;
        this.body = body;
    }
    
    public String getUrl() {
        return url;
    }
    
    public void setUrl(String url) {
        this.url = url;
    }
    
    public String getMethod() {
        return method;
    }
    
    public void setMethod(String method) {
        this.method = method;
    }
    
    public Map<String, String> getHeaders() {
        return headers;
    }
    
    public void setHeaders(Map<String, String> headers) {
        this.headers = headers;
    }
    
    public String getBody() {
        return body;
    }
    
    public void setBody(String body) {
        this.body = body;
    }
}
