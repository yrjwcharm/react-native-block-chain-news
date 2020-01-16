/**
 * Created by Rabbit 下午6:40
 */

import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    Platform, StatusBar
} from 'react-native';
import { NavigationBar,Slider } from 'beeshell';
const Title1 = (props) => {
    return (
        <NavigationBar
            title={props.title}
            titleStyle={{
                fontSize: moderateScale(16),
                color:"#333"
            }}
            style={{height:px2dp(88),backgroundColor: "#fff",borderBottomWidth:props.border?1:0,borderBottomColor:'#ededed'}}
            backLabel={
                props.back? <View>
                    <TouchableOpacity onPress={props.onPressBack}>
                        <Image source={Images.icon_back} resizeMode={'contain'} style={{paddingHorizontal:moderateScale(10),width:scale(7),height:verticalScale(14)}}/>
                    </TouchableOpacity>
                </View>:<View/>
            }
            forwardLabel={props.forward?
                <TouchableOpacity onPress={props.onPressForward} activeOpacity={0.8}>
                    <Text style={{
                        fontSize: moderateScale(13),
                        lineHeight: 30,
                        color: "#333333",
                        paddingLeft:moderateScale(10),paddingRight:moderateScale(6),paddingTop:moderateScale(6),paddingBottom:moderateScale(7)}}>{props.forwardLabelText}</Text>
                </TouchableOpacity>
               :<View/>

            }
        />
    )

};
export  default  Title1;
