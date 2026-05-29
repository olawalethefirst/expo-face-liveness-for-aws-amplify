package expo.modules.faceliveness

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class FaceLivenessDetectorModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("FaceLivenessDetector")

    AsyncFunction("setAuthCredentials") { credentials: Map<String, String> ->
      FaceLivenessDetectorCredentialStore.set(
        FaceLivenessDetectorAWSTemporaryCredentials(
          accessKeyId = credentials["accessKeyId"]
            ?: throw IllegalArgumentException("accessKeyId is required"),
          secretAccessKey = credentials["secretAccessKey"]
            ?: throw IllegalArgumentException("secretAccessKey is required"),
          sessionToken = credentials["sessionToken"]
            ?: throw IllegalArgumentException("sessionToken is required"),
          expiration = credentials["expiration"]
            ?: throw IllegalArgumentException("expiration is required")
        )
      )
    }

    AsyncFunction("clearAuthCredentials") {
      FaceLivenessDetectorCredentialStore.clear()
    }

    View(FaceLivenessDetectorExpoView::class) {
      Prop("sessionId") { view: FaceLivenessDetectorExpoView, value: String ->
        view.sessionId = value
      }

      Prop("region") { view: FaceLivenessDetectorExpoView, value: String ->
        view.region = value
      }

      Prop("disableStartView") { view: FaceLivenessDetectorExpoView, value: Boolean ->
        view.disableStartView = value
      }

      Prop("challengeOptions") { view: FaceLivenessDetectorExpoView, value: Map<String, Any>? ->
        view.challengeOptions = value
      }

      Events("onAnalysisComplete", "onError")
    }
  }
}
