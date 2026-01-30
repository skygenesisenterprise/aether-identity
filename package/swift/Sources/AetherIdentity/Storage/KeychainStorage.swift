import Foundation
import KeychainAccess

public final class KeychainStorage: SessionStorage {
    private let keychain: Keychain
    private let service: String

    public init(service: String = "com.aether.identity") throws {
        self.service = service
        self.keychain = Keychain(service: service)
            .accessibility(.afterFirstUnlock)
    }

    public func getItem(key: String) -> String? {
        try? keychain.get(key)
    }

    public func setItem(key: String, value: String) {
        try? keychain.set(value, key: key)
    }

    public func removeItem(key: String) {
        try? keychain.remove(key)
    }

    public func clearAll() {
        try? keychain.removeAll()
    }
}
