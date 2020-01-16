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
export default class ErrorUtil {
         static getErrorLog(error){
           __DEV__ ? console.error("Error",error.message) : console.log("Err",error.message);
         }

}
