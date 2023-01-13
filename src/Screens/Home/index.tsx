import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import View from 'src/Components/View';
import { THomeStack } from 'src/Navigations/types';
import { MLPose } from './PoseDetection';

const Home = ({}: StackScreenProps<THomeStack>) => {
  const [hasPermission, setHasPermission] = React.useState(false);
  const devices = useCameraDevices('ultra-wide-angle-camera');
  const device = devices.front;

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    let results = MLPose(frame);

    console.log(JSON.stringify(results, null, 2));
  }, []);

  return (
    <View flexLayout={['flexBase', 'flexCenter']}>
      {device != null && hasPermission ? (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          // hdr
          // lowLightBoost={device.supportsLowLightBoost && false}
          frameProcessor={frameProcessor}
          frameProcessorFps={30}
          onFrameProcessorPerformanceSuggestionAvailable={e => console.log(e)}
        />
      ) : null}
    </View>
  );
};

export default Home;
