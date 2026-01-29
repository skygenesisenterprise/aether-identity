use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct IdentityClientConfig {
    pub base_url: String,
    pub client_id: String,
    pub access_token: Option<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct AuthInput {
    pub email: String,
    pub password: String,
    #[serde(rename = "_totpCode", skip_serializing_if = "Option::is_none")]
    pub totp_code: Option<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct StrengthenInput {
    pub r#type: StrengthType,
    pub value: Option<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub enum StrengthType {
    #[serde(rename = "totp")]
    Totp,
    #[serde(rename = "email")]
    Email,
    #[serde(rename = "sms")]
    Sms,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct UserProfile {
    pub id: String,
    pub name: String,
    pub email: String,
    pub role: String,
    #[serde(rename = "isActive")]
    pub is_active: bool,
    #[serde(rename = "accountType")]
    pub account_type: String,
    #[serde(rename = "createdAt")]
    pub created_at: i64,
    #[serde(rename = "updatedAt")]
    pub updated_at: i64,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct UserRoles {
    pub id: String,
    pub name: String,
    pub permissions: Vec<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct TokenResponse {
    #[serde(rename = "accessToken")]
    pub access_token: String,
    #[serde(rename = "refreshToken")]
    pub refresh_token: String,
    #[serde(rename = "expiresIn")]
    pub expires_in: i64,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct SessionResponse {
    #[serde(rename = "isAuthenticated")]
    pub is_authenticated: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub user: Option<UserProfile>,
    #[serde(rename = "expiresAt", skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<i64>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct EIDVerifyInput {
    pub document_type: String,
    pub document_number: String,
    pub issuance_date: String,
    pub expiration_date: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct EIDStatusResponse {
    pub verified: bool,
    #[serde(rename = "documentType", skip_serializing_if = "Option::is_none")]
    pub document_type: Option<String>,
    #[serde(rename = "verifiedAt", skip_serializing_if = "Option::is_none")]
    pub verified_at: Option<i64>,
    #[serde(rename = "expiresAt", skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<i64>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct DeviceInfo {
    pub id: String,
    pub name: String,
    pub r#type: String,
    #[serde(rename = "lastSeen", skip_serializing_if = "Option::is_none")]
    pub last_seen: Option<i64>,
    pub trusted: bool,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct DeviceStatusResponse {
    pub available: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub device: Option<DeviceInfo>,
    #[serde(rename = "lastSync", skip_serializing_if = "Option::is_none")]
    pub last_sync: Option<i64>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct MachineEnrollmentResponse {
    #[serde(rename = "machineId")]
    pub machine_id: String,
    #[serde(rename = "clientId")]
    pub client_id: String,
    pub secret: String,
    #[serde(rename = "accessToken", skip_serializing_if = "Option::is_none")]
    pub access_token: Option<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct MachineTokenResponse {
    #[serde(rename = "accessToken")]
    pub access_token: String,
    #[serde(rename = "expiresIn")]
    pub expires_in: i64,
    #[serde(rename = "tokenType")]
    pub token_type: String,
}

// Re-export commonly used types via a central module
pub type FetchLike = fn(&str) -> String; // placeholder; actual fetch wrapper in JS interop

