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
export default class ClinchList extends PureComponent {
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
            time: 1,
        }
    }

    componentDidMount(): void {
        this._getRankingList();
    }

    _getRankingList = () => {
        let url = Config.requestUrl + Config.market.rankingPage.rankingList + `?key=${'turnover'}`;
        console.log(333, url);
        fetch(url, {method: 'POST'}).then(res => {
            console.log(333, res);
            return res.json()
        }).then(responseText => {
            console.log(666, responseText);
                if (responseText.code === '200') {
                    this.setState({dataArray: responseText.body});
                }
        }).catch(error => {
            Toast.fail(error);
        })
    }

    //通过分页重新构建数据
    _rebuildDataByPaging = (data, totalPage) => {
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
        if (this.state.page >= totalPage) {
            foot = 1;//listView底部显示没有更多数据了
        }
        this.setState({
            //复制数据源
            //  dataArray:this.state.dataArray.concat( responseData.results),
            dataArray: this.state.dataArray.concat(dataBlob),
            isLoading: false,
            showFoot: foot,
            totalPage,
            menuVisible: false,
            isRefreshing: false,
        });
        dataBlob = null;
    }
    //渲染FlatList 底部显示
    _renderFooter = () => {
        if (this.state.showFoot === 1) {
            return (
                <View style={{height: 30, alignItems: 'center', justifyContent: 'flex-start',}}>
                    <Text style={{
                        color: '#999999',
                        fontSize: moderateScale(14),
                        marginTop: moderateScale(5),
                        marginBottom: moderateScale(5),
                    }}>
                        没有更多数据了
                    </Text>
                </View>
            );
        } else if (this.state.showFoot === 2) {
            return (
                <View style={{
                    flexDirection: 'row',
                    height: verticalScale(24),
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: moderateScale(10)
                }}>
                    <ActivityIndicator/>
                    <Text>正在加载更多数据...</Text>
                </View>
            );
        } else if (this.state.showFoot === 0) {
            return (
                <View style={{
                    flexDirection: 'row',
                    height: verticalScale(24),
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: moderateScale(10)
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
        if ((this.state.page !== 1) && (this.state.page >= this.state.totalPage)) {
            return;
        } else {
            this.state.page++;
        }
        //底部显示正在加载更多数据
        this.setState({showFoot: 2});
        //获取数据，在componentDidMount()已经请求过数据了
        if (this.state.page > 1) {

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
                    }}>
                        <View style={{flexDirection: 'row', alignItems: 'center',width:'25%'}}>
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
                            </View>
                        </View>
                        <Text style={{
                            width:'25%',
                            fontFamily: "PingFangSC-Regular",
                            fontSize: moderateScale(13),
                            color: "#666666",
                            textAlign:'right',
                        }}>{item.maxPrice}</Text>
                        <Text style={{
                            fontFamily: "PingFangSC-Regular",
                            fontSize: px2dp(26),
                            width:'25%',
                            textAlign:'right',
                            color: "#666666"
                        }}>{item.turnoverRate}</Text>
                            <Text style={{
                                width:'25%',
                                textAlign:'right',
                                fontFamily: "PingFangSC-Regular",
                                fontSize: moderateScale(13),
                                color: "#666666"
                            }}>{item.turnover}</Text>
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
                    <View style={{flexDirection: 'row', alignItems: 'center',}}>
                        <Text style={{
                            width:'25%',
                            textAlign:'left',
                            position:'relative',
                            left:px2dp(50),
                            fontFamily: "PingFangSC-Regular",
                            fontSize: moderateScale(13),
                            color: "#999999"
                        }}>#     币种</Text>
                        <Text style={{
                            width:'25%',
                            textAlign:'right',
                            fontFamily: "PingFangSC-Regular",
                            fontSize: moderateScale(13),
                            color: "#999999"
                        }}>价格(￥)</Text>
                        <Text style={{
                            width:'25%',
                            textAlign:'right',
                            fontFamily: "PingFangSC-Regular",
                            fontSize: moderateScale(13),
                            color: "#999999"
                        }}>24H换手率</Text>
                        <Text style={{
                            width:'25%',
                            textAlign:'center',
                            fontFamily: "PingFangSC-Regular",
                            fontSize: moderateScale(13),
                            color: "#999999"
                        }}>24H成交额</Text>
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
            </View>
        );
    }

}
