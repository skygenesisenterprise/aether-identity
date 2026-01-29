use std::sync::{Arc, Mutex};

pub mod core;
pub mod modules;
pub mod types;
pub mod errors;

// Re-export commonly used types for ergonomics
pub use crate::types::{AuthInput, StrengthenInput, UserProfile, UserRoles, TokenResponse, SessionResponse, EIDVerifyInput, EIDStatusResponse, DeviceInfo, DeviceStatusResponse, MachineEnrollmentResponse, MachineTokenResponse, IdentityClientConfig};

use crate::core::transport::Transport;
use crate::core::session::SessionManager;

#[derive(Clone)]
pub struct IdentityClient {
    pub auth: modules::auth::AuthModule,
    pub session: modules::session::SessionModule,
    pub user: modules::user::UserModule,
    pub token: modules::token::TokenModule,
    pub eid: modules::eid::EIDModule,
    pub machine: modules::machine::MachineModule,
    pub device: modules::device::DeviceModule,

    pub transport: Arc<Transport>,
    pub session_manager: Arc<Mutex<SessionManager>>,
}

#[derive(Clone)]
pub struct IdentityClientConfig {
    pub base_url: String,
    pub client_id: String,
    pub access_token: Option<String>,
}

// Convenience constructor matching TS API: CreateIdentityClient(config)
pub fn create_identity_client(config: IdentityClientConfig) -> IdentityClient {
    IdentityClient::new(config)
}

impl IdentityClient {
    pub fn new(config: IdentityClientConfig) -> Self {
        let transport = Transport::new(config.base_url.clone(), config.client_id.clone());
        let session_manager = Arc::new(Mutex::new(SessionManager::new(config.access_token)));
        let transport = Arc::new(transport);
        // Initialize modules with shared transport and session
        let auth = modules::auth::AuthModule::new(transport.clone(), session_manager.clone());
        let session_module = modules::session::SessionModule::new(transport.clone(), session_manager.clone());
        let user = modules::user::UserModule::new(transport.clone(), session_manager.clone());
        let token = modules::token::TokenModule::new(transport.clone(), session_manager.clone());
        let eid = modules::eid::EIDModule::new(transport.clone(), session_manager.clone());
        let machine = modules::machine::MachineModule::new(transport.clone(), config.base_url.clone(), config.client_id.clone());
        let device = modules::device::DeviceModule::new(transport.clone(), session_manager.clone());

        IdentityClient {
            auth,
            session: session_module,
            user,
            token,
            eid,
            machine,
            device,
            transport,
            session_manager,
        }
    }
}
