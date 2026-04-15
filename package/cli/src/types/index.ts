export type Environment = "dev" | "staging" | "prod";

export interface Config {
  endpoint: string;
  environment: Environment;
  timeout: number;
}

export interface AuthConfig {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface StoredConfig {
  version: string;
  endpoint: string;
  environment: Environment;
  auth?: AuthConfig;
}

export interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Device {
  id: string;
  name: string;
  type: string;
  publicKey: string;
  fingerprints: string;
  lastSeen: string;
  createdAt: string;
}

export interface DeviceRegisterInput {
  name: string;
  type: string;
  publicKey: string;
}

export interface Node {
  id: string;
  name: string;
  type: "server" | "switch" | "router" | "endpoint";
  address: string;
  port: number;
  status: "online" | "offline" | "warning";
  lastSeen: string;
  createdAt: string;
}

export interface NodeRegisterInput {
  name: string;
  type: Node["type"];
  address: string;
  port: number;
}

export interface VaultSecret {
  key: string;
  value: string;
  metadata?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface Policy {
  id: string;
  name: string;
  description: string;
  effect: "allow" | "deny";
  resources: string[];
  actions: string[];
  subjects: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface WhoamiResponse {
  user: User;
  permissions: string[];
  organizations: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface ListResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
