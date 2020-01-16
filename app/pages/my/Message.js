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
    ActivityIndicator,
    RefreshControl,
    ImageBackground,
    Alert,
    TouchableOpacity, StatusBar
} from 'react-native'
import Title from '../../components/Title1'
import {NavigationActions, StackActions} from "react-navigation";
import StatusBarUtil from "../../utils/StatusBarUtil";
import Loading from "../../components/Loading";
import Dialog from "react-native-dialog";

const {width} = Dimensions.get('window')
let itemNo = 0;//item的个数
export default class Message extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            deleteStatus: false,
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
        StatusBarUtil.setStatusBarStyle('#fff');
        store.get('userInfo').then(userInfo => {
            this.setState({userInfo}, () => {
                this._getMessageList(userInfo);
            });
        })
    }

    _getMessageList = (userInfo) => {
        // * @param Integer pageNo
        // * @param mobile
        // * @param boolean status 信件状态 0未读，1已读
        let url = Config.requestUrl + Config.siteMsgPage.getSiteMsgList + `?mobile=${userInfo.mobile}&pageNo=${this.state.page}`;
        fetch(url, {method: 'POST'}).then(res => {
            console.log(732, res);
            return res.json()
        }).then(responseText => {
            console.log(444, responseText);
            this.setState({visible: false}, () => {
                if (responseText.code === '200') {
                    const {totalCount: total, body: list} = responseText;
                    let rows = [];
                    list && list.map(item => {
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


    componentDidMount(): void {
        //监听到设备触发返回键时，调用backForAndroid方法
        this.refreshMessageListListener = DeviceEventEmitter.addListener('refreshMessageList', (result) => {
           if(result){
               this.setState({dataArray:[],page:1},()=>{
                   this._getMessageList(this.state.userInfo);
               });
           }
        })
        BackHandler.addEventListener('hardwareBackPress', this.backForAndroid);

    }

    componentWillUnmount(): void {
        this.refreshMessageListListener&&this.refreshMessageListListener.remove();
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
        StatusBarUtil.setStatusBarStyle('#5691f7')
    }
    _onPressForward = () => {
        this.setState({deleteStatus: !this.state.deleteStatus});
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
            this._getMessageList(this.state.userInfo)
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
            this._getMessageList(this.state.userInfo)
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
    _jumpToMessageDetail = (id) => {
        this.props.navigation.navigate("MessageDetail", {id})
    }

    _renderItem = ({item}) => {
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => this._jumpToMessageDetail(item.id)}>
                <View style={{
                    justifyContent: 'center',
                    height: px2dp(88 * 2),
                    marginTop: px2dp(24),
                    paddingHorizontal: px2dp(30),
                    backgroundColor: '#fff'
                }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => this._multiSelect(item.checked, item)}>
                            {this.state.deleteStatus ? <Image source={item.checked ? Images.selected : Images.select}
                                                              style={{width: px2dp(32), height: px2dp(32)}}/> :
                                <View/>}
                        </TouchableOpacity>
                        <View style={{marginLeft: this.state.deleteStatus ? px2dp(30) : 0}}>
                            <View style={{
                                width: px2dp(12),
                                height: px2dp(12),
                                borderRadius: px2dp(6),
                                backgroundColor: item.msgStatus ? "#ff4a45" : "#999"
                            }}/>
                        </View>
                        <View style={{marginLeft: px2dp(36)}}>
                            <Text style={{
                                fontSize: moderateScale(14),
                                color: "#333333"
                            }}>{item.msgTitle}</Text>
                            <Text style={{
                                marginTop: px2dp(24),
                                fontSize: moderateScale(11),
                                lineHeight: px2dp(30),
                                color: "#999999"
                            }}>
                                {item.sendTime}
                            </Text>
                        </View>
                    </View>

                </View>
            </TouchableOpacity>
        );

    }
    _markAsRead = () => {
        const {dataArray} = this.state;
        console.log(555, dataArray);
        const {mobile} = this.state.userInfo;
        let ids = [], splitIds = '';
        for (let i = 0; i < dataArray.length; i++) {
            if (dataArray[i].checked) {
                ids.push(String(dataArray[i].id));
            }
        }
        console.log(41444, ids);
        if (ids.length === 0) {
            Toast.info('请选择站内信息');
            return;
        }
        for (let i = 0; i < ids.length; i++) {
            splitIds += ids[i] + ','
        }
        splitIds = splitIds.substring(0, splitIds.lastIndexOf(','));
        console.log('read', splitIds);
        this.setState({visible: true}, () => {
            let url = Config.requestUrl + Config.siteMsgPage.maskAsRead + `?mobile=${mobile}&ids=${splitIds}`;
            fetch(url, {method: 'POST'}).then(res => res.json()).then(responseText => {
                console.log(666, responseText);
                this.setState({visible: false}, () => {
                    if (responseText.code === '200') {
                        Toast.message(responseText.message);
                        this.setState({page: 1, dataArray: [], count: 0, isAllSelect: false}, () => {
                            this._getMessageList(this.state.userInfo);
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
    _delete = () => {
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
            Toast.info('请选择站内信息');
            return;
        }
        for (let i = 0; i < ids.length; i++) {
            splitIds += ids[i] + ','
        }
        splitIds = splitIds.substring(0, splitIds.lastIndexOf(','));
        console.log('read', splitIds);
        Alert.alert(
            '删除消息',
            '消息删除后不可恢复，确定要删除当前消息吗？',
            [
                // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {
                    text: 'OK', onPress: () => {
                        this._deleteMsg(ids, splitIds)
                    }
                },
            ],
            {cancelable: false}
        )
    }
    _deleteMsg = (ids, splitIds) => {
        const {mobile} = this.state.userInfo;
        this.setState({visible: true}, () => {
            let url = Config.requestUrl + Config.siteMsgPage.deleteMsg + `?mobile=${mobile}&ids=${splitIds}`;
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
                            this._getMessageList(this.state.userInfo);
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

    // 渲染
    render() {
        const {deleteStatus, dataArray, isEmpty, isAllSelect, count} = this.state;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#f5f5f5'}}>
                <Title title={'站内信息'} onPressForward={this._onPressForward} back onPressBack={this._back} forward
                       forwardLabelText={deleteStatus ? '取消' : '编辑'}/>
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
                                <TouchableOpacity activeOpacity={0.8} onPress={this._allSelect}>
                                    <Image resizeMode={'contain'} source={isAllSelect ? Images.selected : Images.select}
                                           style={{width: px2dp(32), height: px2dp(32)}}/>
                                </TouchableOpacity>
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
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <TouchableOpacity activeOpacity={0.8} onPress={this._markAsRead}>
                                <View style={{
                                    borderRadius: px2dp(10),
                                    borderStyle: "solid",
                                    borderWidth: 1,
                                    borderColor: "#5691f7",
                                    marginRight: px2dp(60),
                                }}>
                                    <Text style={{
                                        fontSize: moderateScale(17),
                                        color: "#5691f7",
                                        paddingHorizontal: px2dp(28),
                                        paddingVertical: px2dp(14),
                                    }}>
                                        标记为已读
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.8} onPress={this._delete}>
                                <View style={{
                                    borderRadius: px2dp(10),
                                    borderStyle: "solid",
                                    borderWidth: 1,
                                    borderColor: "#ff2c2d"
                                }}>
                                    <Text style={{
                                        fontSize: moderateScale(17),
                                        color: "#ff2c2d",
                                        paddingHorizontal: px2dp(28),
                                        paddingVertical: px2dp(14),
                                    }}>
                                        删除
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View> : <View/>}
                <Loading visible={this.state.visible}/>
            </SafeAreaView>
        );
    }

}
