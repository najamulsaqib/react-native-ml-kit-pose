import { Dimensions, StyleSheet } from 'react-native';
import { IPoseLandmarks, tPoseCalculations } from '../index.d';
import {
  LogicalCameraDeviceType,
  PhysicalCameraDeviceType,
} from 'react-native-vision-camera';
const { height, width } = Dimensions.get('screen');

const MAX_POSE_FRAMES = 2;

export const styles = StyleSheet.create({
  front: {
    flex: 1,
    transform: [{ scaleX: -1 }],
  },
  back: {
    flex: 1,
    transform: [{ scaleX: -1 }, { scaleY: -1 }],
  },
});

var poseArray: IPoseLandmarks[] = [];

export const poseCalculations: tPoseCalculations = (frame, results) => {
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
    landmark_0: { x: 0, y: 0, visibility: 0 },
    landmark_1: { x: 0, y: 0, visibility: 0 },
    landmark_2: { x: 0, y: 0, visibility: 0 },
    landmark_3: { x: 0, y: 0, visibility: 0 },
    landmark_4: { x: 0, y: 0, visibility: 0 },
    landmark_5: { x: 0, y: 0, visibility: 0 },
    landmark_6: { x: 0, y: 0, visibility: 0 },
    landmark_7: { x: 0, y: 0, visibility: 0 },
    landmark_8: { x: 0, y: 0, visibility: 0 },
    landmark_9: { x: 0, y: 0, visibility: 0 },
    landmark_10: { x: 0, y: 0, visibility: 0 },
    landmark_11: { x: 0, y: 0, visibility: 0 },
    landmark_12: { x: 0, y: 0, visibility: 0 },
    landmark_13: { x: 0, y: 0, visibility: 0 },
    landmark_14: { x: 0, y: 0, visibility: 0 },
    landmark_15: { x: 0, y: 0, visibility: 0 },
    landmark_16: { x: 0, y: 0, visibility: 0 },
    landmark_17: { x: 0, y: 0, visibility: 0 },
    landmark_18: { x: 0, y: 0, visibility: 0 },
    landmark_19: { x: 0, y: 0, visibility: 0 },
    landmark_20: { x: 0, y: 0, visibility: 0 },
    landmark_21: { x: 0, y: 0, visibility: 0 },
    landmark_22: { x: 0, y: 0, visibility: 0 },
    landmark_23: { x: 0, y: 0, visibility: 0 },
    landmark_24: { x: 0, y: 0, visibility: 0 },
    landmark_25: { x: 0, y: 0, visibility: 0 },
    landmark_26: { x: 0, y: 0, visibility: 0 },
    landmark_27: { x: 0, y: 0, visibility: 0 },
    landmark_28: { x: 0, y: 0, visibility: 0 },
    landmark_29: { x: 0, y: 0, visibility: 0 },
    landmark_30: { x: 0, y: 0, visibility: 0 },
    landmark_31: { x: 0, y: 0, visibility: 0 },
    landmark_32: { x: 0, y: 0, visibility: 0 },
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

export const cameraDevice: {
  front: PhysicalCameraDeviceType | LogicalCameraDeviceType;
  back: PhysicalCameraDeviceType | LogicalCameraDeviceType;
} = {
  front: 'ultra-wide-angle-camera',
  //@ts-ignore
  back: undefined,
};
