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
const Title = (props) => {
    return (
        <NavigationBar
            title={props.title}
            titleStyle={{
                fontSize: moderateScale(16),
                color: "#333333"
            }}
            style={{height:px2dp(88),backgroundColor: "#fff",borderBottomWidth:props.border?1:0,borderBottomColor:'#ededed'}}
            backLabel={
                props.back? <View>
                    <TouchableOpacity onPress={props.onPressBack}>
                        <Image source={props.source?props.source:Images.back} resizeMode={'contain'} style={{paddingHorizontal:moderateScale(10),width:scale(7),height:verticalScale(14)}}/>
                    </TouchableOpacity>
                </View>:<View/>
            }
            forwardLabel={props.forward?
                <View>
                    <TouchableOpacity onPress={props.onPressForward}>
                        <Image source={props.source} resizeMode={'contain'} style={{width:scale(18),height:verticalScale(18)}}/>
                    </TouchableOpacity>
                </View>:<View/>

            }
         />
    )

};
export  default Title
