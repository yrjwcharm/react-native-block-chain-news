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
    TouchableOpacity, RefreshControl
} from 'react-native'
import Title from '../../../components/Title'
import Loading from "../../../components/Loading";

export default class Throwing extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        console.log(333, props.deleteStatus);
        this.state = {
            deleteStatus: props.deleteStatus,
            visible: true,
            dataArray:[],
        }
    }

    componentWillMount(): void {
        store.get('userInfo').then(userInfo=>{
            this.setState({userInfo},()=>{
                this._getAdList(userInfo);
            });
        })
    }

    _getAdList = (userInfo) => {
        // * @param mobile
        // * @param status  0草稿、1准备投放、2正在投放、3暂停投放、4投放完成'
        let url = Config.requestUrl + Config.myAd.adList + `?mobile=${userInfo.mobile}&status=2`;
        fetch(url, {method: 'POST'}).then(res => res.json()).then(responseText => {
            console.log(333, responseText);
            if(responseText.code==='200'){
                this.setState({dataArray:responseText.body},()=>{
                    if(this.state.dataArray.length===0){
                        this.setState({isEmpty:true});
                    }
                });
            }
        }).catch(error => {
            ErrorUtil.getErrorLog(error);
        })
    }
    _renderItem = ({item}) => {
        return (
            <View style={{
                height: px2dp(165 * 2),
                backgroundColor: '#fff',
                justifyContent: 'center',
                paddingHorizontal: px2dp(30),
                borderBottomWidth: 1,
                borderBottomColor: '#ebebeb'
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <View style={{flexDirection: 'row',}}>
                        <Image source={{uri:item.attr_image_url}} style={{width: px2dp(190), height: px2dp(112)}}/>
                        <View style={{flex: 1,}}>
                            <Text style={{
                                textAlign: 'left',
                                marginLeft: px2dp(20),
                                fontSize: moderateScale(14),
                                // lineHeight: px2dp(24),
                                color: "#333333"
                            }}>
                                {item.name}
                            </Text>
                            <View style={{justifyContent: 'flex-end', flex: 1}}>
                                <View style={{
                                    flexDirection: 'row',
                                    // alignItems: 'center',
                                    marginLeft: px2dp(18),
                                    justifyContent: 'space-between'
                                }}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <View style={{
                                            backgroundColor: "#f3f7ff",
                                            borderStyle: "solid",
                                            borderWidth: 1,
                                            borderColor: "#5691f7"
                                        }}>
                                            <Text style={{
                                                fontSize: moderateScale(11),
                                                color: "#5691f7",
                                                paddingHorizontal: px2dp(8),
                                                paddingTop: px2dp(6),
                                                paddingBottom: px2dp(4),
                                            }}>{item.priceModel}</Text>
                                        </View>
                                        <Text style={{
                                            marginLeft: px2dp(20),
                                            fontSize: moderateScale(12),
                                            color: "#5691f7"
                                        }}>投放版位</Text>
                                    </View>
                                    <Text style={{
                                        fontSize: moderateScale(12),
                                        color: "#33b661"
                                    }}>正在投放</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{
                    marginTop: px2dp(56),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <View>
                        <Text style={{
                            fontSize: moderateScale(15),
                            color: "#333333"
                        }}>{item.launchCost}元</Text>
                        <Text style={{
                            marginTop: px2dp(20),
                            fontSize: moderateScale(12),
                            color: "#999999"
                        }}>投放费用</Text>
                    </View>
                    <View>
                        <Text style={{
                            fontSize: moderateScale(15),
                            color: "#333333"
                        }}>{item.launchNum}次</Text>
                        <Text style={{
                            marginTop: px2dp(20),
                            fontSize: moderateScale(12),
                            color: "#999999"
                        }}>投放总量</Text>
                    </View>
                    <View>
                        <Text style={{
                            fontSize: moderateScale(15),
                            color: "#333333"
                        }}>{item.launchNum}次</Text>
                        <Text style={{
                            marginTop: px2dp(20),
                            fontSize: moderateScale(12),
                            color: "#999999"
                        }}>待投放量</Text>
                    </View>
                </View>
            </View>
        );
    }
    _keyExtractor = (item, index) => index;
    // 渲染
    render() {
        //待审核 color: "#eea04d"  未通过 	color: "#ed5345"  已通过 color: "#33b661"
        const {deleteStatus,dataArray,isEmpty} = this.state;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#f5f5f5'}}>
                <FlatList
                    data={dataArray}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    // ListFooterComponent={this._renderFooter}
                    // onEndReached={this._onEndReached}
                    onEndReachedThreshold={0.1}
                    refreshing={false}
                    ListEmptyComponent={
                        !isEmpty ? <View/> : <View style={{height: px2dp(554 * 2), justifyContent: 'center',}}>
                            <View style={{alignItems: 'center'}}>
                                <Image source={Images.empty} style={{width: px2dp(490), height: px2dp(300)}}/>
                                <Text style={{
                                    fontSize: moderateScale(18),
                                    fontFamily: "PingFangSC-Medium",
                                }}>空空如也哦~</Text>
                            </View>
                        </View>}
                />
            </SafeAreaView>
        );
    }

}
