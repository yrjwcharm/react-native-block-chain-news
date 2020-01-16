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
                fontSize: moderateScale(18),
                color: "#333"
            }}
            style={{height:verticalScale(44),backgroundColor: "#F8F8FA",
                shadowColor: "rgba(0, 0, 0, 0.08)",
                shadowOffset: {
                    width: 0,
                    height: verticalScale(5)
                },
                shadowRadius: moderateScale(10),
                shadowOpacity: 1,borderBottomWidth:StyleSheet.hairlineWidth,borderBottomColor:'#c6c6c6'}}
            backLabel={
                props.back? <View>
                    <TouchableOpacity onPress={props.onPressBack}>
                        <Image source={Images.back} resizeMode={'contain'} style={{paddingHorizontal:moderateScale(10),width:scale(7),height:verticalScale(14)}}/>
                    </TouchableOpacity>
                </View>:<View/>
            }
            forwardLabel={props.forward?
                <TouchableOpacity onPress={props.onPressForward} activeOpacity={0.8}>
                    <View style={{
                        opacity: 0.3,
                        borderRadius: scale(3),
                        backgroundColor: "transparent",
                        borderStyle: "solid",
                        borderWidth: scale(1),
                        borderColor: "#d7d7d7",
                    }}>
                        <Text style={{
                            fontSize: moderateScale(13),
                            color: "#666666",paddingLeft:moderateScale(10),paddingRight:moderateScale(6),paddingTop:moderateScale(6),paddingBottom:moderateScale(7)}}>完成</Text>

                    </View>
                </TouchableOpacity>:<View/>

            }
        />
    )

};
export  default Title
