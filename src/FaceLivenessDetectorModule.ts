import { NativeModule, requireNativeModule } from 'expo';

import { FaceLivenessDetectorModuleEvents } from './FaceLivenessDetector.types';

declare class FaceLivenessDetectorModule extends NativeModule<FaceLivenessDetectorModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<FaceLivenessDetectorModule>('FaceLivenessDetector');
