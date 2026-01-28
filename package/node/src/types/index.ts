export type FetchLike = typeof fetch;

export interface IdentityClientConfig {
  baseUrl: string;
  clientId: string;
  accessToken?: string;
  fetcher?: FetchLike;
}

export interface AuthInput {
  email: string;
  password: string;
  _totpCode?: string;
}

export interface StrengthenInput {
  type: "totp" | "email" | "sms";
  value?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  accountType: string;
  createdAt: number;
  updatedAt: number;
}

export interface UserRoles {
  id: string;
  name: string;
  permissions: string[];
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface SessionResponse {
  isAuthenticated: boolean;
  user?: UserProfile;
  expiresAt?: number;
}

export interface EIDVerifyInput {
  documentType: string;
  documentNumber: string;
  issuanceDate: string;
  expirationDate: string;
}

export interface EIDStatusResponse {
  verified: boolean;
  documentType?: string;
  verifiedAt?: number;
  expiresAt?: number;
}

export interface DeviceInfo {
  id: string;
  name: string;
  type: string;
  lastSeen?: number;
  trusted: boolean;
}

export interface DeviceStatusResponse {
  available: boolean;
  device?: DeviceInfo;
  lastSync?: number;
}

export interface MachineEnrollmentResponse {
  machineId: string;
  clientId: string;
  secret: string;
  accessToken?: string;
}

export interface MachineTokenResponse {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
}
