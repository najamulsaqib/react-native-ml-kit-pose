/* eslint-disable no-undef */
import type { Frame } from 'react-native-vision-camera';

declare let _WORKLET: true | undefined;

interface landmarks {
  x: number;
  y: number;
}

export interface Pose {
  LEFT_ELBOW: landmarks;
  LEFT_THUMB: landmarks;
  LEFT_EYE_INNER: landmarks;
  RIGHT_HIP: landmarks;
  LEFT_KNEE: landmarks;
  LEFT_HIP: landmarks;
  RIGHT_PINKY: landmarks;
  RIGHT_FOOT_INDEX: landmarks;
  RIGHT_KNEE: landmarks;
  RIGHT_EAR: landmarks;
  LEFT_EAR: landmarks;
  RIGHT_THUMB: landmarks;
  LEFT_EYE_OUTER: landmarks;
  RIGHT_SHOULDER: landmarks;
  LEFT_WRIST: landmarks;
  RIGHT_MOUTH: landmarks;
  LEFT_PINKY: landmarks;
  RIGHT_EYE_INNER: landmarks;
  LEFT_SHOULDER: landmarks;
  RIGHT_EYE: landmarks;
  RIGHT_EYE_OUTER: landmarks;
  LEFT_FOOT_INDEX: landmarks;
  LEFT_MOUTH: landmarks;
  LEFT_HEEL: landmarks;
  RIGHT_HEEL: landmarks;
  RIGHT_WRIST: landmarks;
  NOSE: landmarks;
  RIGHT_ELBOW: landmarks;
  LEFT_EYE: landmarks;
}

export function MLPose(frame: Frame): Pose[] {
  'worklet';
  if (!_WORKLET)
    throw new Error('examplePlugin must be called from a frame processor!');

  // @ts-ignore
  return __poseDetection(frame);
}
