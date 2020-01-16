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
import {Drawer} from "native-base";
import SideBar from "../nav/SideBar";
import Loading from "../../components/Loading";
import moment from "moment";
import {StringUtils} from "../../utils";
const {width} = Dimensions.get('window');
let itemNo=0;
export default class CoinDetail extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            visible: true,
            circulation: "",
            circulationMarketValue: "",
            circulationRate: "",
            code: "",
            fullname: "",
            gain: "",
            initPrice: "",
            logo: "",
            marketValue: "",
            maxHistory: "",
            maxPrice: "",
            maxSevenDays: "",
            minHistory: "",
            minPrice: "",
            minSevenDays: "",
            name: "",
            occupancyRate: "",
            price: "",
            returnOnInvestment: "",
            turnover: "",
            turnoverRate: "",
            volume: "",
            blockStation: "",
            conceptType: "",
            coreAlgorithm: "",
            icon: "",
            incentiveSystem: "",
            issueDate: '',
            maxSupply: "",
            nameCh: "",
            nameEng: "",
            publish: 0,
            siteId: 1,
            totalSupply: "",
            txt: '',
            isEmpty:false,
            websiteAddress: "",
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
            flag: false,
            viewDetail: false,
        }
    }

    componentDidMount(): void {
        const {params} = this.props.navigation.state;
        console.log(333,params);
        this._queryList(params);

    }

    _getCoinDetail = (params) => {
        let url = Config.requestUrl + Config.market.dataMarket.coinDetail + `?code=${params.code}`;
        console.log(333, url);
        fetch(url, {method: 'POST'}).then(res => res.json()).then(responseText => {
            console.log(44444, responseText);
            this.setState({visible: false}, () => {
                if (responseText.code === '200') {
                    const {icon, maxSupply, issueDate, txt, websiteAddress, publish, siteId, totalSupply, nameEng, blockStation, conceptType, coreAlgorithm, incentiveSystem,} = responseText.body[0]
                    const {occupancyRate, volume, gain, turnoverRate, turnover, returnOnInvestment, price, marketValue, maxHistory, maxPrice, maxSevenDays, minHistory, minPrice, minSevenDays, initPrice, circulation, circulationMarketValue, circulationRate, fullname, name, code, logo,} = responseText.body[1];
                    this.setState({
                        issueDate,
                        txt,
                        maxSupply,
                        websiteAddress,
                        publish,
                        siteId,
                        totalSupply,
                        nameEng,
                        blockStation,
                        conceptType,
                        coreAlgorithm,
                        incentiveSystem,
                        gain,
                        occupancyRate,
                        volume,
                        turnoverRate,
                        turnover,
                        icon,
                        returnOnInvestment,
                        price,
                        marketValue,
                        maxHistory,
                        maxPrice,
                        maxSevenDays,
                        minHistory,
                        minPrice,
                        minSevenDays,
                        initPrice,
                        circulation,
                        circulationMarketValue,
                        circulationRate,
                        fullname,
                        name,
                        code,
                        logo
                    });

                }
            });

        }).catch(error => {
            Toast.fail(error)
        })
    }
    _queryList = (params) => {
        let url = Config.requestUrl + Config.coinDetail.coinDetailInfo+ `?name=${params.name}&name_ch=${params.name_ch}&pageNumber=${this.state.page}`;
        console.log('333',url);
        fetch(url, {method: 'POST'}).then(res => res.json()).then(responseText => {
            console.log(333, responseText);
            if (responseText.code === '200') {
                const list = responseText.body;
                const flag = responseText.flag;

                this._rebuildDataByPaging(list, flag);
            }
            this._getCoinDetail(params);
        }).catch(error => {
            Toast.fail(error)
        })
    }
    _jumpToIndustryInfoContent = (id) => {
        let url = Config.requestUrl + Config.informationPage.addViews + `?contentId=${id}`;
        console.log(333, url);
        fetch(url, {method: 'GET'}).then(res => res.json()).then(responseText => {
            console.log(444, responseText);
            if (responseText) {
                this.props.navigation.navigate('IndustryInfoContent', {id})
            }

        }).catch(error => {
            Toast.fail(error)
        })

    }
    openDrawer = () => {
        this.drawer._root.open()
    };
    // 渲染
    closeDrawer = () => {
        this.drawer._root.close()
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
                        marginHorizontal:px2dp(30),

                    }}>
                        <View>
                            <Text style={{
                                fontFamily: "PingFangSC-Medium",
                                fontSize: moderateScale(16),
                                width: px2dp(195 * 2),
                                lineHeight: px2dp(42),
                                color: "#333333"
                            }}>{item.title.length > 20 ? item.title.substring(0, 20) + '...' : item.title}</Text>
                            <View style={{flex:1,justifyContent:'flex-end'}}>
                                <View style={{
                                    // paddingTop: px2dp(35),
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    backgroundColor: '#fff',
                                    marginRight:px2dp(15),
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
                                            marginLeft:px2dp(20),
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
            const {params} = this.props.navigation.state;
            this._queryList(params.code);
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
            const {params} = this.props.navigation.state;
            this._queryList(params.code);
        });
    }

    _viewDetail = () => {
        this.setState({viewDetail: !this.state.viewDetail});
    }

    // 渲染
    render() {
        const {isEmpty,viewDetail, dataArray, icon, issueDate, maxSupply, txt, websiteAddress, publish, siteId, totalSupply, nameEng, blockStation, conceptType, coreAlgorithm, incentiveSystem, occupancyRate, gain, volume, turnoverRate, turnover, returnOnInvestment, price, marketValue, maxHistory, maxPrice, maxSevenDays, minHistory, minPrice, minSevenDays, initPrice, circulation, circulationMarketValue, circulationRate, fullname, name, code, logo} = this.state;
        console.log(999, websiteAddress);
        let websiteAddressArr = websiteAddress.split('&&&');
        let blockStationArr = blockStation.split('&&&');
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
                <Drawer panCloseMask={0.5} openDrawerOffset={0.5} side={'right'} ref={(ref) => {
                    this.drawer = ref;
                }} content={<SideBar {...this.props} {...this.state} closeDrawer1={
                    () => {
                        DeviceEventEmitter.emit('update_bottom_nav', {page: 'information', code: 1});
                        this.props.navigation.goBack('Main');
                    }
                } closeDrawer2={
                    () => {
                        DeviceEventEmitter.emit('update_bottom_nav', {page: 'information', code: 2});
                        this.props.navigation.goBack('Main');
                    }
                } closeDrawer3={
                    () => {
                        DeviceEventEmitter.emit('update_bottom_nav', {page: 'market', code: 3});
                        this.props.navigation.goBack('Main');
                    }

                } closeDrawer4={
                    () => {
                        DeviceEventEmitter.emit('update_bottom_nav', {page: 'market', code: 4});
                        this.props.navigation.goBack('Main');
                    }

                } closeDrawer5={
                    () => {
                        DeviceEventEmitter.emit('update_bottom_nav', {page: 'project'});
                        this.props.navigation.goBack('Main');
                    }

                } closeDrawer6={
                    () => {
                        DeviceEventEmitter.emit('update_bottom_nav', {page: 'activity'});
                        this.props.navigation.goBack('Main');
                    }

                } closeDrawer7={
                    () => {
                        DeviceEventEmitter.emit('update_bottom_nav', {page: 'repository'});
                        this.props.navigation.goBack('Main');
                    }

                }/>} onClose={() => this.closeDrawer()}>
                    <View style={{height: global.height, justifyContent: 'center', backgroundColor: '#5691F7'}}>
                        <View style={{
                            marginHorizontal: px2dp(34),
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <TouchableOpacity activeOpacity={0.8} onPress={() => this.props.navigation.goBack()}>
                                <Image source={Images.back} style={{width: px2dp(40), height: px2dp(40)}}/>
                            </TouchableOpacity>
                            <Text style={{
                                fontFamily: "PingFangSC-Medium",
                                fontSize: px2dp(36),
                                color: "#ffffff"
                            }}>{name},{fullname}</Text>
                            <TouchableOpacity onPress={this.openDrawer} activeOpacity={0.8}>
                                <Image source={Images.nav} style={{width: px2dp(42), height: px2dp(36)}}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ScrollView keyboardShouldPersistTaps={Platform.OS === 'android' ? 'always' : 'never'}
                                showsVerticalScrollIndicator={false}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: px2dp(28),
                            marginLeft: px2dp(30)
                        }}>
                            <Image source={{uri: icon}} style={{width: px2dp(84), height: px2dp(84)}}/>
                            <View style={{marginLeft: px2dp(16)}}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{
                                        fontFamily: "PingFangSC-Medium",
                                        fontSize: moderateScale(19),
                                        color: "#333333"
                                    }}>{name},{fullname}</Text>
                                    <Text style={{
                                        fontFamily: "PingFangSC-Regular",
                                        fontSize: moderateScale(12),
                                        marginLeft: px2dp(16),
                                        color: "#999999"
                                    }}>{code}</Text>
                                </View>
                                <Text style={{
                                    fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(13),
                                    marginTop: px2dp(8),
                                    color: "#999999"
                                }}>货币/{conceptType}</Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center',marginTop:px2dp(30)}}>
                            <View style={{marginLeft:px2dp(30)}}>
                                <Text style={{
                                    fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(13),
                                    color: "#999999"
                                }}>今日行情价格</Text>
                                <Text style={{
                                    marginTop:px2dp(10),
                                    fontSize: moderateScale(20),
                                    color: "#33b661"
                                }}>{price}</Text>
                            </View>
                            <View style={{marginLeft:px2dp(140)}}>
                                <Text style={{
                                    fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(13),
                                    color: "#999999"
                                }}>市值</Text>
                                <Text style={{
                                    marginTop:px2dp(10),
                                    fontSize: moderateScale(20),
                                    color: "#666666",
                                }}>{marketValue}</Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center',marginTop:px2dp(30)}}>
                            <View style={{width: width / 2, flexDirection: 'row', alignItems: 'center',}}>
                                <Text style={{
                                    fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(12),
                                    paddingLeft: px2dp(32),
                                    lineHeight: px2dp(46),
                                    color: "#999999",
                                }}>
                                    24H交易量
                                </Text>
                                <Text style={{
                                    fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(12),
                                    textAlign: 'right',
                                    flex: 1,
                                    lineHeight: px2dp(46),
                                    color: "#333",
                                    marginRight: px2dp(33),
                                }}>
                                    {volume}
                                </Text>
                            </View>
                            <View style={{width: width / 2, flexDirection: 'row', alignItems: 'center',}}>
                                <Text style={{
                                    fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(12),
                                    color: "#999999",
                                    marginLeft: px2dp(33),
                                    lineHeight: px2dp(46),
                                }}>
                                    换手率
                                </Text>
                                <Text style={{
                                    fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(12),
                                    color: "#333",
                                    paddingRight: px2dp(28),
                                    textAlign: 'right',
                                    lineHeight: px2dp(46),
                                    flex: 1,
                                }}>
                                    {turnoverRate}
                                </Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{width: width / 2, flexDirection: 'row', alignItems: 'center',}}>
                                <Text style={{
                                    fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(12),
                                    paddingLeft: px2dp(32),
                                    color: "#999999",
                                    lineHeight: px2dp(46),
                                }}>
                                    24H成交额
                                </Text>
                                <Text style={{
                                    fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(12),
                                    textAlign: 'right',
                                    flex: 1,
                                    lineHeight: px2dp(46),
                                    color: "#333",
                                    marginRight: px2dp(33),
                                }}>
                                    {turnover}
                                </Text>
                            </View>
                            <View style={{width: width / 2, flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={{
                                    fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(12),
                                    color: "#999999",
                                    lineHeight: px2dp(46),
                                    marginLeft: px2dp(33),
                                }}>
                                    24H涨幅
                                </Text>
                                <Text style={{
                                    fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(12),
                                    color: "#333",
                                    paddingRight: px2dp(28),
                                    textAlign: 'right',
                                    lineHeight: px2dp(46),
                                    flex: 1,
                                }}>
                                    {gain}
                                </Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{width: width / 2, flexDirection: 'row', alignItems: 'center',}}>
                                <Text style={{
                                    fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(12),
                                    paddingLeft: px2dp(32),
                                    color: "#999999",
                                    lineHeight: px2dp(46),
                                }}>
                                    24H最高
                                </Text>
                                <Text style={{
                                    fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(12),
                                    textAlign: 'right',
                                    flex: 1,
                                    lineHeight: px2dp(46),
                                    color: "#333",
                                    marginRight: px2dp(33),
                                }}>
                                    {maxPrice}
                                </Text>
                            </View>
                            <View style={{width: width / 2, flexDirection: 'row', alignItems: 'center',}}>
                                <Text style={{
                                    fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(12),
                                    color: "#999999",
                                    lineHeight: px2dp(46),
                                    marginLeft: px2dp(33),
                                }}>
                                    24H最低
                                </Text>
                                <Text style={{
                                    fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(12),
                                    color: "#333",
                                    paddingRight: px2dp(28),
                                    textAlign: 'right',
                                    lineHeight: px2dp(46),
                                    flex: 1,
                                }}>
                                    {minPrice}
                                </Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{width: width / 2, flexDirection: 'row', alignItems: 'center',}}>
                                <Text style={{
                                    fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(12),
                                    paddingLeft: px2dp(32),
                                    color: "#999999",
                                    lineHeight: px2dp(46),
                                }}>
                                    7D最高
                                </Text>
                                <Text style={{
                                    fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(12),
                                    textAlign: 'right',
                                    flex: 1,
                                    lineHeight: px2dp(46),
                                    color: "#333",
                                    marginRight: px2dp(33),
                                }}>
                                    {maxSevenDays}
                                </Text>
                            </View>
                            <View style={{width: width / 2, flexDirection: 'row', alignItems: 'center',}}>
                                <Text style={{
                                    fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(12),
                                    color: "#999999",
                                    lineHeight: px2dp(46),
                                    marginLeft: px2dp(33),
                                }}>
                                    7D最低
                                </Text>
                                <Text style={{
                                    fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(12),
                                    color: "#333",
                                    paddingRight: px2dp(28),
                                    textAlign: 'right',
                                    lineHeight: px2dp(46),
                                    flex: 1,
                                }}>
                                    {minSevenDays}
                                </Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{width: width / 2, flexDirection: 'row', alignItems: 'center',}}>
                                <Text style={{
                                    fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(12),
                                    paddingLeft: px2dp(32),
                                    lineHeight: px2dp(46),
                                    color: "#999999",
                                }}>
                                    历史最高
                                </Text>
                                <Text style={{
                                    fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(12),
                                    textAlign: 'right',
                                    flex: 1,
                                    color: "#333",
                                    lineHeight: px2dp(46),
                                    marginRight: px2dp(33),
                                }}>
                                    {maxHistory}
                                </Text>
                            </View>
                            <View style={{width: width / 2, flexDirection: 'row', alignItems: 'center',}}>
                                <Text style={{
                                    fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(12),
                                    color: "#999999",
                                    lineHeight: px2dp(46),
                                    marginLeft: px2dp(33),
                                }}>
                                    历史最低
                                </Text>
                                <Text style={{
                                    fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(12),
                                    color: "#333",
                                    paddingRight: px2dp(28),
                                    textAlign: 'right',
                                    lineHeight: px2dp(46),
                                    flex: 1,
                                }}>
                                    {minHistory}
                                </Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{width: width / 2, flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={{
                                    fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(12),
                                    paddingLeft: px2dp(32),
                                    color: "#999999",
                                    lineHeight: px2dp(46),
                                }}>
                                    初始价格
                                </Text>
                                <Text style={{
                                    fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(12),
                                    textAlign: 'right',
                                    flex: 1,
                                    lineHeight: px2dp(46),
                                    color: "#333",
                                    marginRight: px2dp(33),
                                }}>
                                    {initPrice}
                                </Text>
                            </View>
                            <View style={{width: width / 2, flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={{
                                    fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(12),
                                    color: "#999999",
                                    lineHeight: px2dp(46),
                                    marginLeft: px2dp(33),
                                }}>
                                    投资回报率
                                </Text>
                                <Text style={{
                                    fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(12),
                                    color: "#333",
                                    lineHeight: px2dp(46),
                                    paddingRight: px2dp(28),
                                    textAlign: 'right',
                                    flex: 1,
                                }}>
                                    {returnOnInvestment}
                                </Text>
                            </View>
                        </View>
                        <Text style={{
                            fontFamily: "PingFangSC-Regular",
                            fontSize: moderateScale(18),
                            marginTop: px2dp(82),
                            marginLeft: px2dp(30),
                            color: "#333333"
                        }}>简介</Text>
                        <View style={{paddingHorizontal: px2dp(30),}}>
                            <Text style={{
                                fontFamily: "PingFangSC-Regular",
                                fontSize: moderateScale(15),
                                lineHeight: px2dp(50),
                                marginTop: px2dp(50),
                                color: "#333333"
                            }}>
                                {viewDetail ? txt+'\t' :txt.substring(0,80)+'\t'}
                                <Text
                                    style={{color: '#5691f7'}}
                                    onPress={this._viewDetail}>{viewDetail ? '收起详情' : '查看详情'}</Text>
                            </Text>
                        </View>
                        <Menu style={{marginTop: px2dp(52), backgroundColor: '#FAFAFA'}} title={'发行时间'}
                              detail={moment(issueDate).format('YYYY-MM-DD')}/>
                        <Menu title={'最大供应量'} detail={maxSupply}/>
                        <Menu style={{backgroundColor: '#FAFAFA'}} title={'总供应量'} detail={totalSupply}/>
                        <Menu title={'上架交易所'} detail={'270家'}/>
                        <Menu style={{backgroundColor: '#FAFAFA'}} title={'核心算法'} detail={coreAlgorithm}/>
                        <Menu title={'激励机制'} detail={incentiveSystem}/>
                        <Menu style={{backgroundColor: '#FAFAFA'}} title={'概念分类'} detail={conceptType}/>
                        <Menu1 title={'官网地址'} detailColor={'#5691f7'} detail={websiteAddressArr}/>
                        {/*<Menu1 style={{backgroundColor: '#FAFAFA'}} detailColor={'#5691f7'} title={'白皮书'}*/}
                        {/*       detail={websiteAddressArr}/>*/}
                        <Menu1 style={{backgroundColor: '#FAFAFA'}} title={'区块站'} detailColor={'#5691f7'}
                               detail={blockStationArr}/>
                        <View style={{height: px2dp(20), backgroundColor: '#f5f5f5'}}/>
                        <Text style={{
                            marginTop: px2dp(52),
                            marginLeft: px2dp(30),
                            fontFamily: "PingFangSC-Regular",
                            fontSize: moderateScale(18),
                            color: "#333333"
                        }}>相关资讯</Text>
                        <FlatList
                            data={dataArray}
                            keyExtractor={this._keyExtractor}
                            renderItem={this._renderItem}
                            ListFooterComponent={this._renderFooter}
                            onEndReached={this._onEndReached}
                            onEndReachedThreshold={0.1}
                            refreshing={true}
                            ListEmptyComponent={
                                !isEmpty?<View/>:
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
                    </ScrollView>
                </Drawer>
                <Loading visible={this.state.visible}/>
            </SafeAreaView>
        );
    }
}
const Menu = (props) => {
    return (
        <View style={[{height: px2dp(72), justifyContent: 'center'}, props.style]}>
            <View style={{
                flexDirection: 'row',
                marginHorizontal: px2dp(30),
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Text style={{
                    fontFamily: "PingFangSC-Regular",
                    fontSize: moderateScale(14),
                    lineHeight: px2dp(72),
                    color: "#999999"
                }}>{props.title}</Text>
                <Text style={{
                    lineHeight: px2dp(72),
                    fontFamily: "PingFangSC-Regular",
                    fontSize: moderateScale(14),
                    color: props.detailColor ? props.detailColor : "#333333",
                }}>{props.detail}</Text>
            </View>
        </View>
    );
}
const Menu1 = (props) => {
    return (
        <View style={[{height: px2dp(72), justifyContent: 'center'}, props.style]}>
            <View style={{
                flexDirection: 'row',
                marginHorizontal: px2dp(30),
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Text style={{
                    fontFamily: "PingFangSC-Regular",
                    fontSize: moderateScale(14),
                    lineHeight: px2dp(72),
                    color: "#999999"
                }}>{props.title}</Text>
                <ScrollView showsHorizontalScrollIndicator={false}
                            keyboardShouldPersistTaps={Platform.OS === 'android' ? 'always' : 'never'}
                            horizontal={true}>
                    {props.detail ? props.detail.map(item => {
                        return (
                            <TouchableOpacity activeOpacity={0.8} onPress={() => Linking.openURL(item)}>
                                <Text style={{
                                    marginHorizontal: px2dp(30),
                                    lineHeight: px2dp(72),
                                    fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(14),
                                    color: props.detailColor ? props.detailColor : "#333333",
                                    textDecorationLine: 'underline',
                                    textDecorationColor: '#5691f7'
                                }}>{item}</Text>
                            </TouchableOpacity>
                        );
                    }) : <View/>}
                </ScrollView>
            </View>
        </View>
    );
}
