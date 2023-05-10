import type { Frame } from 'react-native-vision-camera';

declare let _WORKLET: true | undefined;

import { IPoseLandmarks } from '../index.d';

export function MLPose(frame: Frame): IPoseLandmarks {
  'worklet';
  if (!_WORKLET) {
    throw new Error('MLPose must be called from a frame processor!');
  }

  // @ts-ignore
  // eslint-disable-next-line no-undef
  return __poseDetection(frame);
}
