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
    TouchableOpacity
} from 'react-native'
import Title from '../../components/Title'
import Loading from "../../components/Loading";
import unitConvert from "../../utils/MoneyFormat";
const {width}=Dimensions.get('window');
export default class Exchange extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state={
            dataArray:props.exchangeList,
        }

    }
    _jumpToExchangeDetail=(item)=>{
        console.log(3333,item);
        this.props.navigation.navigate('ExchangeDetail',{nameEng:item.name_eng,name:item.name});
    }
    _renderItem=({item,index})=>{
        console.log('333','ssssdgdg',item);
        const {num,unit}=unitConvert(item.twenty_four_turnover);
        let assets=num+unit;
        return(
            <TouchableOpacity onPress={()=>this._jumpToExchangeDetail(item)} activeOpacity={0.8}>
                <View style={{
                    height: px2dp(120),
                    backgroundColor:'#FFF',
                    justifyContent: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: '#ebebeb'
                }}>
                    <View style={{flexDirection: 'row',  alignItems: 'center', }}>
                        <View style={{paddingLeft:px2dp(30),flexDirection: 'row', alignItems: 'center',width:'30%',}}>
                            <View style={{
                                borderRadius: px2dp(4),
                                width: px2dp(48), height: px2dp(48),
                                backgroundColor: "transparent", justifyContent: 'center'
                            }}>
                                <Text
                                    style={{
                                        fontFamily: "PingFangSC-Regular",
                                        textAlign: 'center',
                                        color: '#999',
                                        fontSize:moderateScale(13),
                                    }}>{index+1}</Text>
                            </View>
                            <View style={{marginLeft: px2dp(12)}}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Image source={{uri:item.icon}} style={{width: px2dp(28), height: px2dp(28)}}/>
                                    <Text style={{
                                        fontFamily: "PingFangSC-Regular",
                                        fontSize: moderateScale(14),
                                        marginLeft: px2dp(6),
                                        // width:px2dp(120),
                                        color: "#222222"
                                    }}>{item.name}</Text>
                                </View>
                            </View>
                        </View>
                        <Text style={{
                            width:'30%',
                            textAlign:'right',
                            fontFamily: "PingFangSC-Regular",
                            fontSize: moderateScale(13),
                            color: "#666666"
                        }}>{assets.indexOf('元')!==-1?assets.substring(0,assets.lastIndexOf('元')):assets}</Text>
                        <Text style={{
                            textAlign:'center',
                            width:'20%',
                            fontFamily: "PingFangSC-Regular",
                            fontSize: px2dp(26),
                            color: "#666666"
                        }}>{item.transaction_num}</Text>
                        <View style={{
                            width:'20%',
                            alignItems: 'flex-end',
                            paddingRight:px2dp(30),
                        }}>
                            <View style={{
                                width:px2dp(100),
                                height:px2dp(40),
                                justifyContent:'center',
                                borderRadius: px2dp(8),
                                backgroundColor: item.twenty_four_up_down.indexOf('-')===-1?"#0c9":'#ed5345'
                            }}>
                                <Text style={{
                                    textAlign:'center',
                                    fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(11),
                                    color: "#ffffff"
                                }}>{item.twenty_four_up_down+'%'}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );

    }
    // 渲染
    render() {
        const {dataArray}=this.state;
        return (
            <View style={{flex: 1}}>
                <View style={{height: px2dp(72), backgroundColor: '#fafafa', justifyContent: 'center'}}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <Text style={{
                            width:'30%',
                            textAlign:'center',
                            fontFamily: "PingFangSC-Regular",
                            fontSize: moderateScale(13),
                            color: "#999999"
                        }}>#      交易所</Text>
                        <Text style={{
                            width:'30%',
                            textAlign:'right',
                            fontFamily: "PingFangSC-Regular",
                            fontSize: moderateScale(13),
                            color: "#999999"
                        }}>资产(￥)</Text>
                        <Text style={{
                            width:'20%',
                            textAlign:'center',
                            fontFamily: "PingFangSC-Regular",
                            fontSize: moderateScale(13),
                            color: "#999999"
                        }}>交易对</Text>
                        <Text style={{
                            width:'20%',
                            textAlign:'center',
                            fontFamily: "PingFangSC-Regular",
                            fontSize: moderateScale(13),
                            color: "#999999"
                        }}> 24H涨幅</Text>
                    </View>
                </View>
                <FlatList
                    data={dataArray}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    // ListFooterComponent={this._renderFooter}
                    // onEndReached={this._onEndReached}
                    onEndReachedThreshold={0.1}
                    refreshing={false}
                    ListEmptyComponent={
                        dataArray.length===0?<View/>:
                        <View style={{height: px2dp(554 * 2), justifyContent: 'center',}}>
                            <View style={{alignItems: 'center'}}>
                                <Image source={Images.empty} style={{width: px2dp(490), height: px2dp(300)}}/>
                                <Text style={{
                                    fontSize: moderateScale(18),
                                    fontFamily: "PingFangSC-Medium",
                                }}>空空如也哦~</Text>
                            </View>
                        </View>}
                />
            </View>
        );
    }

}
