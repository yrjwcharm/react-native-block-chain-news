import React, {PureComponent} from 'react';
import {
    ScrollView,
    RefreshControl,
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
    ActivityIndicator,
    Alert,
    ImageBackground,
    TouchableOpacity
} from 'react-native'
import Title from '../../components/Title'
import Loading from "../../components/Loading";

let itemNo = 0;//item的个数
export default class GainsList extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            totalPage: 0,
            //上拉加载更多 下拉刷新
            page: 1,
            isLoading: true,
            //网络请求状态
            error: false,
            errorInfo: "",
            dataArray: [],
            showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            isRefreshing: false,//下拉控制
            menuVisible: false,
            selectedIndex: 0,
            taskGoalList: [],
            taskGoalId: '',
            flag: false,
            time: 1,
            visible: true,
            selected1: true,
            selected2: false,
            selected3: false,

        }
    }

    componentDidMount(): void {
        this._queryList();
    }

    _queryList = () => {
        let url = Config.requestUrl + Config.market.rankingPage.rankingList + `?key=${'rise'}&time=${this.state.time}`;
        console.log(333, url);
        fetch(url, {method: 'POST'}).then(res => {
            console.log(333, res);
            return res.json()
        }).then(responseText => {
            console.log(666, responseText);
            this.setState({visible: false}, () => {
                if (responseText.code === '200') {
                    this.setState({dataArray: responseText.body});
                }
            });

        }).catch(error => {
            Toast.fail(error);
        })
    }

    //通过分页重新构建数据
    _rebuildDataByPaging = (data, flag) => {
        let dataBlob = [];//这是创建该数组，目的放存在key值的数据，就不会报黄灯了
        let i = itemNo;
        data && data.map(function (item) {
            dataBlob.push({
                ...item
            })
            i++;
        });
        itemNo = i;
        let foot = 0;
        if (!flag) {
            foot = 1;//listView底部显示没有更多数据了
        }
        this.setState({
            //复制数据源
            //  dataArray:this.state.dataArray.concat( responseData.results),
            dataArray: this.state.dataArray.concat(dataBlob),
            isLoading: false,
            showFoot: foot,
            flag,
            isRefreshing: false,
        });
        dataBlob = null;
    }
    //渲染FlatList 底部显示
    _renderFooter = () => {
        if (this.state.showFoot === 1) {
            return (
                <View style={{height: px2dp(60), alignItems: 'center', justifyContent: 'flex-start',}}>
                    <Text style={{
                        color: '#999999',
                        fontSize: moderateScale(14),
                        marginTop: px2dp(10),
                        marginBottom: px2dp(10),
                    }}>
                        没有更多数据了
                    </Text>
                </View>
            );
        } else if (this.state.showFoot === 2) {
            return (
                <View style={{
                    flexDirection: 'row',
                    height: px2dp(48),
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: px2dp(20)
                }}>
                    <ActivityIndicator/>
                    <Text>正在加载更多数据...</Text>
                </View>
            );
        } else if (this.state.showFoot === 0) {
            return (
                <View style={{
                    flexDirection: 'row',
                    height: px2dp(48),
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: px2dp(20)
                }}/>

            );
        }
    }
    //上拉加载时触发
    _onEndReached = () => {
        //如果是正在加载中或没有更多数据了，则返回
        if (this.state.showFoot !== 0) {
            return;
        }
        //如果当前页大于或等于总页数，那就是到最后一页了，返回
        if ((this.state.page !== 1) && (!this.state.flag)) {
            console.log(34343, this.state.flag);
            return;
        } else {
            this.state.page++;
        }
        //底部显示正在加载更多数据
        this.setState({showFoot: 2});
        //获取数据，在componentDidMount()已经请求过数据了
        if (this.state.page > 1) {
            this._queryList();
        }
    }
    _keyExtractor = (item, index) => index;
    // 渲染
    handleRefresh = () => {
        this.setState({
            page: 1,
            isRefreshing: true,//tag,下拉刷新中，加载完全，就设置成flase
            dataArray: []
        }, () => {
            this._queryList();
        });
    }
    _jumpToCoinDetail = (code) => {
        this.props.navigation.navigate('CoinDetail', {code});
    }
    _renderItem = ({item, index}) => {
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => this._jumpToCoinDetail(item.code)}>
                <View style={{
                    height: px2dp(120),
                    backgroundColor: '#FFF',
                    justifyContent: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: '#ebebeb'
                }}>
                    <View style={{
                        flexDirection: 'row',
                        paddingHorizontal: px2dp(30),
                        alignItems: 'center',
                        // justifyContent: 'space-between',
                    }}>
                        <View style={{flexDirection: 'row', alignItems: 'center', width: '30%'}}>
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
                                        fontSize: moderateScale(13),
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
                            </View>
                        </View>
                        <Text style={{
                            width: '25%',
                            textAlign: 'right',
                            fontFamily: "PingFangSC-Regular",
                            fontSize: moderateScale(13),
                            color: "#666666"
                        }}>{item.maxPrice}</Text>
                        <Text style={{
                            width: '25%',
                            textAlign: 'right',
                            fontFamily: "PingFangSC-Regular",
                            fontSize: moderateScale(13),
                            color: "#666666"
                        }}>{item.minPrice}</Text>
                        <View style={{
                            flexDirection:'row',
                            width: '20%',
                            justifyContent:'flex-end',
                        }}>
                            <View style={{
                                borderRadius: px2dp(8),
                                backgroundColor: item.gain.indexOf('-') === -1 ? "#0c9" : '#ed5345'
                            }}>
                                <Text style={{
                                    fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(11),
                                    paddingVertical: px2dp(11),
                                    paddingHorizontal: px2dp(14),
                                    color: "#ffffff"
                                }}>{item.gain}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );

    }
    _choice1Hour = () => {
        this.setState({selected1: true, selected2: false, selected3: false, time: 1}, () => {
            this._queryList();
        });
    }
    _choice24Hour = () => {
        this.setState({selected2: true, selected1: false, selected3: false, time: 24}, () => {
            this._queryList();
        });
    }
    _choice7Day = () => {
        this.setState({selected3: true, selected2: false, selected1: false, time: 7}, () => {
            this._queryList();
        });
    }

    // 渲染
    render() {
        const {dataArray, selected1, selected2, selected3} = this.state;
        return (
            <View style={{flex: 1}}>
                <View style={{backgroundColor: '#fff', height: px2dp(100), justifyContent: 'center'}}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <TouchableOpacity activeOpacity={0.8} onPress={this._choice1Hour}>
                            <View style={{
                                borderRadius: px2dp(8),
                                backgroundColor: selected1 ? "rgba(86,145,247,0.1)" : '#fff',
                            }}>
                                <Text style={{
                                    fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(13),
                                    color: selected1 ? "#5691f7" : '#666',
                                    paddingLeft: px2dp(32),
                                    paddingRight: px2dp(30),
                                    paddingVertical: px2dp(15),
                                }}>1小时</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} onPress={this._choice24Hour}>
                            <View style={{
                                borderRadius: px2dp(8),
                                backgroundColor: selected2 ? "rgba(86,145,247,0.1)" : '#fff',
                            }}>
                                <Text style={{
                                    fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(13),
                                    color: selected2 ? "#5691f7" : '#666',
                                    paddingLeft: px2dp(32),
                                    paddingRight: px2dp(30),
                                    paddingVertical: px2dp(15),
                                }}>24小时</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} onPress={this._choice7Day}>
                            <View style={{
                                borderRadius: px2dp(8),
                                backgroundColor: selected3 ? "rgba(86,145,247,0.1)" : '#fff',
                            }}>
                                <Text style={{
                                    fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(13),
                                    color: selected3 ? "#5691f7" : '#666',
                                    paddingLeft: px2dp(32),
                                    paddingRight: px2dp(30),
                                    paddingVertical: px2dp(15),
                                }}>近7天</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{height: px2dp(72), backgroundColor: '#fafafa', justifyContent: 'center'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center',}}>
                        <Text style={{
                            width: '30%',
                            textAlign: 'left',
                            position:'relative',
                            left:px2dp(50),
                            zIndex:1,
                            fontFamily: "PingFangSC-Regular",
                            fontSize: moderateScale(13),
                            color: "#999999"
                        }}>#       币种</Text>
                        <Text style={{
                            width: '25%',
                            textAlign: 'right',
                            fontFamily: "PingFangSC-Regular",
                            fontSize: moderateScale(13),
                            color: "#999999"
                        }}>24H高(￥)</Text>
                        <Text style={{
                            width: '25%',
                            textAlign: 'right',
                            fontFamily: "PingFangSC-Regular",
                            fontSize: moderateScale(13),
                            color: "#999999"
                        }}>24H低(￥)</Text>
                        <Text style={{
                            width: '20%',
                            textAlign: 'center',
                            fontFamily: "PingFangSC-Regular",
                            fontSize: moderateScale(13),
                            color: "#999999"
                        }}>{selected1 ? '1H涨幅' : selected2 ? '24H涨幅' : '7D涨幅'}</Text>
                    </View>
                </View>
                <FlatList
                    data={dataArray}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    // ListFooterComponent={this._renderFooter}
                    onEndReached={this._onEndReached}
                    onEndReachedThreshold={0.1}
                    refreshing={true}
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
                    // //为刷新设置颜色
                    // refreshControl={
                    //     <RefreshControl
                    //         refreshing={this.state.isRefreshing}
                    //         onRefresh={this.handleRefresh.bind(this)}//因为涉及到this.state
                    //         colors={['#ff0000', '#00ff00', '#0000ff', '#3ad564']}
                    //         progressBackgroundColor="#ffffff"
                    //     />
                    // }
                />
                <Loading visible={this.state.visible}/>
            </View>
        );
    }

}
