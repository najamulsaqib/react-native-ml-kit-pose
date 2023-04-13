import { StyleSheet, Dimensions } from 'react-native';
import { Frame } from 'react-native-vision-camera';
import { IPoseLandmarks } from './PoseDetection';

const { height, width } = Dimensions.get('window');

type tPoseCalculations = (
  frame: Frame,
  results: IPoseLandmarks,
) => IPoseLandmarks;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
});

const poseCalculations: tPoseCalculations = (frame, results) => {
  'worklet';
  const xFactor = width / frame.width;
  const yFactor = height / frame.height;

  const poseCopy: IPoseLandmarks = {
    leftShoulder: { x: 0, y: 0, visibility: 0 },
    rightShoulder: { x: 0, y: 0, visibility: 0 },
    leftElbow: { x: 0, y: 0, visibility: 0 },
    rightElbow: { x: 0, y: 0, visibility: 0 },
    leftWrist: { x: 0, y: 0, visibility: 0 },
    rightWrist: { x: 0, y: 0, visibility: 0 },
    leftHip: { x: 0, y: 0, visibility: 0 },
    rightHip: { x: 0, y: 0, visibility: 0 },
    leftKnee: { x: 0, y: 0, visibility: 0 },
    rightKnee: { x: 0, y: 0, visibility: 0 },
    leftAnkle: { x: 0, y: 0, visibility: 0 },
    rightAnkle: { x: 0, y: 0, visibility: 0 },
  };

  for (const [key, { x, y, visibility }] of Object.entries(results)) {
    poseCopy[key as keyof IPoseLandmarks] = {
      x: x * xFactor,
      y: y * yFactor,
      visibility,
    };
  }

  return poseCopy;
};

module.exports = {
  styles,
  poseCalculations,
  cameraDevice: undefined,
};
