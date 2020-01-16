/**
 * Created by Rabbit 下午6:40
 */

import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
const Menu=(props)=>{
    return(
        <View style={{backgroundColor:'#fff',height:props.height?props.height:px2dp(120)}}>
            <View style={{marginLeft:px2dp(34),marginRight:px2dp(36),marginTop:px2dp(38),justifyContent:'space-between',flexDirection:'row',alignItems:'center',}}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Image resizeMode={'contain'}source={props.source} style={{width:px2dp(60),height:px2dp(60)}}/>
                    <Text style={{marginLeft:px2dp(18),color:props.titleColor?props.titleColor:'#333',fontSize:px2dp(28)}}>{props.title}</Text>
                </View>
                <TouchableOpacity activeOpacity={0.8} onPress={props.onPress}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Text style={{color:props.detailColor?props.detailColor:'#666',fontSize:px2dp(26),marginRight:px2dp(20)}}>{props.detail}</Text>
                    {props.arrow===`show`?<Icon name={'ios-arrow-forward'} color={props.iconColor?props.iconColor:'#666'} size={20}/>:null}
                </View>
                </TouchableOpacity>
            </View>
            <View style={{marginTop:px2dp(20),marginLeft:px2dp(112),borderBottomWidth:props.border?px2dp(2):0,borderBottomColor:props.borderBottomColor?props.borderBottomColor:'#e0e0e0'}}/>
        </View>

    );
}
export  default Menu
