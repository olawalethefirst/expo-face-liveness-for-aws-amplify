import { NativeModule, requireNativeModule } from "expo";

import {
  AuthCredentials,
  FaceLivenessDetectorModuleEvents,
} from "./FaceLivenessDetector.types";

declare class FaceLivenessDetectorNativeModule extends NativeModule<FaceLivenessDetectorModuleEvents> {
  setAuthCredentials(credentials: AuthCredentials): Promise<void>;
  clearAuthCredentials(): Promise<void>;
}

const FaceLivenessDetectorModule =
  requireNativeModule<FaceLivenessDetectorNativeModule>("FaceLivenessDetector");

export async function setAuthCredentials(
  credentials: AuthCredentials,
): Promise<void> {
  return FaceLivenessDetectorModule.setAuthCredentials(credentials);
}

export async function clearAuthCredentials(): Promise<void> {
  return FaceLivenessDetectorModule.clearAuthCredentials();
}

export default FaceLivenessDetectorModule;
