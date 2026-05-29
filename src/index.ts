// Reexport the native module. On web, it will be resolved to FaceLivenessDetectorModule.web.ts
// and on native platforms to FaceLivenessDetectorModule.ts
export {
  clearAuthCredentials,
  default,
  setAuthCredentials,
} from "./FaceLivenessDetectorModule";
export { default as FaceLivenessDetectorView } from "./FaceLivenessDetectorView";
export * from "./FaceLivenessDetector.types";
