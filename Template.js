import React, {PureComponent} from 'react';
import {ScrollView,Dimensions,Linking,SafeAreaView,StyleSheet,DeviceEventEmitter,Image,FlatList,Platform,BackHandler,View,Text,TextInput,Alert,ImageBackground,TouchableOpacity} from 'react-native'
import Title from '../../components/Title'
export default class Template extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
    }
    // 渲染
    render() {
        return (
            <SafeAreaView style={{flex:1,backgroundColor:'#f5f5f5'}}>

            </SafeAreaView>
        );
    }

}
