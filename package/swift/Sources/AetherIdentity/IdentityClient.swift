import Foundation

public final class IdentityClient {
    public let auth: AuthService
    public let session: SessionService
    public let user: UserService
    public let token: TokenService
    public let eid: EIDService
    public let machine: MachineService
    public let device: DeviceService

    private let transport: Transport
    private let sessionManager: SessionManager

    public convenience init(config: IdentityClientConfig) {
        let storage = config.storage ?? (try? KeychainStorage()) ?? MemoryStorage()
        let sessionManager = SessionManager(storage: storage)

        let transportConfig = TransportConfig(
            baseUrl: config.baseUrl,
            clientId: config.clientId
        )
        let transport = Transport(config: transportConfig)

        if let accessToken = config.accessToken {
            sessionManager.setToken(accessToken)
        }

        self.init(
            transport: transport,
            sessionManager: sessionManager,
            clientId: config.clientId
        )
    }

    public init(
        transport: Transport,
        sessionManager: SessionManager,
        clientId: String
    ) {
        self.transport = transport
        self.sessionManager = sessionManager

        self.auth = AuthService(transport: transport, session: sessionManager)
        self.session = SessionService(transport: transport, session: sessionManager)
        self.user = UserService(transport: transport, session: sessionManager)
        self.token = TokenService(transport: transport, session: sessionManager)
        self.eid = EIDService(transport: transport, session: sessionManager)
        self.machine = MachineService(transport: transport, clientId: clientId)
        self.device = DeviceService(transport: transport, session: sessionManager)
    }
}

public func createIdentityClient(config: IdentityClientConfig) -> IdentityClient {
    return IdentityClient(config: config)
}
