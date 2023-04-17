import { Dimensions, StyleSheet } from 'react-native';
import { IPoseLandmarks, tPoseCalculations } from '../index.d';
const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  main: {
    flex: 1,
    transform: [{ scaleX: -1 }, { scaleY: -1 }],
  },
});

const poseCalculations: tPoseCalculations = (frame, results) => {
  'worklet';

  const xFactor = width / frame.height;
  const yFactor = height / frame.width;

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
    leftPinky: { x: 0, y: 0, visibility: 0 },
    leftIndex: { x: 0, y: 0, visibility: 0 },
    leftThumb: { x: 0, y: 0, visibility: 0 },
    leftHeel: { x: 0, y: 0, visibility: 0 },
    leftFootIndex: { x: 0, y: 0, visibility: 0 },
    rightPinky: { x: 0, y: 0, visibility: 0 },
    rightIndex: { x: 0, y: 0, visibility: 0 },
    rightThumb: { x: 0, y: 0, visibility: 0 },
    rightHeel: { x: 0, y: 0, visibility: 0 },
    rightFootIndex: { x: 0, y: 0, visibility: 0 },
  };

  // Use the pre-allocated array for the loop to reduce runtime overhead
  const entries = Object.entries(results);

  // Replace the for-of loop with a regular for loop to increase performance
  for (let i = 0, len = entries.length; i < len; i++) {
    const [key, { x, y, visibility }] = entries[i];
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
  cameraDevice: undefined, //'ultra-wide-angle-camera',
};
