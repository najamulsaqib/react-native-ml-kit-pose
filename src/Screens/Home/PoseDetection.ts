/* eslint-disable no-undef */
import type { Frame } from 'react-native-vision-camera';

declare let _WORKLET: true | undefined;

export interface landmarks {
  x: number;
  y: number;
  visibility: number;
}

export interface IPoseLandmarks {
  leftShoulder: landmarks;
  rightShoulder: landmarks;
  leftElbow: landmarks;
  rightElbow: landmarks;
  leftWrist: landmarks;
  rightWrist: landmarks;
  leftHip: landmarks;
  rightHip: landmarks;
  leftKnee: landmarks;
  rightKnee: landmarks;
  leftAnkle: landmarks;
  rightAnkle: landmarks;
}

export function MLPose(frame: Frame): IPoseLandmarks | null {
  'worklet';
  if (!_WORKLET) {
    throw new Error('MLPose must be called from a frame processor!');
  }

  // @ts-ignore
  return __poseDetection(frame);
}
