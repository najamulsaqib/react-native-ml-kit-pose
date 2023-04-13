import { Dimensions, StyleSheet } from 'react-native';
import { Frame } from 'react-native-vision-camera';
import { IPoseLandmarks, landmarks } from './PoseDetection';
const { height, width } = Dimensions.get('window');

type tPoseCalculations = (
  frame: Frame,
  results: IPoseLandmarks,
) => IPoseLandmarks;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    transform: [{ scaleX: -1 }],
  },
});

let array: IPoseLandmarks[] = [];

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
  };

  for (const [key, { x, y, visibility }] of Object.entries(results)) {
    poseCopy[key as keyof IPoseLandmarks] = {
      x: x * xFactor,
      y: y * yFactor,
      visibility,
    };
  }

  // array.push(poseCopy);
  // if (array.length === 8) {
  //   for (let landmark in poseCopy) {
  //     // Making an array of each joint coordinates
  //     let x = array.map(i => i[landmark as keyof IPoseLandmarks]?.x);
  //     let y = array.map(i => i[landmark as keyof IPoseLandmarks]?.x);
  //     let visibility = array.map(i => i[landmark as keyof IPoseLandmarks]?.x);

  //     // Sorting the array into ascending order
  //     x = x.sort((a, b) => a - b);
  //     y = y.sort((a, b) => a - b);
  //     visibility = visibility.sort((a, b) => a - b);

  //     // Dropping 2 min and 2 max coordinates
  //     x = x.slice(2, 6);
  //     y = y.slice(2, 6);
  //     visibility = visibility.slice(2, 6);

  //     poseCopy[landmark as keyof IPoseLandmarks] = {
  //       x: x.reduce((a, b) => a + b, 0) / x.length,
  //       y: y.reduce((a, b) => a + b, 0) / y.length,
  //       visibility: visibility.reduce((a, b) => a + b, 0) / visibility.length,
  //     };
  //   }
  //   array.shift();
  // }

  console.log(JSON.stringify(poseCopy, null, 2));
  return poseCopy;
};

module.exports = {
  styles,
  poseCalculations,
  cameraDevice: 'ultra-wide-angle-camera',
};
