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
    TouchableOpacity, ActivityIndicator, RefreshControl
} from 'react-native'
import Title from '../../components/Title'
import {Input} from "teaset";
import Loading from "../../components/Loading";
import {StringUtils} from "../../utils";

let itemNo = 0;
export default class InfoSearchResult extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        // 初始状态
        this.state = {
            visible: true,
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
            keywords: StringUtils.isEmpty(this.props.navigation.state.params)?'':this.props.navigation.state.params.name,
            flag: false,
            isEmpty:false,
        }
    }

    componentDidMount(): void {
        this._queryList();
    }

    _queryList = () => {
        const {params} = this.props.navigation.state;
        let url = Config.requestUrl + Config.searchPage.searchList + `?channelIds=96,95,107,116,117,118,119,120&title=${this.state.keywords}`;
        fetch(url, {method: 'POST'}).then(res => res.json()).then(responseText => {
            this.setState({visible: false}, () => {
                if (responseText.code === '200') {
                    // this.setState({dataArray: responseText.body});
                    const list = responseText.body;
                    const flag = responseText.flag;

                    this._rebuildDataByPaging(list, flag);
                }
            });

        }).catch(error => {
            Toast.fail(error)
        })
    }

    _jumpToIndustryInfoContent = (id) => {
        this.props.navigation.navigate('IndustryInfoContent', {id})
    }
    _renderItem = ({item}) => {
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => this._jumpToIndustryInfoContent(item.id)}>
                <View style={{
                    height: px2dp(250),
                    backgroundColor: '#fff',
                    justifyContent: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: '#ebebeb'
                }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        // alignItems: 'center',
                        marginHorizontal: px2dp(30),

                    }}>
                        <View>
                            <Text style={{
                                fontFamily: "PingFangSC-Medium",
                                fontSize: moderateScale(16),
                                width: px2dp(195 * 2),
                                lineHeight: px2dp(42),
                                color: "#333333"
                            }}>{item.title.length > 20 ? item.title.substring(0, 20) + '...' : item.title}</Text>
                            <View style={{flex: 1, justifyContent: 'flex-end'}}>
                                <View style={{
                                    // paddingTop: px2dp(35),
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    backgroundColor: '#fff',
                                    marginRight: px2dp(15),
                                    alignItems: 'center',
                                    // paddingRight: px2dp(15)
                                }}>
                                    <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                        <Text style={{
                                            fontFamily: "PingFangSC-Regular",
                                            fontSize: moderateScale(12),
                                            color: "#999999"
                                        }}>{item.author.substring(0, 5)}</Text>
                                        <Text style={{
                                            marginLeft: px2dp(20),
                                            fontFamily: "PingFangSC-Regular",
                                            fontSize: moderateScale(12),
                                            color: "#999999"
                                        }}>{item.releaseDate.substring(item.releaseDate.indexOf('-') + 1, item.releaseDate.lastIndexOf(':'))}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Image source={Images.eyes} style={{width: px2dp(32), height: px2dp(20)}}/>
                                        <Text style={{
                                            marginLeft: px2dp(14),
                                            fontSize: moderateScale(13),
                                            color: "#999999"
                                        }}>{item.views}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <Image source={{uri: item.typeImg}} resizeMode={'stretch'}
                               style={{height: px2dp(81 * 2), width: px2dp(135 * 2)}}/>
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
        },()=>{
            if(this.state.dataArray.length===0){
                this.setState({isEmpty:true});
            }
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
    _cancel = () => {
        this.props.navigation.goBack('Main');
    }
    _onSubmitEdit = () => {
        this.setState({visible:true,dataArray:[],isEmpty:false},()=>{
            this._queryList();
        });

    }

    // 渲染
    render() {
        const {isEmpty,dataArray} = this.state;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#f5f5f5'}}>
                <View style={{
                    paddingTop: px2dp(52),
                    paddingBottom: px2dp(30),
                    paddingHorizontal: px2dp(30),
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#FFF',
                    justifyContent: 'space-between'
                }}>
                    <View style={{
                        paddingLeft: px2dp(14),
                        height: px2dp(64),
                        flexDirection: 'row',
                        flex: 1,
                        alignItems: 'center',
                        borderRadius: px2dp(8),
                        backgroundColor: '#f5f5f5'
                    }}>
                        <Image source={Images._search_}
                               style={{width: px2dp(32), height: px2dp(32), marginRight: px2dp(14)}}/>
                        <Input style={{
                            fontFamily: "PingFangSC-Regular",
                            fontSize: moderateScale(14),
                            color: "#999999", flex: 1, height: px2dp(64), borderWidth: 0, backgroundColor: 'transparent'
                        }} placeholder="Search" onChangeText={(keywords) => {
                            this.setState({keywords});
                        }} onSubmitEditing={this._onSubmitEdit}/>
                    </View>
                    <TouchableOpacity onPress={this._cancel}>
                        <Text style={{
                            fontFamily: "PingFangSC-Regular",
                            fontSize: moderateScale(16),
                            marginLeft: px2dp(30),
                            color: "#5691f7"
                        }}>取消</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={dataArray}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    ListFooterComponent={this._renderFooter}
                    onEndReached={this._onEndReached}
                    onEndReachedThreshold={0.1}
                    refreshing={false}
                    ListEmptyComponent={
                        !isEmpty?<View/>:<View style={{height: px2dp(554 * 2), justifyContent: 'center',}}>
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
