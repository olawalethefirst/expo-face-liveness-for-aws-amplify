import { requireNativeView } from "expo";
import * as React from "react";

import { FaceLivenessDetectorViewProps } from "./FaceLivenessDetector.types";

const NativeView: React.ComponentType<FaceLivenessDetectorViewProps> =
  requireNativeView("FaceLivenessDetector");

export default function FaceLivenessDetectorView(
  props: FaceLivenessDetectorViewProps,
) {
  return <NativeView {...props} />;
}
