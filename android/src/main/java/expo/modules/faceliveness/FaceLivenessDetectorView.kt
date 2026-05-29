package expo.modules.faceliveness

import android.content.Context
import android.util.Log
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.ui.platform.ComposeView
import com.amplifyframework.ui.liveness.ui.Camera
import com.amplifyframework.ui.liveness.ui.ChallengeOptions
import com.amplifyframework.ui.liveness.ui.FaceLivenessDetector
import com.amplifyframework.ui.liveness.ui.LivenessColorScheme
import com.amplifyframework.ui.liveness.ui.LivenessChallenge
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ExpoView

class FaceLivenessDetectorExpoView(
  context: Context,
  appContext: AppContext
) : ExpoView(context, appContext) {

  private val composeView = ComposeView(context)

  private val sessionIdState = mutableStateOf<String?>(null)
  private val regionState = mutableStateOf<String?>(null)
  private val disableStartViewState = mutableStateOf(false)
  private val challengeOptionsState = mutableStateOf(ChallengeOptions())
  private val onAnalysisComplete by EventDispatcher()
  private val onError by EventDispatcher()

  var sessionId: String?
    get() = sessionIdState.value
    set(value) {
      sessionIdState.value = value
    }

  var region: String?
    get() = regionState.value
    set(value) {
      regionState.value = value
    }

  var disableStartView: Boolean
    get() = disableStartViewState.value
    set(value) {
      disableStartViewState.value = value
    }

  var challengeOptions: Map<String, Any>?
    get() = null
    set(value) {
      challengeOptionsState.value = makeChallengeOptions(value)
    }

  private fun makeChallengeOptions(payload: Map<String, Any>?): ChallengeOptions {
    val faceMovement = payload?.get("faceMovement") as? Map<*, *>
      ?: return ChallengeOptions()

    val rawCamera = faceMovement["camera"] as? String
      ?: return ChallengeOptions()

    return when (rawCamera) {
      "back" -> ChallengeOptions(
        faceMovement = LivenessChallenge.FaceMovement(
          camera = Camera.Back
        )
      )

      "front" -> ChallengeOptions(
        faceMovement = LivenessChallenge.FaceMovement(
          camera = Camera.Front
        )
      )

      else -> {
        Log.w(
          "FaceLiveness",
          "Unrecognised camera value '$rawCamera', using SDK default."
        )

        ChallengeOptions()
      }
    }
  }

  init {
    addView(
      composeView,
      LayoutParams(
        LayoutParams.MATCH_PARENT,
        LayoutParams.MATCH_PARENT
      )
    )

    composeView.setContent {
      val currentSessionId = sessionIdState.value
      val currentRegion = regionState.value
      val currentDisableStartView = disableStartViewState.value
      val currentChallengeOptions by challengeOptionsState

      if (currentSessionId == null || currentRegion == null) {
        return@setContent
      }

      try {
        FaceLivenessDetectorCredentialStore.getCredentials()
      } catch (error: Exception) {
        onError(
          mapOf(
            "sessionId" to currentSessionId,
            "message" to "Not authorized to perform a face liveness check.",
            "code" to "AccessDeniedException",
            "recoverySuggestion" to "Valid credentials are required for the face liveness check."
          )
        )

        return@setContent
      }

      MaterialTheme(
        colorScheme = LivenessColorScheme.default()
      ) {
        FaceLivenessDetector(
          sessionId = currentSessionId,
          region = currentRegion,
          credentialsProvider = FaceLivenessDetectorCredentialsProvider(),
          disableStartView = currentDisableStartView,
          challengeOptions = currentChallengeOptions,
          onComplete = {
            onAnalysisComplete(
              mapOf(
                "sessionId" to (sessionIdState.value ?: currentSessionId)
              )
            )
          },
          onError = { error ->
            val errorPayload = mutableMapOf<String, Any>(
              "sessionId" to (sessionIdState.value ?: currentSessionId),
              "message" to (error.message ?: "Face liveness failed"),
              "code" to (error::class.simpleName ?: "LIVENESS_ERROR")
            )

            error.recoverySuggestion?.let {
              errorPayload["recoverySuggestion"] = it
            }

            onError(errorPayload)
          }
        )
      }
    }
  }

  override fun onDetachedFromWindow() {
    composeView.disposeComposition()
    super.onDetachedFromWindow()
  }
}
