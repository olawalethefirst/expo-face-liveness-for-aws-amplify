import { NativeModule, registerWebModule } from "expo";

import {
  AuthCredentials,
  FaceLivenessDetectorModuleEvents,
} from "./FaceLivenessDetector.types";

class FaceLivenessDetectorModule extends NativeModule<FaceLivenessDetectorModuleEvents> {
  async setAuthCredentials(_credentials: AuthCredentials): Promise<void> {
    throw new Error(
      "FaceLivenessDetector is only available on iOS and Android.",
    );
  }

  async clearAuthCredentials(): Promise<void> {
    throw new Error(
      "FaceLivenessDetector is only available on iOS and Android.",
    );
  }
}

export default registerWebModule(
  FaceLivenessDetectorModule,
  "FaceLivenessDetectorModule",
);
