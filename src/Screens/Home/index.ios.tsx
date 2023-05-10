/* eslint-disable react-native/no-inline-styles */
import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';

import { Text, TouchableOpacity, View } from 'react-native';
import { THomeStack } from 'src/Navigations/types';
import { MLPose } from './components/PoseDetection';
import { TCameraType, IPoseLandmarks } from '.';
import Skeleton from './components/Skeleton';
import { poseCalculations } from './components/ios';
import Icon from 'react-native-dynamic-vector-icons';
import { Socket, connect } from 'socket.io-client';

export const defaultPose: IPoseLandmarks = {
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

const Home: React.FC<StackScreenProps<THomeStack>> = ({}) => {
  const pose = useSharedValue<IPoseLandmarks>(defaultPose);
  const [message, setMessage] = useState<string>('');
  const socket = React.useMemo<Socket>(
    () =>
      connect(
        'http://160.153.249.64:5000?exercise_name=overhead squat&patient_facing=left&landmark_api=mediapipe&frame_height=640&frame_width=480',
        {
          timeout: 5000,
        },
      ),
    [],
  );

  useEffect(() => {
    socket.on('connect', () => {
      console.log('MOORA CONNECTED =>', new Date().toTimeString());
    });
    socket.on('my_response', e => {
      if (e) {
        setMessage(e.feedback_message);
      }
      console.log('connect => ', e);
    });
  }, [socket]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (message !== '') {
      timer = setTimeout(() => {
        setMessage('');
      }, 10000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [message]);

  const layout = useSharedValue<{
    height: string | number;
    width: string | number;
  }>({ height: '100%', width: '100%' });

  const [camera, setCamera] = useState<TCameraType>('front');

  const [hasPermission, setHasPermission] = React.useState(false);
  const devices = useCameraDevices();

  const device = devices[camera];

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);
  const SendSocket = (results: any) => {
    // 'worklet';
    // console.log(results);
    if (Object.keys(results).length !== 0) {
      socket.emit('my_event', JSON.stringify(results));
    }
  };

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    // count.value++;
    // console.log(`Frame Dimensions ${Platform.OS} => `, frame.toString());
    // Process the pose only for every second frame
    layout.value = {
      height: frame.height,
      width: frame.width,
    };

    const results = MLPose(frame);
    pose.value = poseCalculations(frame, results);
    runOnJS(SendSocket)(results);
  }, []);

  // useEffect(() => {
  //   const timeout = setInterval(() => {
  //     // console.log(`FPS count ${Platform.OS} ~> `, count.value++);
  //     count.value = 0;
  //   }, 1000);
  //   return () => clearInterval(timeout);
  // }, [count]);
  const cameraStyle = useAnimatedStyle(() => ({ ...layout.value }), []);
  return (
    <>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Animated.View style={cameraStyle}>
          {device != null && hasPermission ? (
            <Camera
              // key={orientation}
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
              preset="vga-640x480" // ~~> downsize video quality
              // fps={90}
              // frameProcessorFps={90}
              // onFrameProcessorPerformanceSuggestionAvailable={e =>
              //   console.log('Suggestion: ', e.suggestedFrameProcessorFps)
              // }
            />
          ) : null}

          <Skeleton pose={pose} />
        </Animated.View>
      </View>
      {message ? (
        <View
          style={{
            backgroundColor: '#00000090',
            width: '100%',
            height: 100,
            position: 'absolute',
            bottom: 100,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{ color: '#fff', fontSize: 20 }}>{message}</Text>
        </View>
      ) : null}
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
