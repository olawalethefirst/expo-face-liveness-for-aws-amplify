import ExpoModulesCore
import FaceLiveness
import SwiftUI

final class FaceLivenessDetectorExpoView: ExpoView {
  let onAnalysisComplete = EventDispatcher()
  let onError = EventDispatcher()

  private var hostingController: UIHostingController<AnyView>?

  var sessionId: String? {
    didSet {
      renderIfReady()
    }
  }

  var region: String? {
    didSet {
      renderIfReady()
    }
  }

  var disableStartView = false {
    didSet {
      renderIfReady()
    }
  }

  var challengeOptionsPayload: [String: Any]? {
    didSet {
      renderIfReady()
    }
  }

  private func makeChallengeOptions() -> ChallengeOptions {
    guard
      let faceMovement = challengeOptionsPayload?["faceMovement"] as? [String: Any],
      let cameraValue = faceMovement["camera"] as? String
    else {
      return ChallengeOptions()
    }

    switch cameraValue {
    case "back":
      return ChallengeOptions(
        faceMovementChallengeOption: FaceMovementChallengeOption(camera: .back)
      )

    case "front":
      return ChallengeOptions(
        faceMovementChallengeOption: FaceMovementChallengeOption(camera: .front)
      )

    default:
      #if DEBUG
      print("[FaceLiveness] Unrecognised camera value '\(cameraValue)', using SDK default.")
      #endif

      return ChallengeOptions()
    }
  }

  private func renderIfReady() {
    guard let sessionId, let region else {
      return
    }

    do {
      _ = try FaceLivenessDetectorCredentialStore.getCredentials()
    } catch {
      onError([
        "sessionId": sessionId,
        "message": "Not authorized to perform a face liveness check.",
        "code": 4,
        "recoverySuggestion": "Valid credentials are required for the face liveness check."
      ])
      return
    }

    removeHostingController()

    let livenessView = FaceLivenessDetectorContainerView(
      sessionId: sessionId,
      region: region,
      disableStartView: disableStartView,
      challengeOptions: makeChallengeOptions(),
      onAnalysisComplete: { [weak self] in
        guard let self else { return }

        self.onAnalysisComplete([
          "sessionId": self.sessionId ?? ""
        ])
      },
      onError: { [weak self] error in
        guard let self else { return }

        self.onError([
          "sessionId": self.sessionId ?? "",
          "message": error.localizedDescription,
          "code": String(describing: type(of: error))
        ])
      }
    )

    let controller = UIHostingController(rootView: AnyView(livenessView))
    hostingController = controller

    addSubview(controller.view)
    controller.view.translatesAutoresizingMaskIntoConstraints = false

    NSLayoutConstraint.activate([
      controller.view.topAnchor.constraint(equalTo: topAnchor),
      controller.view.bottomAnchor.constraint(equalTo: bottomAnchor),
      controller.view.leadingAnchor.constraint(equalTo: leadingAnchor),
      controller.view.trailingAnchor.constraint(equalTo: trailingAnchor)
    ])
  }

  private func removeHostingController() {
    guard let controller = hostingController else {
      return
    }

    controller.willMove(toParent: nil)
    controller.view.removeFromSuperview()
    controller.removeFromParent()

    hostingController = nil
  }

  override func removeFromSuperview() {
    removeHostingController()
    super.removeFromSuperview()
  }

  deinit {
    removeHostingController()
  }
}
