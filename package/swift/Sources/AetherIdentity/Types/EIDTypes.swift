import Foundation

public struct EIDVerifyInput {
    public let documentType: String
    public let documentNumber: String
    public let issuanceDate: String
    public let expirationDate: String

    public init(
        documentType: String,
        documentNumber: String,
        issuanceDate: String,
        expirationDate: String
    ) {
        self.documentType = documentType
        self.documentNumber = documentNumber
        self.issuanceDate = issuanceDate
        self.expirationDate = expirationDate
    }
}

public struct EIDStatusResponse: Codable {
    public let verified: Bool
    public var documentType: String?
    public var verifiedAt: Int?
    public var expiresAt: Int?

    public init(
        verified: Bool,
        documentType: String? = nil,
        verifiedAt: Int? = nil,
        expiresAt: Int? = nil
    ) {
        self.verified = verified
        self.documentType = documentType
        self.verifiedAt = verifiedAt
        self.expiresAt = expiresAt
    }
}
