import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RNBootSplash from 'react-native-bootsplash';
import HomeStack from './HomeStack';

const Navigations = () => {
  return (
    <NavigationContainer
      onReady={() => {
        RNBootSplash.hide({ fade: true });
      }}>
      <HomeStack />
    </NavigationContainer>
  );
};

export default Navigations;
