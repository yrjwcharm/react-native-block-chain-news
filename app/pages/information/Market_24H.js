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
    Alert,
    ImageBackground,
    TouchableOpacity, ActivityIndicator
} from 'react-native'
import Title from '../../components/Title'
import Loading from "../../components/Loading";

let itemNo = 0;//item的个数
export default class Market_24H extends PureComponent {
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
        }
    }

    componentDidMount(): void {
        this._queryList();
    }
    _queryList=()=>{
        let url = Config.requestUrl + Config.informationPage.getDataList + `?channelIds=137&pageNumber=${this.state.page}`;
        fetch(url, {method: 'POST'}).then(res => res.json()).then(responseText => {
            console.log(333, responseText);
            console.log(12, responseText);
            if (responseText.code === '200') {
                // this.setState({dataArray: responseText.body});
                const list=responseText.body;
                const flag=responseText.flag;

                this._rebuildDataByPaging(list,flag);
            }
        })
    }

    _jumpToFlashDetail = (id) => {
        this.props.navigation.navigate('FlashDetail', {id})
    }
    _renderItem = ({item}) => {
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => this._jumpToFlashDetail(item.id)}>
                <View style={{paddingHorizontal: px2dp(40), backgroundColor: '#fff'}}>
                    <View style={{
                        borderLeftStyle: "solid",
                        borderLeftWidth: px2dp(2),
                        borderLeftColor: "#ebebeb",
                        paddingBottom: px2dp(38),
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            position: 'relative',
                            left: -px2dp(12.5),
                            alignItems: 'center',
                            marginTop: px2dp(38)
                        }}>
                            <Image source={Images.icon1} resizeMode={'contain'}
                                   style={{width: px2dp(26), height: px2dp(26)}}/>
                            <Text style={{
                                marginLeft:px2dp(18),
                                fontFamily: "PingFangSC-Regular",
                                fontSize: moderateScale(13),
                                color: "#5691f7"
                            }}>
                                {item.releaseDate}
                            </Text>
                        </View>
                        <Text style={{
                            marginTop: px2dp(50),
                            marginLeft: px2dp(24),
                            fontFamily: "PingFangSC-Medium",
                            fontSize: moderateScale(17),
                            color: "#333333"
                        }}>{item.title.trim()}</Text>
                        <Text style={{
                            fontFamily: "PingFangSC-Regular",
                            fontSize: moderateScale(14),
                            marginTop: px2dp(38),
                            lineHeight: px2dp(42),
                            marginLeft: px2dp(24),
                            color: "#666666"
                        }}>
                            {item.shortTitle}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
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


    // 渲染
    render() {
        const {dataArray} = this.state;
        return (
            <View style={{flex: 1}}>
                <FlatList
                    data={dataArray}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    ListFooterComponent={this._renderFooter}
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
                    //为刷新设置颜色
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this.handleRefresh.bind(this)}//因为涉及到this.state
                            colors={['#ff0000', '#00ff00', '#0000ff', '#3ad564']}
                            progressBackgroundColor="#ffffff"
                        />
                    }
                />
            </View>
        );
    }

}
