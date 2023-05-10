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
  landmark_0: landmarks; // nose
  landmark_1: landmarks; // left eye inner
  landmark_2: landmarks; // left eye
  landmark_3: landmarks; // left eye outer
  landmark_4: landmarks; // right eye inner
  landmark_5: landmarks; // right eye
  landmark_6: landmarks; // right eye outer
  landmark_7: landmarks; // left ear
  landmark_8: landmarks; // right ear
  landmark_9: landmarks; // mouth left
  landmark_10: landmarks; // mouth right
  landmark_11: landmarks; // left shoulder
  landmark_12: landmarks; // right shoulder
  landmark_13: landmarks; // left elbow
  landmark_14: landmarks; // right elbow
  landmark_15: landmarks; // left wrist
  landmark_16: landmarks; // right wrist
  landmark_17: landmarks; // left pinky
  landmark_18: landmarks; // right pinky
  landmark_19: landmarks; // left index
  landmark_20: landmarks; // right index
  landmark_21: landmarks; // left thumb
  landmark_22: landmarks; // right thumb
  landmark_23: landmarks; // left hip
  landmark_24: landmarks; // right hip
  landmark_25: landmarks; // left knee
  landmark_26: landmarks; // right knee
  landmark_27: landmarks; // left ankle
  landmark_28: landmarks; // right ankle
  landmark_29: landmarks; // left heel
  landmark_30: landmarks; // right heel
  landmark_31: landmarks; // left foot index
  landmark_32: landmarks; // right foot index
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
