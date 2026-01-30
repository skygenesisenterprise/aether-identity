// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "AetherIdentity",
    platforms: [
        .macOS(.v12),
        .iOS(.v15),
        .tvOS(.v15),
        .watchOS(.v8)
    ],
    products: [
        .library(
            name: "AetherIdentity",
            targets: ["AetherIdentity"]
        )
    ],
    dependencies: [
        .package(url: "https://github.com/kishikawakatsumi/KeychainAccess.git", from: "4.2.2")
    ],
    targets: [
        .target(
            name: "AetherIdentity",
            dependencies: [
                .product(name: "KeychainAccess", package: "KeychainAccess")
            ]
        ),
        .testTarget(
            name: "AetherIdentityTests",
            dependencies: ["AetherIdentity"]
        )
    ]
)
