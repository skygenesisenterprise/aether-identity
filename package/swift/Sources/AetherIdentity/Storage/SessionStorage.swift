#if canImport(FoundationNetworking)
import FoundationNetworking
#endif
import Foundation

public protocol SessionStorage {
    func getItem(key: String) -> String?
    func setItem(key: String, value: String)
    func removeItem(key: String)
}

public final class MemoryStorage: SessionStorage {
    private let store = NSMutableDictionary()

    public init() {}

    public func getItem(key: String) -> String? {
        store[key] as? String
    }

    public func setItem(key: String, value: String) {
        store[key] = value
    }

    public func removeItem(key: String) {
        store.removeObject(forKey: key)
    }
}
