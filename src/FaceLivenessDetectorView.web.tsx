import * as React from 'react';

import { FaceLivenessDetectorViewProps } from './FaceLivenessDetector.types';

export default function FaceLivenessDetectorView(props: FaceLivenessDetectorViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
