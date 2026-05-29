import AWSPluginsCore
import Foundation

enum FaceLivenessDetectorCredentialStoreError: LocalizedError {
  case missingCredentials
  case expiredCredentials
  case invalidExpiration

  var errorDescription: String? {
    switch self {
    case .missingCredentials:
      return "Missing Face Liveness credentials"
    case .expiredCredentials:
      return "Face Liveness credentials are expired or close to expiry"
    case .invalidExpiration:
      return "Face Liveness credential expiration must be a valid ISO-8601 date"
    }
  }
}

struct FaceLivenessDetectorAWSTemporaryCredentials: AWSTemporaryCredentials {
  let accessKeyId: String
  let secretAccessKey: String
  let sessionToken: String
  let expiration: Date

  var isCloseToExpiry: Bool {
    expiration.timeIntervalSinceNow <= 60
  }
}

final class FaceLivenessDetectorCredentialStore {
  private static let lock = NSLock()
  private static var credentials: FaceLivenessDetectorAWSTemporaryCredentials?

  static func set(_ newCredentials: FaceLivenessDetectorAWSTemporaryCredentials) throws {
    lock.lock()
    defer { lock.unlock() }

    guard !newCredentials.accessKeyId.isEmpty,
      !newCredentials.secretAccessKey.isEmpty,
      !newCredentials.sessionToken.isEmpty
    else {
      throw FaceLivenessDetectorCredentialStoreError.missingCredentials
    }

    guard !newCredentials.isCloseToExpiry else {
      throw FaceLivenessDetectorCredentialStoreError.expiredCredentials
    }

    credentials = newCredentials
  }

  static func clear() {
    lock.lock()
    defer { lock.unlock() }

    credentials = nil
  }

  static func getCredentials() throws -> FaceLivenessDetectorAWSTemporaryCredentials {
    lock.lock()
    defer { lock.unlock() }

    guard let current = credentials else {
      throw FaceLivenessDetectorCredentialStoreError.missingCredentials
    }

    guard !current.isCloseToExpiry else {
      throw FaceLivenessDetectorCredentialStoreError.expiredCredentials
    }

    return current
  }
}

final class FaceLivenessDetectorCredentialsProvider: AWSCredentialsProvider {
  func fetchAWSCredentials() async throws -> AWSCredentials {
    try FaceLivenessDetectorCredentialStore.getCredentials()
  }
}

func parseFaceLivenessDetectorExpiration(_ value: String) throws -> Date {
  let isoFormatter = ISO8601DateFormatter()
  isoFormatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]

  if let date = isoFormatter.date(from: value) {
    return date
  }

  isoFormatter.formatOptions = [.withInternetDateTime]

  if let date = isoFormatter.date(from: value) {
    return date
  }

  throw FaceLivenessDetectorCredentialStoreError.invalidExpiration
}
