import XCTest
@testable import AetherIdentity

final class AetherIdentityTests: XCTestCase {
    func testMemoryStorage() {
        let storage = MemoryStorage()

        storage.setItem("key1", value: "value1")
        XCTAssertEqual(storage.getItem("key1"), "value1")

        storage.setItem("key1", value: "value2")
        XCTAssertEqual(storage.getItem("key1"), "value2")

        storage.removeItem("key1")
        XCTAssertNil(storage.getItem("key1"))
    }

    func testSessionManager() {
        let storage = MemoryStorage()
        let sessionManager = SessionManager(storage: storage)

        XCTAssertFalse(sessionManager.isAuthenticated())
        XCTAssertNil(sessionManager.getAccessToken())
        XCTAssertNil(sessionManager.getRefreshToken())
        XCTAssertNil(sessionManager.getExpiresAt())

        let tokens = TokenResponse(
            accessToken: "test_access_token",
            refreshToken: "test_refresh_token",
            expiresIn: 3600
        )

        sessionManager.setTokens(tokens)

        XCTAssertTrue(sessionManager.isAuthenticated())
        XCTAssertEqual(sessionManager.getAccessToken(), "test_access_token")
        XCTAssertEqual(sessionManager.getRefreshToken(), "test_refresh_token")
        XCTAssertNotNil(sessionManager.getExpiresAt())

        sessionManager.clear()

        XCTAssertFalse(sessionManager.isAuthenticated())
        XCTAssertNil(sessionManager.getAccessToken())
    }

    func testAuthInput() {
        let input = AuthInput(email: "test@example.com", password: "password123")
        XCTAssertEqual(input.email, "test@example.com")
        XCTAssertEqual(input.password, "password123")
        XCTAssertNil(input.totpCode)

        let inputWithTotp = AuthInput(email: "test@example.com", password: "password123", totpCode: "123456")
        XCTAssertEqual(inputWithTotp.totpCode, "123456")
    }

    func testStrengthenInput() {
        let input = StrengthenInput(type: .totp)
        XCTAssertEqual(input.type, .totp)
        XCTAssertNil(input.value)

        let inputWithValue = StrengthenInput(type: .email, value: "user@example.com")
        XCTAssertEqual(inputWithValue.value, "user@example.com")
    }

    func testUserProfile() {
        let profile = UserProfile(
            id: "user123",
            name: "Test User",
            email: "test@example.com",
            role: "admin",
            isActive: true,
            accountType: "premium",
            createdAt: 1234567890,
            updatedAt: 1234567890
        )

        XCTAssertEqual(profile.id, "user123")
        XCTAssertEqual(profile.role, "admin")
        XCTAssertTrue(profile.isActive)
    }

    func testSessionResponse() {
        let response = SessionResponse(isAuthenticated: true)
        XCTAssertTrue(response.isAuthenticated)
        XCTAssertNil(response.user)
        XCTAssertNil(response.expiresAt)

        let profile = UserProfile(
            id: "user123",
            name: "Test User",
            email: "test@example.com",
            role: "user",
            isActive: true,
            accountType: "basic",
            createdAt: 1234567890,
            updatedAt: 1234567890
        )

        let responseWithUser = SessionResponse(isAuthenticated: true, user: profile, expiresAt: 1234567890)
        XCTAssertEqual(responseWithUser.user?.id, "user123")
        XCTAssertEqual(responseWithUser.expiresAt, 1234567890)
    }

    func testDeviceInfo() {
        let device = DeviceInfo(
            id: "device123",
            name: "iPhone",
            type: "mobile",
            lastSeen: 1234567890,
            trusted: true
        )

        XCTAssertEqual(device.id, "device123")
        XCTAssertTrue(device.trusted)
        XCTAssertNotNil(device.lastSeen)
    }

    func testErrorTypes() {
        let authError = AuthenticationError()
        XCTAssertEqual(authError.code, .authenticationFailed)
        XCTAssertEqual(authError.message, "Authentication failed")

        let authErrorCustom = AuthenticationError(message: "Invalid credentials", requestId: "req123")
        XCTAssertEqual(authErrorCustom.requestId, "req123")

        let sessionError = SessionExpiredError()
        XCTAssertEqual(sessionError.code, .sessionExpired)

        let totpError = TOTPRequiredError()
        XCTAssertEqual(totpError.code, .totpRequired)
    }

    func testMachineEnrollmentResponse() {
        let response = MachineEnrollmentResponse(
            machineId: "machine123",
            clientId: "client123",
            secret: "secret123"
        )

        XCTAssertEqual(response.machineId, "machine123")
        XCTAssertNil(response.accessToken)

        let responseWithToken = MachineEnrollmentResponse(
            machineId: "machine123",
            clientId: "client123",
            secret: "secret123",
            accessToken: "token123"
        )
        XCTAssertEqual(responseWithToken.accessToken, "token123")
    }
}
