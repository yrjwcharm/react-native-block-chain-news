import React, {PureComponent} from 'react';
import {ScrollView,Dimensions,Linking,SafeAreaView,StyleSheet,DeviceEventEmitter,Image,FlatList,Platform,BackHandler,View,Text,TextInput,Alert,ImageBackground,TouchableOpacity} from 'react-native'
import Swiper from 'react-native-swiper'
const {width,height}=Dimensions.get('window');
export default class Guide extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
    }
    // 渲染
    render() {
        return (
            <SafeAreaView style={{flex:1}}>
                <Swiper  showsButtons={false} showsPagination={false} loop={false}>
                    <View style={{flex:1}} >
                        <Image source={Images.guide1} resizeMode={'stretch'} style={{width,height}}/>
                    </View>
                    <View style={{flex:1}}>
                        <Image source={Images.guide2} resizeMode={'stretch'} style={{width,height}}/>
                    </View>
                    <View style={{flex:1}}>
                        <Image source={Images.guide3} resizeMode={'stretch'} style={{width,height}}/>
                    </View>
                    <View style={{flex:1}}>
                        <Image source={Images.guide4} resizeMode={'stretch'} style={{width,height}}/>
                        <View style={{position:'absolute',bottom:Platform.OS==='android'?px2dp(90):px2dp(40),justifyContent:'center', flexDirection:'row',left:0,right:0,}}>
                            <TouchableOpacity activeOpacity={0.8} onPress={()=>this.props.navigation.navigate('Login')}>
                            <View style={{borderRadius:px2dp(20),width:px2dp(200),justifyContent:'center',height:px2dp(60),backgroundColor:'#3584FB'}}>
                                 <Text style={{color:'#fff',textAlign:'center',fontSize:moderateScale(14)}}>立即体验</Text>
                            </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                </Swiper>
            </SafeAreaView>
        );
    }

}
