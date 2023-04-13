/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Dimensions } from 'react-native';
import Animated, {
  AnimateProps,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { Line, LineProps, Svg } from 'react-native-svg';
import { SharedValue } from 'react-native-reanimated';
import { IPoseLandmarks } from './PoseDetection';

const AnimatedLine = Animated.createAnimatedComponent(Line);

type tUsePosition = (
  pose: SharedValue<IPoseLandmarks>,
  landmark1: keyof IPoseLandmarks,
  landmark2: keyof IPoseLandmarks,
) => Partial<AnimateProps<LineProps>> | undefined;

const usePosition: tUsePosition = (pose, landmark1, landmark2) => {
  return useAnimatedStyle(
    () => ({
      x1: pose.value[landmark1].x,
      y1: pose.value[landmark1].y,
      x2: pose.value[landmark2].x,
      y2: pose.value[landmark2].y,
      display:
        pose.value[landmark1].visibility > 0.6 &&
        pose.value[landmark2].visibility > 0.6
          ? 'flex'
          : 'none',
    }),
    [pose],
  );
};

const Skeleton: React.FC<{ pose: SharedValue<IPoseLandmarks> }> = ({
  pose,
}) => {
  const positions = {
    leftWristToElbowPosition: usePosition(pose, 'leftWrist', 'leftElbow'),
    leftElbowToShoulderPosition: usePosition(pose, 'leftElbow', 'leftShoulder'),
    leftShoulderToHipPosition: usePosition(pose, 'leftShoulder', 'leftHip'),
    leftHipToKneePosition: usePosition(pose, 'leftHip', 'leftKnee'),
    leftKneeToAnklePosition: usePosition(pose, 'leftKnee', 'leftAnkle'),
    rightWristToElbowPosition: usePosition(pose, 'rightWrist', 'rightElbow'),
    rightElbowToShoulderPosition: usePosition(
      pose,
      'rightElbow',
      'rightShoulder',
    ),
    rightShoulderToHipPosition: usePosition(pose, 'rightShoulder', 'rightHip'),
    rightHipToKneePosition: usePosition(pose, 'rightHip', 'rightKnee'),
    rightKneeToAnklePosition: usePosition(pose, 'rightKnee', 'rightAnkle'),
    shoulderToShoulderPosition: usePosition(
      pose,
      'leftShoulder',
      'rightShoulder',
    ),
    hipToHipPosition: usePosition(pose, 'leftHip', 'rightHip'),
  };

  return (
    <Svg
      height={Dimensions.get('window').height}
      width={Dimensions.get('window').width}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
      }}>
      {React.Children.toArray(
        Object.values(positions).map(position => (
          <AnimatedLine animatedProps={position} stroke="red" strokeWidth="2" />
        )),
      )}
    </Svg>
  );
};

export default Skeleton;
