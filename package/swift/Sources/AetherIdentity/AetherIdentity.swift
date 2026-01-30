@_exported import Foundation

public typealias IdentityClientConfig = AetherIdentity.IdentityClientConfig
public typealias AuthInput = AetherIdentity.AuthInput
public typealias StrengthenInput = AetherIdentity.StrengthenInput
public typealias StrengthenType = AetherIdentity.StrengthenType
public typealias UserProfile = AetherIdentity.UserProfile
public typealias UserRoles = AetherIdentity.UserRoles
public typealias TokenResponse = AetherIdentity.TokenResponse
public typealias SessionResponse = AetherIdentity.SessionResponse
public typealias EIDVerifyInput = AetherIdentity.EIDVerifyInput
public typealias EIDStatusResponse = AetherIdentity.EIDStatusResponse
public typealias DeviceInfo = AetherIdentity.DeviceInfo
public typealias DeviceStatusResponse = AetherIdentity.DeviceStatusResponse
public typealias MachineEnrollmentResponse = AetherIdentity.MachineEnrollmentResponse
public typealias MachineTokenResponse = AetherIdentity.MachineTokenResponse

public typealias SessionStorage = AetherIdentity.SessionStorage
public typealias MemoryStorage = AetherIdentity.MemoryStorage
public typealias KeychainStorage = AetherIdentity.KeychainStorage
public typealias SessionManager = AetherIdentity.SessionManager
public typealias Transport = AetherIdentity.Transport
public typealias TransportConfig = AetherIdentity.TransportConfig

public typealias IdentityError = AetherIdentity.IdentityError
public typealias ErrorCode = AetherIdentity.ErrorCode
public typealias AuthenticationError = AetherIdentity.AuthenticationError
public typealias AuthorizationError = AetherIdentity.AuthorizationError
public typealias SessionExpiredError = AetherIdentity.SessionExpiredError
public typealias TOTPRequiredError = AetherIdentity.TOTPRequiredError
public typealias DeviceNotAvailableError = AetherIdentity.DeviceNotAvailableError
public typealias NetworkError = AetherIdentity.NetworkError
public typealias ServerError = AetherIdentity.ServerError

public typealias AuthService = AetherIdentity.AuthService
public typealias SessionService = AetherIdentity.SessionService
public typealias UserService = AetherIdentity.UserService
public typealias TokenService = AetherIdentity.TokenService
public typealias EIDService = AetherIdentity.EIDService
public typealias MachineService = AetherIdentity.MachineService
public typealias DeviceService = AetherIdentity.DeviceService

public let createIdentityClient = AetherIdentity.createIdentityClient
