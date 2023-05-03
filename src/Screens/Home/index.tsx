/* eslint-disable react-native/no-inline-styles */
import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import {} from '@react-navigation/material-top-tabs';
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';

import { TouchableOpacity, View } from 'react-native';
import { THomeStack } from 'src/Navigations/types';
import { MLPose } from './components/PoseDetection';
import { TCameraType, IPoseLandmarks } from './index.d';
import Skeleton from './components/Skeleton';

//@ts-expect-error
//? Platform-specific extensions
import { cameraDevice, poseCalculations, styles } from './components';
import Icon from 'react-native-dynamic-vector-icons';

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
  const [camera, setCamera] = useState<TCameraType>('front');

  const [hasPermission, setHasPermission] = React.useState(false);
  const devices = useCameraDevices(cameraDevice[camera]);
  // @ts-ignore
  const device = devices[camera];

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
    <>
      <View style={styles[camera]}>
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
            frameProcessorFps={120}
            // fps={90}
            // frameProcessorFps={90}
            // onFrameProcessorPerformanceSuggestionAvailable={e =>
            //   console.log('Suggestion: ', e.suggestedFrameProcessorFps)
            // }
          />
        ) : null}
        <Skeleton pose={pose} />
      </View>
      <View
        style={{
          width: '100%',
          position: 'absolute',
          alignItems: 'center',
          bottom: 20,
        }}>
        <TouchableOpacity
          onPress={() =>
            setCamera(prev => (prev === 'front' ? 'back' : 'front'))
          }
          style={{
            height: 100,
            width: 100,
            // backgroundColor: 'red',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon
            type="MaterialIcons"
            name={{ front: 'camera-front', back: 'camera-rear' }[camera]}
            size={70}
            color={{ front: 'blue', back: 'red' }[camera]}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Home;
