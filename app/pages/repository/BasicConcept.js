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
    RefreshControl,
    Text,
    Animated,
    TextInput,
    Alert,
    ImageBackground,
    TouchableOpacity, ActivityIndicator
} from 'react-native'
import Loading from "../../components/Loading";

let itemNo = 0;
const {width} = Dimensions.get('window')
export default class BasicConcept extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            dataArray: [],
            visible: true,
            totalPage: 0,
            //上拉加载更多 下拉刷新
            page: 1,
            key: 0,
            isLoading: true,
            //网络请求状态
            error: false,
            errorInfo: "",
            showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            isRefreshing: false,//下拉控制
            menuVisible: false,
            selectedIndex: 0,
            taskGoalList: [],
            taskGoalId: '',
            flag: false,
            tagId: '',
            keyList: [
                {key: 1900, value: '区块链定义', checked: false},
                {key: 1901, value: '区块链层级结构', checked: false},
                {key: 1902, value: '区块链特性', checked: false},
            ]
        }
        console.log(3333444, props);
    }

    componentDidMount(): void {
        console.log(88888, this.props);
        this._queryList();
    }
    _queryList = () => {
        let url = Config.requestUrl + Config.repository.getDataList + `?channelIds=152&tagIds=${this.state.tagId}&channelOption=1&pageNumber=${this.state.page}`;
        console.log(999, url);
        fetch(url, {method: 'POST'}).then(res => res.json()).then(responseText => {
            console.log(98, responseText);
            this.setState({visible: false}, () => {
                if (responseText.code === '200') {
                    const list = responseText.body;
                    const flag = responseText.flag;

                    this._rebuildDataByPaging(list, flag);
                }
            });

        }).catch(error => {
            Toast.fail(error)
        })
    }
    _choiceType = (item) => {
        console.log(33, 'zoule');
        this.state.keyList.map(item => {
            item.checked = false;
        });
        item.checked = true;
        this.setState({
            keyList: [
                ...this.state.keyList,
            ],
            tagId: item.key,
            page: 1,
            dataArray: [],
            key: 0,
        }, () => {
            this._queryList();
        });
    }
    _renderPanelPage = () => {
        const {keyList} = this.state;
            return (
                    <View style={{
                        flexDirection: 'row',
                        marginHorizontal: px2dp(30),
                        marginBottom: px2dp(20),
                        flexWrap: 'wrap',
                        // justifyContent: 'space-between'
                    }}>
                        {keyList && keyList.map(item => {
                            return (
                                <TouchableOpacity activeOpacity={0.8} onPress={() => this._choiceType(item)}>
                                    <View style={{
                                        marginTop: px2dp(20),
                                        marginRight:px2dp(20),
                                    }}>
                                        <View style={{
                                            borderRadius: px2dp(8),
                                            backgroundColor: item.checked ? "rgba(86,145,247,0.1)" : '#f5f5f5',
                                            justifyContent: 'center',
                                        }}>
                                            <Text style={{
                                                fontFamily: "PingFangSC-Regular",
                                                fontSize: moderateScale(13),
                                                paddingVertical:px2dp(15),
                                                paddingHorizontal:px2dp(30),
                                                color: item.checked ? "#5691f7" : '#666',
                                            }}>{item.value}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
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
        const {dataArray, key} = this.state;
        return (
            <View style={{flex: 1}}>
                {this._renderPanelPage()}
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
                <Loading visible={this.state.visible}/>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    a: {
        fontWeight: 'bold',
        color: '#5691F7', // make links coloured pink
    },
    p: {
        fontFamily: "PingFangSC-Regular",
        fontSize: moderateScale(17),
        color: "#333333",
        lineHeight: px2dp(54),
    }
});
