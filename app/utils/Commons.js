import {Platform, Dimensions, I18nManager} from 'react-native';

const {height, width} = Dimensions.get('window');

export const isRTL = I18nManager.isRTL;
export const isAndroid = Platform.OS === 'android';
export const isIos = Platform.OS === 'ios';
export const screenWidth = width;
export const screenHeight = height;
