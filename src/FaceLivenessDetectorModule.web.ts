import { registerWebModule, NativeModule } from 'expo';

import { FaceLivenessDetectorModuleEvents } from './FaceLivenessDetector.types';

class FaceLivenessDetectorModule extends NativeModule<FaceLivenessDetectorModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(FaceLivenessDetectorModule, 'FaceLivenessDetectorModule');
