import React from 'react';
import {AppRegistry, StatusBar,Dimensions} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { scaleSize} from '../utils/ScreenUtil';
import Image from '../resources/Image';
import store from 'react-native-simple-store';
import ErrorUtil  from '../utils/ErrorUtil'
//判断是不是iphonex
import {Toast} from 'teaset'
import Config from './Config';
let {height, width} = Dimensions.get('window');
global.px2dp = scaleSize;
global.scale=scale;
 global.verticalScale=verticalScale;
 global.moderateScale=moderateScale;
// 获取屏幕宽度
global.SCREEN_WIDTH = width;
// 获取屏幕高度
global.SCREEN_HEIGHT = height;
// 通过系统API获得屏幕宽高
global.Config=Config;
global.Toast=Toast;
global.Images=Image;
global.store=store;
global.ErrorUtil = ErrorUtil;





