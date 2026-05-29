import ExpoModulesCore

public class FaceLivenessDetectorModule: Module {
  public func definition() -> ModuleDefinition {
    Name("FaceLivenessDetector")

    AsyncFunction("setAuthCredentials") { (credentials: [String: String]) in
      guard let accessKeyId = credentials["accessKeyId"] else {
        throw FaceLivenessDetectorCredentialStoreError.missingCredentials
      }

      guard let secretAccessKey = credentials["secretAccessKey"] else {
        throw FaceLivenessDetectorCredentialStoreError.missingCredentials
      }

      guard let sessionToken = credentials["sessionToken"] else {
        throw FaceLivenessDetectorCredentialStoreError.missingCredentials
      }

      guard let expiration = credentials["expiration"] else {
        throw FaceLivenessDetectorCredentialStoreError.invalidExpiration
      }

      try FaceLivenessDetectorCredentialStore.set(
        FaceLivenessDetectorAWSTemporaryCredentials(
          accessKeyId: accessKeyId,
          secretAccessKey: secretAccessKey,
          sessionToken: sessionToken,
          expiration: try parseFaceLivenessDetectorExpiration(expiration)
        )
      )
    }

    AsyncFunction("clearAuthCredentials") {
      FaceLivenessDetectorCredentialStore.clear()
    }

    View(FaceLivenessDetectorExpoView.self) {
      Prop("sessionId") { (view: FaceLivenessDetectorExpoView, value: String) in
        view.sessionId = value
      }

      Prop("region") { (view: FaceLivenessDetectorExpoView, value: String) in
        view.region = value
      }

      Prop("disableStartView") { (view: FaceLivenessDetectorExpoView, value: Bool) in
        view.disableStartView = value
      }

      Prop("challengeOptions") { (view: FaceLivenessDetectorExpoView, value: [String: Any]?) in
        view.challengeOptionsPayload = value
      }

      Events("onAnalysisComplete", "onError")
    }
  }
}
