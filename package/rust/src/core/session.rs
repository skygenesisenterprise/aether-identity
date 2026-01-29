use std::sync::{Arc, Mutex};

use crate::types::TokenResponse;\nuse chrono::Utc;

#[derive(Clone, Debug, Default)]
pub struct SessionManager {
    access_token: Option<String>,
    refresh_token: Option<String>,
    expires_at: Option<i64>,
}

impl SessionManager {
    pub fn new(access_token: Option<String>) -> Self {
        Self {
            access_token,
            refresh_token: None,
            expires_at: None,
        }
    }

    pub fn set_tokens(&mut self, tokens: TokenResponse) {
        self.access_token = Some(tokens.access_token);
        self.refresh_token = Some(tokens.refresh_token);
        self.expires_at = Some(chrono::Utc::now().timestamp() + tokens.expires_in as i64);
    }

    pub fn get_access_token(&self) -> Option<String> {
        self.access_token.clone()
    }

    pub fn get_refresh_token(&self) -> Option<String> {
        self.refresh_token.clone()
    }

    pub fn get_expires_at(&self) -> Option<i64> {
        self.expires_at
    }

    pub fn is_authenticated(&self) -> bool {
        match self.expires_at {
            Some(ts) => chrono::Utc::now().timestamp() < ts,
            None => false,
        }
    }

    pub fn clear(&mut self) {
        self.access_token = None;
        self.refresh_token = None;
        self.expires_at = None;
    }
}

