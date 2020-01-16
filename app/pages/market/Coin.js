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
import ReconnectingWebSocket from 'react-native-reconnecting-websocket'
import unitConvert from '../../utils/MoneyFormat';

const {width} = Dimensions.get('window')
export default class Coin extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            dataArray: this.props.currencyList,
        }
    }

    componentDidMount(): void {

    }

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        console.log(666, nextProps);
    }

    _jumpToCoinDetail = (item) => {
        console.log(888,item);
        this.props.navigation.navigate('CoinDetail', {name_ch:item.fullname,name:item.name,code:item.code});
    }
    _renderItem = ({item, index}) => {
        const {num, unit} = unitConvert(item.marketValue);
        let marketValue = num + unit;
        return (
            <TouchableOpacity onPress={() => this._jumpToCoinDetail(item)} activeOpacity={0.8}>
                <View style={{
                    height: px2dp(120),
                    justifyContent: 'center',
                    backgroundColor: '#FFF',
                    borderBottomWidth: 1,
                    borderBottomColor: '#ebebeb'
                }}>
                    <View style={{flexDirection: 'row', alignItems: 'center',}}>
                        <View style={{ paddingLeft:px2dp(30),flexDirection: 'row', alignItems: 'center', width: width / 4,}}>
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
                                    }}>{index + 1}</Text>
                            </View>
                            <View style={{marginLeft: px2dp(20)}}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Image source={{uri: item.logo}} style={{width: px2dp(28), height: px2dp(28)}}/>
                                    <Text style={{
                                        fontFamily: "PingFangSC-Regular",
                                        fontSize: moderateScale(14),
                                        marginLeft: px2dp(6),
                                        color: "#222222"
                                    }}>{item.name}</Text>
                                </View>
                                <Text style={{
                                    marginTop: px2dp(10), fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(10),
                                    color: "#999999"
                                }}>{item.fullname}</Text>
                            </View>
                        </View>
                        <Text style={{
                            width: width / 4,
                            textAlign: 'right',
                            fontFamily: "PingFangSC-Regular",
                            fontSize: moderateScale(13),
                            color: "#666666"
                        }}>{marketValue.indexOf('元')!==-1?marketValue.substring(0,marketValue.lastIndexOf('元')):marketValue}</Text>
                        <Text style={{
                            width: width / 4,
                            textAlign: 'right',
                            fontFamily: "PingFangSC-Regular",
                            fontSize: px2dp(26),
                            color: "#666666"
                        }}>{item.price}</Text>
                        <View style={{
                            width: width / 4,
                            alignItems: 'flex-end',
                            paddingRight:px2dp(30),
                        }}>
                            <View style={{
                                width:px2dp(100),
                                borderRadius: px2dp(8),
                                height:px2dp(40),
                                justifyContent:'center',
                                backgroundColor: item.gain.indexOf('-') === -1 ? "#0c9" : '#ed5345'
                            }}>
                                <Text style={{
                                    textAlign:'center',
                                    fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(11),
                                    color: "#ffffff"
                                }}>{item.gain.indexOf('-') === -1 ? '+' + item.gain + '%' : item.gain + '%'}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    // 渲染
    render() {
        const {dataArray} = this.state;
        return (
            <View style={{flex: 1}}>
                <View style={{height: px2dp(72), backgroundColor: '#fafafa', justifyContent: 'center'}}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <Text style={{
                            width:width/4,
                            textAlign:'center',
                            fontFamily: "PingFangSC-Regular",
                            fontSize: moderateScale(13),
                            color: "#999999"
                        }}>#    币种</Text>
                        <Text style={{
                            width:width/4,
                            textAlign:'right',
                            fontFamily: "PingFangSC-Regular",
                            fontSize: moderateScale(13),
                            color: "#999999"
                        }}>流通市值(￥)</Text>
                        <Text style={{
                            width:width/4,
                            textAlign:'right',
                            fontFamily: "PingFangSC-Regular",
                            fontSize: moderateScale(13),
                            color: "#999999"
                        }}>价格(￥)</Text>
                        <Text style={{
                            width:width/4,
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
