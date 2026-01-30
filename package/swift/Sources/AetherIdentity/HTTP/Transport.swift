import Foundation

public struct TransportConfig {
    public let baseUrl: String
    public let clientId: String
    public var maxRetries: Int
    public var retryDelay: Int

    public init(
        baseUrl: String,
        clientId: String,
        maxRetries: Int = 3,
        retryDelay: Int = 1000
    ) {
        self.baseUrl = baseUrl
        self.clientId = clientId
        self.maxRetries = maxRetries
        self.retryDelay = retryDelay
    }
}

public final class Transport {
    private let config: TransportConfig
    private let session: URLSession

    public init(config: TransportConfig, session: URLSession = .shared) {
        self.config = config
        self.session = session
    }

    private func sleep(milliseconds: Int) async throws {
        try await Task.sleep(nanoseconds: UInt64(milliseconds) * 1_000_000)
    }

    private func isRetryableError(_ error: Error) -> Bool {
        if error is NetworkError { return true }
        if error is ServerError { return true }
        return false
    }

    private func buildRequest(endpoint: String, method: String, body: Data?, accessToken: String?) throws -> URLRequest {
        guard let url = URL(string: config.baseUrl + endpoint) else {
            throw NetworkError(message: "Invalid URL")
        }

        var request = URLRequest(url: url)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(config.clientId, forHTTPHeaderField: "X-Client-ID")

        if let token = accessToken {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        request.httpBody = body

        return request
    }

    private func decodeResponse<T: Decodable>(from data: Data) throws -> T {
        let decoder = JSONDecoder()
        return try decoder.decode(T.self, from: data)
    }

    private func decodeErrorData(from data: Data) -> [String: Any]? {
        try? JSONSerialization.jsonObject(with: data) as? [String: Any]
    }

    private func request<T: Decodable>(
        endpoint: String,
        method: String,
        body: Data? = nil,
        accessToken: String? = nil,
        retries: Int? = nil
    ) async throws -> T {
        let currentRetries = retries ?? config.maxRetries

        let request = try buildRequest(endpoint: endpoint, method: method, body: body, accessToken: accessToken)

        do {
            let (data, response) = try await session.data(for: request)

            guard let httpResponse = response as? HTTPURLResponse else {
                throw NetworkError()
            }

            guard (200...299).contains(httpResponse.statusCode) else {
                let errorData = decodeErrorData(from: data) ?? [:]
                let error = createErrorFromResponse(statusCode: httpResponse.statusCode, data: errorData)

                if isRetryableError(error) && currentRetries > 0 {
                    try await sleep(milliseconds: config.retryDelay * (config.maxRetries - currentRetries + 1))
                    return try await request(endpoint: endpoint, method: method, body: body, accessToken: accessToken, retries: currentRetries - 1)
                }

                throw error
            }

            return try decodeResponse(from: data)
        } catch let error as IdentityError {
            if isRetryableError(error) && currentRetries > 0 {
                try await sleep(milliseconds: config.retryDelay * (config.maxRetries - currentRetries + 1))
                return try await request(endpoint: endpoint, method: method, body: body, accessToken: accessToken, retries: currentRetries - 1)
            }
            throw error
        } catch {
            if currentRetries > 0 {
                try await sleep(milliseconds: config.retryDelay * (config.maxRetries - currentRetries + 1))
                return try await request(endpoint: endpoint, method: method, body: body, accessToken: accessToken, retries: currentRetries - 1)
            }
            throw NetworkError()
        }
    }

    public func get<T: Decodable>(endpoint: String, accessToken: String? = nil) async throws -> T {
        try await request(endpoint: endpoint, method: "GET", accessToken: accessToken)
    }

    public func post<T: Decodable>(endpoint: String, body: [String: Any]? = nil, accessToken: String? = nil) async throws -> T {
        let bodyData = body.flatMap { try? JSONSerialization.data(withJSONObject: $0) }
        try await request(endpoint: endpoint, method: "POST", body: bodyData, accessToken: accessToken)
    }

    public func post<T: Decodable>(endpoint: String, body: Encodable, accessToken: String? = nil) async throws -> T {
        let encoder = JSONEncoder()
        let bodyData = try encoder.encode(body)
        try await request(endpoint: endpoint, method: "POST", body: bodyData, accessToken: accessToken)
    }

    public func post<T: Decodable>(endpoint: String, body: Data?, accessToken: String? = nil) async throws -> T {
        try await request(endpoint: endpoint, method: "POST", body: body, accessToken: accessToken)
    }

    public func put<T: Decodable>(endpoint: String, body: [String: Any]? = nil, accessToken: String? = nil) async throws -> T {
        let bodyData = body.flatMap { try? JSONSerialization.data(withJSONObject: $0) }
        try await request(endpoint: endpoint, method: "PUT", body: bodyData, accessToken: accessToken)
    }

    public func put<T: Decodable>(endpoint: String, body: Encodable, accessToken: String? = nil) async throws -> T {
        let encoder = JSONEncoder()
        let bodyData = try encoder.encode(body)
        try await request(endpoint: endpoint, method: "PUT", body: bodyData, accessToken: accessToken)
    }

    public func delete<T: Decodable>(endpoint: String, accessToken: String? = nil) async throws -> T {
        try await request(endpoint: endpoint, method: "DELETE", accessToken: accessToken)
    }
}
