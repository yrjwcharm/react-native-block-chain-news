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
    TouchableOpacity,
    ActivityIndicator, RefreshControl
} from 'react-native'
import Title from '../../components/Title'
import StatusBarUtil from "../../utils/StatusBarUtil";
import Loading from "../../components/Loading";

let itemNo = 0;//item的个数
export default class MyComment extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            visible: false,
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
            isEmpty: false,
            userInfo: null,
        }
    }

    componentWillMount(): void {
        StatusBarUtil.setStatusBarStyle('#fff');
        store.get('userInfo').then(userInfo => {
            this.setState({userInfo}, () => {
                this._getCommentList(userInfo);
            });
        })

    }

    _getCommentList = (userInfo) => {
        let url = Config.requestUrl + Config.myComment.commentList + `?mobile=${userInfo.mobile}&pageNo=${this.state.page}`;
        fetch(url, {method: 'POST'}).then(res => res.json()).then(responseText => {
            console.log(444, responseText);
            if (responseText.code === '200') {
                const {totalCount: total, body: list} = responseText;
                let totalPage = Math.ceil(total / 10);
                this._rebuildDataByPaging(list, totalPage);
            }
        }).catch(error => {
            ErrorUtil.getErrorLog(error)
        })
    }

    componentDidMount(): void {
        //监听到设备触发返回键时，调用backForAndroid方法
        BackHandler.addEventListener('hardwareBackPress', this.backForAndroid);

    }

    _back = () => {
        // if(Platform.OS==='android'){
        //
        // }
        StatusBarUtil.setStatusBarStyle('#5691f7');
        this.props.navigation.goBack();
    }

    //在backForAndroid方法作出需要的操作
    backForAndroid = () => {
        // 发api请求/第二次按下退出应用
        StatusBarUtil.setStatusBarStyle('#5691f7');
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
        }, () => {
            if (this.state.dataArray.length === 0) {
                this.setState({isEmpty: true});
            }
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
            this._getCommentList(this.state.userInfo);
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
            this._getCommentList(this.state.userInfo);
        });
    }
    _jumpToIndustryInfoContent = (id) => {
        this.props.navigation.navigate('IndustryInfoContent', {id})
    }
    _renderItem = ({item}) => {
        console.log(444,item);
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={()=>this._jumpToIndustryInfoContent(item.id)}>
                <View style={{
                    marginTop: px2dp(20),
                    paddingHorizontal: px2dp(30),
                    backgroundColor: '#FFF',
                    height: px2dp(197 * 2),
                    justifyContent: 'center'
                }}>
                    <View>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Image source={{uri: item.commenterUserImg}}
                                       style={{borderRadius: px2dp(38), width: px2dp(76), height: px2dp(76)}}/>
                                <Text style={{
                                    fontSize: moderateScale(14),
                                    marginLeft: px2dp(28),
                                    color: "#5691f7"
                                }}>{item.commenterUsername}</Text>
                            </View>
                            <Text style={{
                                fontSize: moderateScale(11),
                                color: "#999999"
                            }}>{item.createTime}</Text>
                        </View>
                        <Text style={{
                            marginTop: px2dp(24),
                            fontSize: moderateScale(13),
                            color: "#222222"
                        }}>{item.text}</Text>
                    </View>
                    <View style={{
                        borderRadius: 1,
                        marginTop: px2dp(30),
                        backgroundColor: "#f7f7f7",
                        borderStyle: "solid",
                        borderWidth: 1,
                        paddingHorizontal: px2dp(30),
                        borderColor: "#f4f4f4", justifyContent: 'center', height: px2dp(136)
                    }}>
                        <View style={{flexDirection: 'row',}}>
                            <Image source={{uri: item.contentTypeImg}} style={{width: px2dp(128), height: px2dp(96)}}/>
                            <Text style={{
                                fontSize: moderateScale(12),
                                flex: 1,
                                marginLeft: px2dp(20),
                                color: "#8f8f8f"
                            }}>{item.contentTitle}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    // 渲染
    render() {
        const {dataArray, isEmpty} = this.state;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#f5f5f5'}}>
                <Title title={'我的评论'} source={Images.icon_back} back onPressBack={this._back}/>
                <FlatList
                    data={dataArray}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    ListFooterComponent={this._renderFooter}
                    onEndReached={this._onEndReached}
                    onEndReachedThreshold={0.1}
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
                <Loading visible={this.state.visible}/>
            </SafeAreaView>
        );
    }

}
