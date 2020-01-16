import React, {PureComponent} from 'react';
import {
    Dimensions,
    ScrollView,
    Linking,
    SafeAreaView,
    StyleSheet,
    DeviceEventEmitter,
    Image,
    FlatList,
    Platform,
    BackHandler,
    View,
    Animated,
    Text,
    TextInput,
    Alert,
    ImageBackground,
    TouchableOpacity, ActivityIndicator, RefreshControl
} from 'react-native'
import Title from '../../components/Title'
import Select from "teaset/components/Select/Select";
import {Checkbox} from "teaset";
import {Drawer} from "native-base";
import SideBar from "../nav/SideBar";
import Loading from "../../components/Loading";
import {StringUtils} from "../../utils";
import HtmlView from "react-native-htmlview";

const {width} = Dimensions.get('window');
let itemNo = 0;
export default class Index extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            key: 0,
            activitySelected: true,
            typeSelected: false,
            addressSelected: false,
            visible: true,
            timeSelected: false,
            typeList: [],
            timeList: [{value: '全部', checked: true}, {value: '本周', checked: false}, {value: '本月', checked: false}],
            type: '全部',
            time: '全部',
            address: '全部',
            addressList: [],
            typeChoiceText: '类型',
            timeChoiceText: '时间',
            addressChoiceText: '地点',
            totalPage: 0,
            //上拉加载更多 下拉刷新
            page: 1,
            isLoading: true,
            //网络请求状态
            error: false,
            isEmpty: false,
            errorInfo: "",
            dataArray: [],
            showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            isRefreshing: false,//下拉控制
            flag: false,

        }
    }

    componentDidMount(): void {
        this._getSelectTypeList();
    }

    _getSelectTypeList = () => {
        let url = Config.requestUrl + Config.activity.selectItems + `?id=3&field=${'activitylx'}`;
        console.log(888,url);
        fetch(url, {method: 'POST'}).then(res => {
            console.log(666,res);
            return res.json()
        }).then(responseText => {
            console.log(444,responseText);
            if (responseText.code === '200') {
                let obj = responseText.body;
                let arr = [];
                obj.split(',').map((item, index) => {
                    if (index === 0) {
                        arr.push({value: item, checked: true})
                    } else {
                        arr.push({value: item, checked: false})
                    }
                })
                this.setState({typeList: arr});
                console.log(789, arr);

            }

            this._getAddressSelectList();
        }).catch(error => {
            Toast.fail(error);
        })
    }
    _queryList = (type, time, address) => {
        let url = Config.requestUrl + Config.informationPage.getDataList + `?channelIds=121&releaseDate=${time}&activitylx=${type}&activitycity=${address}`;
        console.log(333);
        fetch(url, {method: 'POST'}).then(res => res.json()).then(responseText => {
            console.log(9999999, responseText)
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
        });
    }
    _getAddressSelectList = () => {
        let url = Config.requestUrl + Config.activity.selectItems + `?id=3&field=${'activitycity'}`;
        fetch(url, {method: 'POST'}).then(res => res.json()).then(responseText => {
            if (responseText.code === '200') {
                let obj = responseText.body;
                let arr = [];
                obj.split(',').map((item, index) => {
                    if (index === 0) {
                        arr.push({value: item, checked: true})
                    } else {
                        arr.push({value: item, checked: false})
                    }
                })
                this.setState({addressList: arr});
            }
            this._queryList(this.state.time, this.state.type, this.state.address);
        }).catch(error => {
            Toast.fail(error);
        })
    }

    openDrawer = () => {
        this.drawer._root.open()
    };
    // 渲染
    closeDrawer = () => {
        this.drawer._root.close()
    }
    _typeSelect = () => {
        this.setState({key: 1,});
    }
    _timeSelect = () => {
        this.setState({key: 2,});
    }
    _addressSelect = () => {
        this.setState({key: 3,});
    }
    _jumpToActivityDetail = (id) => {
        this.props.navigation.navigate('ActivityDetail', {id});
    }
    _renderPanelPage = (key) => {
        if (key === 1) {
            return (
                <Animated.View
                    style={{position: 'absolute', zIndex: 1, top: px2dp(160), width, backgroundColor: '#fff'}}>
                    <View style={{
                        flexDirection: 'row',
                        marginHorizontal: px2dp(30),
                        marginVertical: px2dp(20),
                        flexWrap: 'wrap',
                        justifyContent: 'space-between'
                    }}>
                        {this.state.typeList && this.state.typeList.map(it => {
                            return (
                                <TouchableOpacity activeOpacity={0.8} onPress={() => {
                                    this.setState({
                                        key: 0,
                                        dataArray: [],
                                        type: it.value,
                                        typeChoiceText: it.value === '全部' ? '类型' : it.value
                                    }, () => {
                                        this.state.typeList.map(item => {
                                            item.checked = false;
                                            if (JSON.stringify(it) === JSON.stringify(item)) {
                                                item.checked = true;
                                            }
                                        });
                                        this.setState({
                                            typeList: [
                                                ...this.state.typeList,
                                            ]
                                        }, () => [
                                            this._queryList(it.value, this.state.time, this.state.address)
                                        ]);
                                        console.log(444, this.state.typeList);
                                    });
                                }}>
                                    <View style={{
                                        width: px2dp(210),
                                        borderRadius: px2dp(8),
                                        backgroundColor: '#fff',
                                        height: px2dp(60),
                                        marginTop: px2dp(20),
                                        justifyContent: 'center',
                                        borderWidth: px2dp(1),
                                        borderColor: it.checked ? '#5691f7' : '#ebebeb',
                                    }}>
                                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                            <Text style={{
                                                fontFamily: "PingFangSC-Regular",
                                                fontSize: moderateScale(13),
                                                color: it.checked ? "#5691f7" : '#333'
                                            }}>{it.value}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </Animated.View>
            );
        } else if (key === 2) {
            return (
                <Animated.View
                    style={{position: 'absolute', zIndex: 1, top: px2dp(160), width, backgroundColor: '#fff'}}>
                    <View style={{
                        flexDirection: 'row',
                        marginHorizontal: px2dp(30),
                        marginVertical: px2dp(20),
                        flexWrap: 'wrap',
                        justifyContent: 'space-between'
                    }}>
                        {this.state.timeList && this.state.timeList.map(it => {
                            return (
                                <TouchableOpacity activeOpacity={0.8} onPress={() => {
                                    this.setState({
                                        key: 0,
                                        dataArray: [],
                                        time: it.value,
                                        timeChoiceText: it.value === '全部' ? '时间' : it.value
                                    }, () => {
                                        this.state.timeList.map(item => {
                                            item.checked = false;
                                            if (JSON.stringify(it) === JSON.stringify(item)) {
                                                item.checked = true;
                                            }
                                        });
                                        this.setState({
                                            timeList: [
                                                ...this.state.timeList,
                                            ]
                                        }, () => [
                                            this._queryList(this.state.type, it.value, this.state.address)
                                        ]);
                                        console.log(555, this.state.timeList);
                                    });
                                }}>
                                    <View style={{
                                        width: px2dp(210),
                                        borderRadius: px2dp(8),
                                        backgroundColor: '#fff',
                                        height: px2dp(60),
                                        marginTop: px2dp(20),
                                        justifyContent: 'center',
                                        borderWidth: px2dp(1),
                                        borderColor: it.checked ? '#5691f7' : '#ebebeb',
                                    }}>
                                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                            <Text style={{
                                                fontFamily: "PingFangSC-Regular",
                                                fontSize: moderateScale(13),
                                                color: it.checked ? "#5691f7" : '#333'
                                            }}>{it.value}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </Animated.View>
            );
        } else if (key === 3) {
            return (
                <Animated.View
                    style={{position: 'absolute', zIndex: 1, top: px2dp(160), width, backgroundColor: '#fff'}}>
                    <View style={{
                        flexDirection: 'row',
                        marginHorizontal: px2dp(30),
                        marginVertical: px2dp(20),
                        flexWrap: 'wrap',
                        justifyContent: 'space-between'
                    }}>
                        {this.state.addressList && this.state.addressList.map(it => {
                            return (
                                <TouchableOpacity activeOpacity={0.8} onPress={() => {
                                    this.setState({
                                        key: 0,
                                        dataArray: [],
                                        address: it.value,
                                        addressChoiceText: it.value === '全部' ? '地点' : it.value
                                    }, () => {
                                        this.state.addressList.map(item => {
                                            item.checked = false;
                                            if (JSON.stringify(it) === JSON.stringify(item)) {
                                                item.checked = true;
                                            }
                                        });
                                        this.setState({
                                            addressList: [
                                                ...this.state.addressList,
                                            ]
                                        }, () => [
                                            this._queryList(this.state.type, this.state.time, it.value)
                                        ]);
                                        console.log(444, this.state.addressList);
                                    });
                                }}>
                                    <View style={{
                                        width: px2dp(210),
                                        borderRadius: px2dp(8),
                                        backgroundColor: '#fff',
                                        height: px2dp(60),
                                        marginTop: px2dp(20),
                                        justifyContent: 'center',
                                        borderWidth: px2dp(1),
                                        borderColor: it.checked ? '#5691f7' : '#ebebeb',
                                    }}>
                                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                            <Text style={{
                                                fontFamily: "PingFangSC-Regular",
                                                fontSize: moderateScale(13),
                                                color: it.checked ? "#5691f7" : '#333'
                                            }}>{it.value}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </Animated.View>
            );
        } else {
            return <View/>
        }
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
            this._queryList(this.state.time, this.state.type, this.state.address);
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
            this._queryList(this.state.time, this.state.type, this.state.address);
        });
    }
    _renderItem = ({item}) => {
        console.log(333, item);
        return (
            <View style={{marginBottom: px2dp(20), paddingVertical: px2dp(30), backgroundColor: '#fff'}}>
                <View style={{paddingHorizontal: px2dp(30)}}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => this._jumpToActivityDetail(item.id)}>
                        <View>
                            <Image source={{uri: item.typeImg}} resizeMode={'stretch'}
                                   style={{width: px2dp(345 * 2), height: px2dp(207 * 2)}}/>
                            <Text style={{
                                fontFamily: "PingFangSC-Regular",
                                fontSize: moderateScale(16),
                                marginTop: px2dp(30),
                                color: "#222222"
                            }}>
                                {item.title}
                            </Text>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: px2dp(26),
                                justifyContent: 'space-between'
                            }}>
                                <View>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Image source={Images.locationMarker}
                                               style={{width: px2dp(20), height: px2dp(24)}}/>
                                        <Text style={{
                                            fontFamily: "PingFangSC-Regular",
                                            fontSize: moderateScale(12),
                                            marginLeft: px2dp(10),
                                            color: "#666666"
                                        }}>{item.attr_activitycity}</Text>
                                    </View>
                                </View>
                                <View style={{marginLeft: px2dp(48)}}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Image source={Images.timer}
                                               style={{width: px2dp(24), height: px2dp(24)}}/>
                                        <Text style={{
                                            marginLeft: px2dp(8),
                                            fontFamily: "PingFangSC-Regular",
                                            fontSize: moderateScale(12),
                                            color: "#666666"
                                        }}>{item.attr_times}</Text>
                                    </View>
                                </View>
                                {/*#ddd  报名中 #999*/}
                                {/*<View style={{*/}
                                {/*    borderRadius: px2dp(8),*/}
                                {/*    backgroundColor: "#5691f7",*/}
                                {/*}}>*/}
                                {/*    <Text style={{*/}
                                {/*        fontFamily: "PingFangSC-Regular",*/}
                                {/*        fontSize: moderateScale(13),*/}
                                {/*        paddingHorizontal: px2dp(30),*/}
                                {/*        paddingTop: px2dp(14),*/}
                                {/*        paddingBottom: px2dp(18),*/}
                                {/*        color: "#ffffff"*/}
                                {/*    }}>报名中</Text>*/}
                                {/*</View>*/}
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // 渲染
    render() {
        const {
            isEmpty,
            typeSelected,
            addressSelected,
            timeSelected,
            key,
            dataArray,
            typeChoiceText,
            timeChoiceText,
            addressChoiceText
        } = this.state;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#f5f5f5'}}>
                <Drawer panCloseMask={0.5} openDrawerOffset={0.5} side={'right'} ref={(ref) => {
                    this.drawer = ref;
                }} content={<SideBar {...this.props} {...this.state} closeDrawer1={
                    () => {
                        DeviceEventEmitter.emit('update_bottom_nav', {page: 'information', code: 1});
                        this.closeDrawer();
                    }
                } closeDrawer2={
                    () => {
                        DeviceEventEmitter.emit('update_bottom_nav', {page: 'information', code: 2});
                        this.closeDrawer();
                    }
                } closeDrawer3={
                    () => {
                        DeviceEventEmitter.emit('update_bottom_nav', {page: 'market', code: 3});
                        this.closeDrawer();
                    }

                } closeDrawer4={
                    () => {
                        DeviceEventEmitter.emit('update_bottom_nav', {page: 'market', code: 4});
                        this.closeDrawer();
                    }

                } closeDrawer5={
                    () => {
                        DeviceEventEmitter.emit('update_bottom_nav', {page: 'project'});
                        this.closeDrawer();
                    }

                } closeDrawer6={
                    () => {
                        this.closeDrawer();
                    }

                } closeDrawer7={
                    () => {
                        DeviceEventEmitter.emit('update_bottom_nav', {page: 'repository'});
                        this.closeDrawer();
                    }

                }/>} onClose={() => this.closeDrawer()}>
                    <View style={{height: global.height, justifyContent: 'center', backgroundColor: '#5691F7'}}>
                        <View style={{
                            marginHorizontal: px2dp(34),
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <Image source={null} style={{width: px2dp(40), height: px2dp(40)}}/>

                            <Text style={{
                                fontFamily: "PingFangSC-Medium",
                                fontSize: px2dp(36),
                                color: "#ffffff"
                            }}>活动沙龙</Text>
                            <TouchableOpacity onPress={this.openDrawer} activeOpacity={0.8}>
                                <Image source={Images.nav} style={{width: px2dp(36), height: px2dp(36)}}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{
                        height: px2dp(72), backgroundColor: "#fff",
                        shadowColor: "#ebebeb",
                        shadowOffset: {
                            width: 0,
                            height: 1
                        },
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor: '#ebebeb',
                        shadowRadius: 0,
                        shadowOpacity: 1, justifyContent: 'center'
                    }}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                            <TouchableOpacity activeOpacity={0.8} onPress={this._typeSelect}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{
                                        fontFamily: "PingFangSC-Regular",
                                        fontSize: moderateScale(15),
                                        color: "#666666",
                                        marginRight: px2dp(20),
                                    }}>{typeChoiceText}</Text>
                                    <Image source={typeSelected ? Images.drop_menu_up : Images.drop_menu_down}
                                           style={{width: px2dp(32), height: px2dp(32)}}/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.8} onPress={this._timeSelect}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{
                                        fontFamily: "PingFangSC-Regular",
                                        fontSize: moderateScale(15),
                                        marginRight: px2dp(20),
                                        color: "#666666"
                                    }}>{timeChoiceText}</Text>
                                    <Image source={timeSelected ? Images.drop_menu_up : Images.drop_menu_down}
                                           style={{width: px2dp(32), height: px2dp(32)}}/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.8} onPress={this._addressSelect}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{
                                        marginRight: px2dp(20),
                                        fontFamily: "PingFangSC-Regular",
                                        fontSize: moderateScale(15),
                                        color: "#666666"
                                    }}>{addressChoiceText}</Text>
                                    <Image source={addressSelected ? Images.drop_menu_up : Images.drop_menu_down}
                                           style={{width: px2dp(32), height: px2dp(32)}}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <FlatList
                        data={dataArray}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                        ListFooterComponent={this._renderFooter}
                        onEndReached={this._onEndReached}
                        onEndReachedThreshold={0.1}
                        refreshing={true}
                        ListEmptyComponent={
                            !isEmpty ? <View/> :
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
                    {this._renderPanelPage(key)}
                </Drawer>
                <Loading visible={this.state.visible}/>
            </SafeAreaView>
        )
    }
}
