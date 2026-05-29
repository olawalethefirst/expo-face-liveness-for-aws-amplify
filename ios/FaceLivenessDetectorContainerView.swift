import FaceLiveness
import SwiftUI

struct FaceLivenessDetectorContainerView: View {
  let sessionId: String
  let region: String
  let disableStartView: Bool
  let challengeOptions: ChallengeOptions
  let onAnalysisComplete: () -> Void
  let onError: (Error) -> Void

  @State private var isPresentingLiveness = true

  var body: some View {
    if isPresentingLiveness {
      FaceLivenessDetectorView(
        sessionID: sessionId,
        credentialsProvider: FaceLivenessDetectorCredentialsProvider(),
        region: region,
        disableStartView: disableStartView,
        challengeOptions: challengeOptions,
        isPresented: $isPresentingLiveness,
        onCompletion: { result in
          switch result {
          case .success:
            onAnalysisComplete()

          case .failure(let error):
            onError(error)
          }
        }
      )
    } else {
      Color.clear
    }
  }
}
