import React, {PureComponent} from 'react';
import {
    ScrollView,
    Dimensions,
    Linking,
    SafeAreaView,
    StyleSheet,
    DeviceEventEmitter,
    Image,
    FlatList,
    Platform,
    BackHandler,
    View,
    Text,
    TextInput,
    Alert,
    ImageBackground,
    TouchableOpacity,
    StatusBar
} from 'react-native'
export default class StatusBarUtil {
         static setStatusBarStyle(color){
             if(Platform.OS==='android'){
                 StatusBar.setBackgroundColor(color)
                 StatusBar.setNetworkActivityIndicatorVisible(true);
                 global.height = px2dp(88);
             }else{
                    //因为Rn 只提供了android 改变状态栏的背景颜色。所以ios 尽量调用原生方法。 我暂时没有写。
             }
         }

}
