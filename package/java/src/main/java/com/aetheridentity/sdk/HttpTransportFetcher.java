package com.aetheridentity.sdk;

import com.aetheridentity.sdk.types.TransportRequest;
import com.aetheridentity.sdk.types.TransportResponse;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.function.Function;

/**
 * Default HTTP transport fetcher using Java's HttpURLConnection.
 */
public class HttpTransportFetcher implements Function<TransportRequest, TransportResponse> {
    
    private static final int CONNECT_TIMEOUT = 30000;
    private static final int READ_TIMEOUT = 30000;
    
    @Override
    public TransportResponse apply(TransportRequest request) {
        try {
            URL url = new URL(request.getUrl());
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            
            connection.setRequestMethod(request.getMethod());
            connection.setConnectTimeout(CONNECT_TIMEOUT);
            connection.setReadTimeout(READ_TIMEOUT);
            connection.setDoInput(true);
            
            // Set headers
            if (request.getHeaders() != null) {
                for (Map.Entry<String, String> header : request.getHeaders().entrySet()) {
                    connection.setRequestProperty(header.getKey(), header.getValue());
                }
            }
            
            // Set body for POST/PUT
            if (request.getBody() != null && 
                (request.getMethod().equals("POST") || request.getMethod().equals("PUT"))) {
                connection.setDoOutput(true);
                try (OutputStream os = connection.getOutputStream()) {
                    byte[] input = request.getBody().getBytes(StandardCharsets.UTF_8);
                    os.write(input, 0, input.length);
                }
            }
            
            int statusCode = connection.getResponseCode();
            
            // Read response
            StringBuilder responseBuilder = new StringBuilder();
            BufferedReader reader;
            
            if (statusCode >= 200 && statusCode < 300) {
                reader = new BufferedReader(
                    new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8)
                );
            } else {
                reader = new BufferedReader(
                    new InputStreamReader(connection.getErrorStream(), StandardCharsets.UTF_8)
                );
            }
            
            String line;
            while ((line = reader.readLine()) != null) {
                responseBuilder.append(line);
            }
            reader.close();
            
            return new TransportResponse(statusCode, responseBuilder.toString());
            
        } catch (Exception e) {
            return new TransportResponse(0, e.getMessage());
        }
    }
}
