import type { NativeSyntheticEvent, ViewProps } from "react-native";

export type AuthCredentials = {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
  expiration: string;
};

export type AnalysisCompleteEvent = {
  sessionId: string;
};

export type FaceLivenessErrorEvent = {
  code?: string | number;
  message: string;
  sessionId?: string;
  recoverySuggestion?: string;
};

export type FaceLivenessDetectorCamera = "front" | "back";

export type ChallengeOptions = {
  faceMovement?: {
    camera?: FaceLivenessDetectorCamera;
  };
};

export type FaceLivenessDetectorViewProps = ViewProps & {
  sessionId: string;
  region: string;
  disableStartView?: boolean;
  challengeOptions?: ChallengeOptions;
  onAnalysisComplete?: (
    event: NativeSyntheticEvent<AnalysisCompleteEvent>,
  ) => void;
  onError?: (event: NativeSyntheticEvent<FaceLivenessErrorEvent>) => void;
};

export type FaceLivenessDetectorModuleEvents = Record<string, never>;
