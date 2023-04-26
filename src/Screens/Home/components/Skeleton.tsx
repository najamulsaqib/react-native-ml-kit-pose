/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Dimensions } from 'react-native';
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { Circle, Line, Svg } from 'react-native-svg';
import {
  ILineWithCircles,
  ISkeleton,
  tUsePosition,
  tUsePositionForCircle,
} from '../index.d';

const pairs = [
  // body
  ['leftWrist', 'leftElbow'],
  ['leftElbow', 'leftShoulder'],
  ['leftShoulder', 'leftHip'],
  ['leftHip', 'leftKnee'],
  ['leftKnee', 'leftAnkle'],
  ['rightWrist', 'rightElbow'],
  ['rightElbow', 'rightShoulder'],
  ['rightShoulder', 'rightHip'],
  ['rightHip', 'rightKnee'],
  ['rightKnee', 'rightAnkle'],
  ['leftShoulder', 'rightShoulder'],
  ['leftHip', 'rightHip'],
  // // hand
  // ['leftPinky', 'leftIndex'],
  // ['leftPinky', 'leftWrist'],
  // ['leftIndex', 'leftWrist'],
  // ['rightPinky', 'rightIndex'],
  // ['rightPinky', 'rightWrist'],
  // ['rightIndex', 'rightWrist'],
  // //feet
  // ['leftAnkle', 'leftFootIndex'],
  // ['leftHeel', 'leftFootIndex'],
  // ['leftHeel', 'leftAnkle'],
  // ['rightAnkle', 'rightFootIndex'],
  // ['rightHeel', 'rightFootIndex'],
  // ['rightHeel', 'rightAnkle'],
];

const AnimatedLine = Animated.createAnimatedComponent(Line);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const usePosition: tUsePosition = (pose, landmark1, landmark2) => {
  return useAnimatedStyle(() => {
    const visibility1 = pose.value[landmark1].visibility;
    const visibility2 = pose.value[landmark2].visibility;

    // x1: withTiming(pose.value[landmark1].x, {
    //   duration: 10,
    //   easing: Easing.linear,
    // }),
    return {
      x1: pose.value[landmark1].x,
      y1: pose.value[landmark1].y,
      x2: pose.value[landmark2].x,
      y2: pose.value[landmark2].y,
      display: visibility1 > 0.6 && visibility2 > 0.6 ? 'flex' : 'none',
    };
  }, [pose]);
};

const usePositionForCircle: tUsePositionForCircle = (pose, landmark) => {
  return useAnimatedProps(() => ({
    cx: pose.value[landmark].x,
    cy: pose.value[landmark].y,
    opacity: pose.value[landmark].visibility > 0.6 ? 1 : 0,
  }));
};

const LineWithCircles: React.FC<ILineWithCircles> = ({
  pose,
  landmark1,
  landmark2,
  lineProps,
}) => {
  const landmark1CircleProps = usePositionForCircle(pose, landmark1);
  const landmark2CircleProps = usePositionForCircle(pose, landmark2);
  const color1 = landmark1.startsWith('left') ? 'green' : 'orange';
  const color2 = landmark2.startsWith('left') ? 'green' : 'orange';

  return (
    <>
      <AnimatedLine
        animatedProps={lineProps}
        stroke="#ffee"
        strokeWidth="2.5"
      />
      <AnimatedCircle
        animatedProps={landmark1CircleProps}
        r={5}
        stroke="#ffee"
        fill={color1}
      />
      <AnimatedCircle
        animatedProps={landmark2CircleProps}
        r={5}
        stroke="#ffee"
        fill={color2}
      />
    </>
  );
};

const Skeleton: ISkeleton = ({ pose }) => {
  const positions = pairs.map(([landmark1, landmark2]) => ({
    // @ts-ignore
    // eslint-disable-next-line react-hooks/rules-of-hooks
    lineProps: usePosition(pose, landmark1, landmark2),
    landmark1,
    landmark2,
  }));

  const values = React.useMemo(() => Object.values(positions), [positions]);

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
        values.map(({ landmark1, landmark2, lineProps }) => (
          <LineWithCircles
            //@ts-ignore
            landmark1={landmark1}
            //@ts-ignore
            landmark2={landmark2}
            lineProps={lineProps}
            pose={pose}
          />
        )),
      )}
    </Svg>
  );
};

export default Skeleton;
