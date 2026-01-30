import Foundation

public struct DeviceInfo: Codable {
    public let id: String
    public let name: String
    public let type: String
    public var lastSeen: Int?
    public let trusted: Bool

    public init(
        id: String,
        name: String,
        type: String,
        lastSeen: Int? = nil,
        trusted: Bool
    ) {
        self.id = id
        self.name = name
        self.type = type
        self.lastSeen = lastSeen
        self.trusted = trusted
    }
}

public struct DeviceStatusResponse: Codable {
    public let available: Bool
    public var device: DeviceInfo?
    public var lastSync: Int?

    public init(available: Bool, device: DeviceInfo? = nil, lastSync: Int? = nil) {
        self.available = available
        self.device = device
        self.lastSync = lastSync
    }
}
