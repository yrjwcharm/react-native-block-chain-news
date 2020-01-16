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
    RefreshControl, ActivityIndicator
} from 'react-native'
import Title from '../../components/Title'
import Loading from "../../components/Loading";
import {StringUtils} from "../../utils";
import HTML from "react-native-render-html";
import HtmlView from "react-native-htmlview";
let itemNo=0;
export default class CommonProblems extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state={
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
            keywords: '',
            flag: false,
        }
    }
    componentDidMount(): void {
        this._queryList();
    }
    _queryList=()=>{
        let url=Config.requestUrl+Config.repository.getDataList+`?channelIds=158`;
        fetch(url,{method:'POST'}).then(res=>res.json()).then(responseText=>{
            console.log(98,responseText);
            if (responseText.code === '200') {
                const list = responseText.body;
                const flag = responseText.flag;

                this._rebuildDataByPaging(list, flag);
            }

        }).catch(error=>{
            Toast.fail(error)
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
    _jumpToRepositoryDetail=(id)=>{
        this.props.navigation.navigate('RepositoryDetail',{id});
    }
    _renderItem = ({item}) => {
        console.log(311133, item);
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={()=>this._jumpToRepositoryDetail(item.id)}>
            <View style={{paddingLeft: px2dp(30), backgroundColor: '#fff',}}>
                <View style={{
                    height: px2dp(250),
                    justifyContent: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: '#ebebeb'
                }}>
                    <View style={{paddingRight: px2dp(30), flexDirection: 'row', alignItems: 'center'}}>
                        <Image source={Images.slot} style={{width: px2dp(16), height: px2dp(16)}}/>
                        <View style={{marginLeft: px2dp(16)}}>
                            <Text style={{
                                fontFamily: "PingFangSC-Medium",
                                fontSize: moderateScale(16),
                                color: "#333333"
                            }}>{item.title}</Text>
                        </View>
                    </View>
                    <View style={{marginHorizontal: px2dp(30)}}>
                        <Text style={{
                            fontFamily: "PingFangSC-Regular",
                            fontSize: moderateScale(14),
                            lineHeight: px2dp(42),
                            marginTop: px2dp(30),
                            color: "#333333"
                        }}>{item.description.length > 40 ? item.description.substring(0, 40) + '...' : item.description}</Text>
                    </View>
                </View>

            </View>
            </TouchableOpacity>
        );
    }
    // 渲染
    render() {
        const {dataArray}=this.state;
        return (
            <View style={{flex:1}}>
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
const styles = StyleSheet.create({
    a: {
        fontWeight: 'bold',
        color: '#5691F7', // make links coloured pink
    },
    p:{
        fontFamily: "PingFangSC-Regular",
        fontSize: moderateScale(17),
        color: "#333333",
        lineHeight: px2dp(54),
    }
});
