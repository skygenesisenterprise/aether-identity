package com.aetheridentity.sdk.core;

import com.aetheridentity.sdk.types.TransportRequest;
import com.aetheridentity.sdk.types.TransportResponse;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * HTTP Transport layer for making API requests.
 */
public class Transport {
    
    private static final int DEFAULT_MAX_RETRIES = 3;
    private static final int DEFAULT_RETRY_DELAY = 1000;
    
    private final String baseUrl;
    private final Function<TransportRequest, TransportResponse> fetcher;
    private final String clientId;
    private final String systemKey;
    private final int maxRetries;
    private final int retryDelay;
    
    /**
     * Creates a new Transport instance.
     *
     * @param baseUrl The base URL for the API
     * @param fetcher The HTTP fetcher function
     * @param clientId The client ID
     * @param systemKey The system key (optional)
     */
    public Transport(String baseUrl, Function<TransportRequest, TransportResponse> fetcher, 
                     String clientId, String systemKey) {
        this(baseUrl, fetcher, clientId, systemKey, DEFAULT_MAX_RETRIES, DEFAULT_RETRY_DELAY);
    }
    
    /**
     * Creates a new Transport instance with retry configuration.
     *
     * @param baseUrl The base URL for the API
     * @param fetcher The HTTP fetcher function
     * @param clientId The client ID
     * @param systemKey The system key (optional)
     * @param maxRetries Maximum number of retries
     * @param retryDelay Delay between retries in milliseconds
     */
    public Transport(String baseUrl, Function<TransportRequest, TransportResponse> fetcher, 
                     String clientId, String systemKey, int maxRetries, int retryDelay) {
        this.baseUrl = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        this.fetcher = fetcher;
        this.clientId = clientId;
        this.systemKey = systemKey;
        this.maxRetries = maxRetries;
        this.retryDelay = retryDelay;
    }
    
    /**
     * Makes a GET request.
     *
     * @param endpoint The API endpoint
     * @param accessToken The access token (optional)
     * @param responseType The response type class
     * @param <T> The response type
     * @return The response
     */
    public <T> T get(String endpoint, String accessToken, Class<T> responseType) {
        Map<String, String> headers = createHeaders(accessToken, false);
        return request(endpoint, "GET", headers, null, responseType);
    }
    
    /**
     * Makes a POST request.
     *
     * @param endpoint The API endpoint
     * @param data The request body data
     * @param accessToken The access token (optional)
     * @param useSystemKeyAsAuth Whether to use system key as auth
     * @param responseType The response type class
     * @param <T> The response type
     * @return The response
     */
    public <T> T post(String endpoint, Object data, String accessToken, 
                      boolean useSystemKeyAsAuth, Class<T> responseType) {
        Map<String, String> headers = createHeaders(accessToken, useSystemKeyAsAuth);
        String body = data != null ? toJson(data) : null;
        return request(endpoint, "POST", headers, body, responseType);
    }
    
    /**
     * Makes a PUT request.
     *
     * @param endpoint The API endpoint
     * @param data The request body data
     * @param accessToken The access token (optional)
     * @param responseType The response type class
     * @param <T> The response type
     * @return The response
     */
    public <T> T put(String endpoint, Object data, String accessToken, Class<T> responseType) {
        Map<String, String> headers = createHeaders(accessToken, false);
        String body = data != null ? toJson(data) : null;
        return request(endpoint, "PUT", headers, body, responseType);
    }
    
    /**
     * Makes a DELETE request.
     *
     * @param endpoint The API endpoint
     * @param accessToken The access token (optional)
     * @param responseType The response type class
     * @param <T> The response type
     * @return The response
     */
    public <T> T delete(String endpoint, String accessToken, Class<T> responseType) {
        Map<String, String> headers = createHeaders(accessToken, false);
        return request(endpoint, "DELETE", headers, null, responseType);
    }
    
    private <T> T request(String endpoint, String method, Map<String, String> headers, 
                          String body, Class<T> responseType) {
        String url = baseUrl + endpoint;
        TransportRequest request = new TransportRequest(url, method, headers, body);
        
        TransportResponse response = executeWithRetry(request, maxRetries);
        
        if (!response.isOk()) {
            throw createErrorFromResponse(response);
        }
        
        if (responseType == Void.class || responseType == void.class) {
            return null;
        }
        
        return fromJson(response.getBody(), responseType);
    }
    
    private TransportResponse executeWithRetry(TransportRequest request, int retries) {
        try {
            TransportResponse response = fetcher.apply(request);
            
            if (!response.isOk() && retries > 0 && isRetryableError(response)) {
                sleep(retryDelay * (maxRetries - retries + 1));
                return executeWithRetry(request, retries - 1);
            }
            
            return response;
        } catch (Exception e) {
            if (retries > 0) {
                sleep(retryDelay * (maxRetries - retries + 1));
                return executeWithRetry(request, retries - 1);
            }
            throw new RuntimeException("Network error occurred", e);
        }
    }
    
    private Map<String, String> createHeaders(String accessToken, boolean useSystemKeyAsAuth) {
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        headers.put("X-Client-ID", clientId);
        
        if (accessToken != null) {
            headers.put("Authorization", "Bearer " + accessToken);
        } else if (useSystemKeyAsAuth && systemKey != null) {
            headers.put("Authorization", "Bearer " + systemKey);
        }
        
        if (systemKey != null) {
            headers.put("X-System-Key", systemKey);
        }
        
        return headers;
    }
    
    private boolean isRetryableError(TransportResponse response) {
        int statusCode = response.getStatusCode();
        return statusCode >= 500 || statusCode == 0;
    }
    
    private RuntimeException createErrorFromResponse(TransportResponse response) {
        // This will be implemented to throw specific error types
        return new RuntimeException("Request failed with status: " + response.getStatusCode());
    }
    
    private void sleep(int ms) {
        try {
            Thread.sleep(ms);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
    
    private String toJson(Object obj) {
        // Simple JSON serialization - in production use Jackson
        if (obj == null) return null;
        if (obj instanceof String) return (String) obj;
        // Placeholder - will use Jackson
        return obj.toString();
    }
    
    private <T> T fromJson(String json, Class<T> clazz) {
        // Simple JSON deserialization - in production use Jackson
        if (json == null || json.isEmpty()) {
            try {
                return clazz.getDeclaredConstructor().newInstance();
            } catch (Exception e) {
                return null;
            }
        }
        // Placeholder - will use Jackson
        try {
            return clazz.getDeclaredConstructor().newInstance();
        } catch (Exception e) {
            throw new RuntimeException("Failed to deserialize JSON", e);
        }
    }
}
