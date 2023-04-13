import { Dimensions } from 'react-native';
const fullHeight = Dimensions.get('screen').height;
const heightRef = fullHeight / 820;
const fontRef = fullHeight / 820;
const fullWidth = Dimensions.get('screen').width;
const widthRef = fullWidth / 375;
export { fullWidth, fullHeight, heightRef, widthRef, fontRef };
