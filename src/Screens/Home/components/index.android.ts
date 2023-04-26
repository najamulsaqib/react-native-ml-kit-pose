import { Dimensions, StyleSheet } from 'react-native';
import { IPoseLandmarks, tPoseCalculations } from '../index.d';
const { height, width } = Dimensions.get('window');

const MAX_POSE_FRAMES = 6;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    transform: [{ scaleX: -1 }, { scaleY: -1 }],
  },
});

var poseArray: IPoseLandmarks[] = [];

const poseCalculations: tPoseCalculations = (frame, results) => {
  'worklet';

  /**
   ** Calculate factors to scale the pose landmarks based on the frame dimensions
   *
   *  For android we have divide mobile width by frame height and height by frame width as frame processor returns results in inverse.
   *
   **/

  const xFactor = width / frame.height;
  const yFactor = height / frame.width;

  // Create a copy of the IPoseLandmarks object, with all coordinates set to 0
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

  const entries = Object.entries(poseCopy);

  poseArray.push(results);

  if (poseArray.length === MAX_POSE_FRAMES) {
    for (let i = 0, len = entries.length; i < len; i++) {
      const [key] = entries[i];

      // Extract the x, y, and visibility arrays for this landmark
      let x = poseArray.map(j => j[key as keyof IPoseLandmarks]?.x);
      let y = poseArray.map(j => j[key as keyof IPoseLandmarks]?.y);
      let visibility = poseArray.map(
        j => j[key as keyof IPoseLandmarks]?.visibility,
      );

      // Sort the arrays in ascending order
      x = x.sort((a, b) => a - b);
      y = y.sort((a, b) => a - b);
      visibility = visibility.sort((a, b) => a - b);

      // // Dropping 2 min and 2 max coordinates
      // x = x.slice(2, 6);
      // y = y.slice(2, 6);
      // visibility = visibility.slice(2, 6);

      // Calculate the average position and visibility for this landmark
      poseCopy[key as keyof IPoseLandmarks] = {
        x: (x.reduce((a, b) => a + b, 0) / x.length) * xFactor,
        y: (y.reduce((a, b) => a + b, 0) / y.length) * yFactor,
        visibility: visibility.reduce((a, b) => a + b, 0) / visibility.length,
      };
    }

    // Remove the oldest frame from the poseArray
    poseArray.shift();
  }

  // Return the updated pose landmarks
  return poseCopy;
};

module.exports = {
  styles,
  poseCalculations,
  cameraDevice: undefined, // 'ultra-wide-angle-camera',
};
