/* eslint-disable react-native/no-inline-styles */
import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';

import { View } from 'react-native';
import { THomeStack } from 'src/Navigations/types';
import { MLPose } from './components/PoseDetection';
import { IPoseLandmarks } from './index.d';
import Skeleton from './components/Skeleton';

//@ts-expect-error
//? Platform-specific extensions
import { cameraDevice, poseCalculations, styles } from './components';

export const defaultPose: IPoseLandmarks = {
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

const Home: React.FC<StackScreenProps<THomeStack>> = ({}) => {
  const pose = useSharedValue(defaultPose);
  const count = useSharedValue(0);

  const [hasPermission, setHasPermission] = React.useState(false);
  const devices = useCameraDevices(cameraDevice);

  const device = devices.back;

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';

    count.value++;
    // Process the pose only for every second frame
    const results = MLPose(frame);
    // console.log(JSON.stringify(results, null, 2));
    pose.value = poseCalculations(frame, results);
  }, []);

  useEffect(() => {
    const timeout = setInterval(() => {
      console.log(count.value++);
      count.value = 0;
    }, 999);
    return () => clearInterval(timeout);
  }, [count]);

  return (
    <View style={styles.main}>
      {device != null && hasPermission ? (
        <Camera
          style={{
            height: '100%',
            width: '100%',
          }}
          device={device}
          isActive={true}
          frameProcessor={frameProcessor}
          orientation="portrait"
          onError={e => console.log(e, 'njm')}
          // fps={90}
          // frameProcessorFps={90}
          // onFrameProcessorPerformanceSuggestionAvailable={e =>
          //   console.log('Suggestion: ', e.suggestedFrameProcessorFps)
          // }
        />
      ) : null}
      <Skeleton pose={pose} />
    </View>
  );
};

export default Home;
