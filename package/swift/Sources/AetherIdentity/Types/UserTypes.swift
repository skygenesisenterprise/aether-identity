import Foundation

public struct UserProfile: Codable {
    public let id: String
    public let name: String
    public let email: String
    public let role: String
    public let isActive: Bool
    public let accountType: String
    public let createdAt: Int
    public let updatedAt: Int

    public init(
        id: String,
        name: String,
        email: String,
        role: String,
        isActive: Bool,
        accountType: String,
        createdAt: Int,
        updatedAt: Int
    ) {
        self.id = id
        self.name = name
        self.email = email
        self.role = role
        self.isActive = isActive
        self.accountType = accountType
        self.createdAt = createdAt
        self.updatedAt = updatedAt
    }
}

public struct UserRoles: Codable {
    public let id: String
    public let name: String
    public let permissions: [String]

    public init(id: String, name: String, permissions: [String]) {
        self.id = id
        self.name = name
        self.permissions = permissions
    }
}
