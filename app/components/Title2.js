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
            style={{height:px2dp(88),backgroundColor: "#fff",}}
            backLabel={
                props.back? <View>
                    <TouchableOpacity onPress={props.onPressBack}>
                        <Image source={Images.back} style={{paddingHorizontal:moderateScale(10),width:scale(7),height:verticalScale(14)}}/>
                    </TouchableOpacity>
                </View>:<View/>
            }
            forwardLabel={props.forward?
                <View>
                    <TouchableOpacity onPress={props.onPressForward}>
                        <Image source={Images.settings} resizeMode={'contain'} style={{width:scale(18),height:verticalScale(17)}}/>
                    </TouchableOpacity>
                </View>:<View/>

            }
         />
    )

};
export  default Title
