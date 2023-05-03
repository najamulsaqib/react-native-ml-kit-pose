import { SkiaMutableValue, SkPoint } from '@shopify/react-native-skia';
import React from 'react';
import { AnimateProps, SharedValue } from 'react-native-reanimated';
import { CircleProps, LineProps } from 'react-native-svg';
import { Frame } from 'react-native-vision-camera';

interface landmarks {
  x: number;
  y: number;
  visibility: number;
}

interface IPoseLandmarks {
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

  leftPinky: landmarks;
  leftIndex: landmarks;
  leftThumb: landmarks;
  leftHeel: landmarks;
  leftFootIndex: landmarks;
  rightPinky: landmarks;
  rightIndex: landmarks;
  rightThumb: landmarks;
  rightHeel: landmarks;
  rightFootIndex: landmarks;
}

type tPoseCalculations = (
  frame: Frame,
  results: IPoseLandmarks,
) => IPoseLandmarks;

type tUsePosition = (
  pose: SharedValue<IPoseLandmarks>,
  landmark1: keyof IPoseLandmarks,
  landmark2: keyof IPoseLandmarks,
) => Partial<AnimateProps<LineProps>> | undefined;

type tUsePositionForCircle = (
  pose: SharedValue<IPoseLandmarks>,
  landmark: keyof IPoseLandmarks,
) => Partial<AnimateProps<CircleProps>> | undefined;

type tusePositionDerivedValue = (
  pose: SharedValue<IPoseLandmarks>,
  landmark: keyof IPoseLandmarks,
) => {
  cx: SkiaMutableValue<number>;
  cy: SkiaMutableValue<number>;
  opacity: SkiaMutableValue<number>;
};

type tusePositionSkia = (
  pose: SharedValue<IPoseLandmarks>,
  landmark1: keyof IPoseLandmarks,
  landmark2: keyof IPoseLandmarks,
) => {
  p1: SkiaMutableValue<SkPoint>;
  p2: SkiaMutableValue<SkPoint>;
  display: SkiaMutableValue<number>;
};

interface ILineWithCircles {
  pose: SharedValue<IPoseLandmarks>;
  landmark1: keyof IPoseLandmarks;
  landmark2: keyof IPoseLandmarks;
  lineProps?: Partial<AnimateProps<LineProps>>;
}

interface SkeletonProps {
  pose: SharedValue<IPoseLandmarks>;
}

type ISkeleton = React.FC<SkeletonProps>;

type TCameraType = 'front' | 'back';
