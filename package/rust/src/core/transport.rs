use std::sync::Arc;
use std::collections::HashMap;

use reqwest::Client;
use serde::de::DeserializeOwned;

use crate::errors::IdentityError;

use crate::types::IdentityClientConfig;

#[derive(Clone)]
pub struct Transport {
    base_url: String,
    client: Client,
    client_id: String,
}

impl Transport {
    pub fn new(base_url: String, client_id: String) -> Self {
        Self {
            base_url,
            client: Client::new(),
            client_id,
        }
    }

    async fn request<T: DeserializeOwned>(
        &self,
        endpoint: &str,
        method: &str,
        body: Option<&serde_json::Value>,
        access_token: Option<&str>,
    ) -> Result<T, IdentityError> {
        let url = format!("{}{}", self.base_url, endpoint);
        let mut req = match method {
            "GET" => self.client.get(&url),
            "POST" => self.client.post(&url),
            "PUT" => self.client.put(&url),
            "DELETE" => self.client.delete(&url),
            _ => self.client.get(&url),
        };

        req = req.header("Content-Type", "application/json");
        req = req.header("X-Client-ID", &self.client_id);
        if let Some(token) = access_token {
            req = req.bearer_auth(token);
        }
        if let Some(b) = body {
            req = req.json(b);
        }

        let resp = req.send().await.map_err(|_| IdentityError::NetworkError)?;
        if !resp.status().is_success() {
            // Try to parse error body for more details (best-effort)
            let status = resp.status().as_u16();
            let _ = (|| async move {
                let _d = resp.text().await; // ignore content for now
            })();
            // Map common statuses to errors
            return Err(match status {
                401 | 403 => IdentityError::AuthorizationError,
                419 => IdentityError::SessionExpiredError,
                423 => IdentityError::TOTPRequiredError,
                _ => IdentityError::ServerError,
            });
        }

        let data = resp.json::<T>().await.map_err(|_| IdentityError::ServerError)?;
        Ok(data)
    }

    pub async fn get<T: DeserializeOwned>(&self, endpoint: &str, access_token: Option<&str>) -> Result<T, IdentityError> {
        self.request(endpoint, "GET", None, access_token).await
    }

    pub async fn post<T: DeserializeOwned>(&self, endpoint: &str, data: Option<&serde_json::Value>, access_token: Option<&str>) -> Result<T, IdentityError> {
        self.request(endpoint, "POST", data, access_token).await
    }

    pub async fn put<T: DeserializeOwned>(&self, endpoint: &str, data: Option<&serde_json::Value>, access_token: Option<&str>) -> Result<T, IdentityError> {
        self.request(endpoint, "PUT", data, access_token).await
    }

    pub async fn delete<T: DeserializeOwned>(&self, endpoint: &str, access_token: Option<&str>) -> Result<T, IdentityError> {
        self.request(endpoint, "DELETE", None, access_token).await
    }
}

