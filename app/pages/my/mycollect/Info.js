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
    ActivityIndicator,
    RefreshControl
} from 'react-native'
import Loading from "../../../components/Loading";

const {width} = Dimensions.get('window');
let itemNo = 0;
export default class Info extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            deleteStatus: props.deleteStatus,
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
            isEmpty: false,
            userInfo: null,
            isAllSelect: false,
            count: 0,
        }
    }

    componentWillMount(): void {
        store.get('userInfo').then(userInfo => {
            this.setState({userInfo}, () => {
                this._getCollectInfoList(userInfo);
            });
        })
    }

    _getCollectInfoList = (userInfo) => {
        let url = Config.requestUrl + Config.myCollect.collectList + `?mobile=${userInfo.mobile}&pageNo=${this.state.page}&channelId=75`;
        console.log(999, url);
        fetch(url, {method: 'POST'}).then(res => res.json()).then(responseText => {
            console.log(323, responseText);
            this.setState({visible:false},()=>{
                if(responseText.code==='200'){
                    const {totalCount: total, body: list} = responseText;
                    let rows = [];
                    list&&list.map(item => {
                        rows.push({...item, checked: false})
                    })
                    let totalPage = Math.ceil(total / 10);
                    this._rebuildDataByPaging(rows, totalPage);
                }
            });

        }).catch(error => {
            ErrorUtil.getErrorLog(error);
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
            this._getCollectInfoList(this.state.userInfo)
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
            this._getCollectInfoList(this.state.userInfo)
        });
    }
    _allSelect = () => {
        this.setState({isAllSelect: !this.state.isAllSelect}, () => {
            if (this.state.isAllSelect) {
                this.state.dataArray.map(item => {
                    item.checked = true
                });
                this.setState({
                    dataArray: [
                        ...this.state.dataArray,
                    ]
                }, () => {
                    let count = 0;
                    const {dataArray} = this.state;
                    for (let i = 0; i < dataArray.length; i++) {
                        if (dataArray[i].checked) {
                            count++;
                        }
                    }
                    this.setState({count});
                });
            } else {
                this.state.dataArray.map(item => {
                    item.checked = false
                });
                this.setState({
                    dataArray: [
                        ...this.state.dataArray,
                    ]
                }, () => {
                    let count = 0;
                    const {dataArray} = this.state;
                    for (let i = 0; i < dataArray.length; i++) {
                        if (dataArray[i].checked) {
                            count++;
                        }
                    }
                    this.setState({count});
                });
            }
        });
    }
    _multiSelect = (checked, items: {}) => {
        console.log(333, '走了');
        this.state.dataArray.map(item => {
            if (JSON.stringify(items) === JSON.stringify(item)) {
                item.checked = !checked;
            }
        });
        this.setState({
            dataArray: [
                ...this.state.dataArray,
            ]
        }, () => {
            let count = 0;
            const {dataArray} = this.state;
            for (let i = 0; i < dataArray.length; i++) {
                if (dataArray[i].checked) {
                    count++;
                }
            }
            this.setState({count}, () => {
                const {dataArray, count} = this.state;
                if (count === dataArray.length) {
                    this.setState({isAllSelect: true});
                } else {
                    this.setState({isAllSelect: false});
                }
            });
        });
        console.log(444, this.state.dataArray);
    }
    _cancel = () => {
        const {dataArray} = this.state;
        console.log(555, dataArray);
        let ids = [], splitIds = '';
        for (let i = 0; i < dataArray.length; i++) {
            if (dataArray[i].checked) {
                ids.push(String(dataArray[i].id));
            }
        }
        console.log(41444, ids);
        if (ids.length === 0) {
            Toast.info('请选择收藏列表');
            return;
        }
        for (let i = 0; i < ids.length; i++) {
            splitIds += ids[i] + ','
        }
        splitIds = splitIds.substring(0, splitIds.lastIndexOf(','));
        console.log('read', splitIds);
        Alert.alert(
            '取消收藏',
            '确定要取消当前收藏吗？',
            [
                // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {
                    text: 'OK', onPress: () => {
                        this._cancelCollect(ids, splitIds)
                    }
                },
            ],
            {cancelable: false}
        )
    }
    _cancelCollect = (ids, splitIds) => {
        const {mobile} = this.state.userInfo;
        this.setState({visible: true}, () => {
            let url = Config.requestUrl + Config.myCollect.cancelCollect + `&mobile=${mobile}&ids=${splitIds}`;
            console.log(666, url);
            fetch(url, {method: 'POST'}).then(res => {
                console.log(987, res);
                return res.json()
            }).then(responseText => {
                console.log(666, responseText);
                this.setState({visible: false}, () => {
                    if (responseText.code === '200') {
                        Toast.message(responseText.message);
                        this.setState({page: 1, dataArray: [], count: 0, isAllSelect: false}, () => {
                            this._getCollectInfoList(this.state.userInfo);
                        });
                    } else {
                        Toast.message(responseText.message);
                    }
                });

            }).catch(error => {
                ErrorUtil.getErrorLog(error)
            })
        });

    }
    _renderItem = ({item}) => {
        return (
            <View style={{
                height: px2dp(250),
                backgroundColor: '#fff',
                justifyContent: 'center',
                borderBottomWidth: 1,
                borderBottomColor: '#ebebeb'
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginHorizontal: px2dp(30),
                    justifyContent: 'space-between'
                }}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => this._multiSelect(item.checked, item)}>
                        {this.state.deleteStatus ? <Image source={item.checked ? Images.selected : Images.select}
                                                          style={{width: px2dp(32), height: px2dp(32)}}/> :
                            <View/>}
                    </TouchableOpacity>
                    <View style={{
                        flexDirection: 'row',
                        // justifyContent: 'space-between',
                        alignItems: 'center',
                        marginLeft: this.state.deleteStatus ? px2dp(30) : 0
                        // marginHorizontal: px2dp(30),

                    }}>
                        <View style={{flex: 1}}>
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
                                        }}>{item.author.substring(0,5)}</Text>
                                        <Text style={{
                                            marginLeft: px2dp(20),
                                            fontFamily: "PingFangSC-Regular",
                                            fontSize: moderateScale(12),
                                            color: "#999999"
                                        }}>{item.releaseDate.substring(item.releaseDate.indexOf('-') + 1, item.releaseDate.lastIndexOf(':'))}</Text>
                                    </View>
                                    {/*<View style={{flexDirection: 'row', alignItems: 'center'}}>*/}
                                    {/*    <Image source={Images.eyes} style={{width: px2dp(32), height: px2dp(20)}}/>*/}
                                    {/*    <Text style={{*/}
                                    {/*        marginLeft: px2dp(14),*/}
                                    {/*        fontSize: moderateScale(13),*/}
                                    {/*        color: "#999999"*/}
                                    {/*    }}>{item.views}</Text>*/}
                                    {/*</View>*/}
                                </View>
                            </View>
                        </View>
                        <Image source={{uri:item.typeImg}} resizeMode={'stretch'}
                               style={{height: px2dp(81 * 2), width: px2dp(135 * 2)}}/>
                    </View>
                </View>
            </View>
        );
    }

    // 渲染
    render() {
        const {deleteStatus, isAllSelect, dataArray, isEmpty,count} = this.state;
        console.log(333, deleteStatus);
        return (
            <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
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
                {deleteStatus ? <View style={{
                    position: 'absolute', zIndex: 1, bottom: 0,
                    width,
                    height: px2dp(98), justifyContent: 'center',
                    backgroundColor: '#fff',
                }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginHorizontal: px2dp(30)
                    }}>
                        <TouchableOpacity onPress={this._allSelect} activeOpacity={.75}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Image resizeMode={'contain'} source={isAllSelect ? Images.selected : Images.select}
                                       style={{width: px2dp(32), height: px2dp(32)}}/>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{
                                        marginLeft: px2dp(20),
                                        fontSize: moderateScale(13),
                                        color: "#666666"
                                    }}>已选</Text>
                                    <Text style={{
                                        color: '#ff2c2d',
                                        fontSize: moderateScale(13),
                                    }}>{count}</Text>
                                    <Text style={{
                                        fontSize: moderateScale(13),
                                        color: "#666666"
                                    }}>条</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} onPress={this._cancel}>
                            <View style={{
                                borderRadius: px2dp(10),
                                borderStyle: "solid",
                                borderWidth: 1,
                                borderColor: "#5691f7",
                            }}>
                                <Text style={{
                                    fontSize: moderateScale(17),
                                    color: "#5691f7",
                                    paddingHorizontal: px2dp(28),
                                    paddingVertical: px2dp(14),
                                }}>
                                    取消收藏
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View> : <View/>}
                <Loading visible={this.state.visible}/>
            </View>
        );
    }

}
