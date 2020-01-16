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
import {SceneMap, TabBar, TabView} from "react-native-tab-view";
import Headline from "./Headline";
import News from "./News";
import Policy from "./Policy";
import Market from "./Market";
import Technology from "./Technology";
import Mining from "./Mining";
import Talk from "./Talk";
import {Input} from "teaset";
import {Drawer} from "native-base";
import SideBar from "../nav/SideBar";
import HTML from 'react-native-render-html';
import {StringUtils} from "../../utils";
import Loading from "../../components/Loading";
import StatusBarUtil from "../../utils/StatusBarUtil";

const {width} = Dimensions.get('window');
let itemNo = 0;
export default class IndustryInformationContent extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            title: '',
            views: '',
            author: '',
            txt: '',
            tagStr: '',
            attr_newstypeId: '',
            visible: false,
            releaseDate: '',
            like: false,
            text: '',
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
        StatusBarUtil.setStatusBarStyle('#5691f7');
        store.get('userInfo').then(userInfo => {
            this.setState({userInfo}, () => {
                this._getCommentList(userInfo);
                this._getInfoDetail(userInfo);

            });
        })
    }

    componentWillUnmount(): void {
        console.log(311133, 'zoule');
    }

    _getInfoDetail = (userInfo) => {
        const {params} = this.props.navigation.state;
        let url = Config.requestUrl + Config.informationPage.listDetail + `?mobile=${userInfo.mobile}&id=${params.id}`;
        fetch(url, {method: 'POST'}).then(res => res.json()).then(responseText => {
            console.log('test', responseText);
            this.setState({visible: false}, () => {
                if (responseText.code === '200') {
                    const {title, views, author, txt, attr_newstypeId, releaseDate, hasCollect, tagStr} = responseText.body;
                    this.setState({
                        releaseDate,
                        tagStr,
                        title,
                        views,
                        author,
                        txt,
                        like: hasCollect,
                        attr_newstypeId: StringUtils.isEmpty(attr_newstypeId) ? '转载' : attr_newstypeId
                    });
                }
            });

        }).catch(error => {
            Toast.fail(error)
        })
    }

    _getCommentList = (userInfo) => {
        let url = Config.requestUrl + Config.myComment.commentList + `?mobile=${userInfo.mobile}&pageNo=${this.state.page}`;
        fetch(url, {method: 'POST'}).then(res => res.json()).then(responseText => {
            console.log(999, responseText);
            if (responseText.code === '200') {
                const {totalCount: total, body: list} = responseText;
                let totalPage = Math.ceil(total / 10);
                this._rebuildDataByPaging(list, totalPage);
            }
        }).catch(error => {
            ErrorUtil.getErrorLog(error)
        })
    }

    _renderHtml = (html) => {
        if (!StringUtils.isEmpty(html)) {
            console.log(333, html);
            return (
                <View style={{marginHorizontal: px2dp(30)}}>
                    <HTML html={html} baseFontStyle={{
                        fontSize: moderateScale(15),
                        color: "#333333",
                        lineHeight: px2dp(54),
                    }} onLinkPress={(evt, href) => {
                        console.log(333, href);
                        // Linking.openURL(href)
                    }} classesStyles={{'j-lazy': {display: 'none'}}}
                          imagesMaxWidth={Dimensions.get('window').width - 45}/>
                </View>
            );
        } else {
            return (<View/>);
        }
    }
    openDrawer = () => {
        this.drawer._root.open()
    };
    // 渲染
    closeDrawer = () => {
        this.drawer._root.close()
    }
    _toCollect = () => {
        const {mobile} = this.state.userInfo;
        const {params} = this.props.navigation.state;
        this.setState({like: !this.state.like, visible: true}, () => {
            let url = '';
            if (this.state.like) {
                url = Config.requestUrl + Config.myCollect.AddCollect + `&mobile=${mobile}&ids=${params.id}`;
            } else {
                url = Config.requestUrl + Config.myCollect.cancelCollect + `&mobile=${mobile}&ids=${params.id}`;
            }
            fetch(url, {method: 'POST'}).then(res => res.json()).then(responseText => {
                this.setState({visible: false}, () => {
                    if (responseText.code === '200') {
                        Toast.message(responseText.message);
                    } else {
                        Toast.message(responseText.message);
                    }
                });
            }).catch(error => {
                ErrorUtil.getErrorLog(error);
            })
        });
    }
    _onSubmitEdit = () => {
        const {params} = this.props.navigation.state;
        const {text, userInfo: {mobile}} = this.state;
        if (StringUtils.isEmpty(text)) {
            Toast.info('评论不能为空');
            return;
        }
        // * @param mobile
        // * @param contentId
        // * @param text
        this.setState({visible: true}, () => {
            let url = Config.requestUrl + Config.informationPage.commentOp + `?mobile=${mobile}&contentId=${params.id}&text=${text}`;
            fetch(url, {method: 'POST'}).then(res => res.json()).then(responseText => {
                console.log(333, responseText);
                this.setState({visible: false, text: ''}, () => {
                    if (responseText.success) {
                        Toast.message('评论成功');
                        this._getCommentList(this.state.userInfo);
                    } else {
                        Toast.message('评论失败');
                    }
                })

            }).catch(error => {
                ErrorUtil.getErrorLog(error);
            })
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
        // this.props.navigation.navigate('IndustryInfoContent', {id})
    }
    _renderItem = ({item}) => {
        console.log(444, item);
        return (
            <View style={{
                flexDirection: 'row', marginTop: px2dp(46), borderBottomWidth: 1,
                borderBottomColor: '#ebebeb',
                height: px2dp(250),
                justifyContent: 'center'
            }}>
                <View style={{width: width * 0.25,alignItems:'center'}}>
                    <Image source={{uri: item.commenterUserImg}} style={{borderRadius:px2dp(36),width: px2dp(72), height: px2dp(72)}}/>
                </View>
                <View style={{width: width * 0.75}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{
                            fontFamily: "PingFangSC-Regular",
                            fontSize: moderateScale(15),
                            width: width * 0.85 / 2,
                            textAlign: 'left',
                            color: "#222222"
                        }}>{item.commenterUsername}</Text>
                    </View>
                    <Text style={{
                        fontFamily: "PingFangSC-Regular",
                        fontSize: moderateScale(15),
                        marginTop: px2dp(34),
                        lineHeight: px2dp(50),
                        color: "#333333"
                    }}>
                        {item.text}
                    </Text>
                    <Text style={{
                        fontFamily: "PingFangSC-Regular",
                        fontSize: moderateScale(13),
                        marginTop: px2dp(32),
                        color: "#999999"
                    }}>{item.createTime}</Text>
                </View>
            </View>
        );
    }

    // 渲染
    render() {
        const {dataArray, isEmpty, title, views, author, like, text, tagStr, txt: html, attr_newstypeId, releaseDate} = this.state;
        let tagStrArray = tagStr.split(',');
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
                            <TouchableOpacity activeOpacity={0.8} onPress={() => {
                                console.log(33, this.props);
                                DeviceEventEmitter.emit('refreshList', true);
                                this.props.navigation.goBack()
                            }}>

                                <Image source={Images.back} style={{width: px2dp(40), height: px2dp(40)}}/>
                            </TouchableOpacity>
                            <Text style={{
                                fontSize: px2dp(36),
                                color: "#ffffff"
                            }}>行业资讯</Text>
                            <TouchableOpacity onPress={this.openDrawer} activeOpacity={0.8}>
                                <Image source={Images.nav} style={{width: px2dp(42), height: px2dp(36)}}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ScrollView keyboardShouldPersistTaps={Platform.OS === 'android' ? 'always' : 'never'}
                                showsVerticalScrollIndicator={false}>
                        <View style={{padding: px2dp(30)}}>
                            <Text style={{
                                fontSize: moderateScale(21),
                                color: "#222",
                                lineHeight: px2dp(58),
                            }}>
                                {title}
                            </Text>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: px2dp(40),
                                justifyContent: 'space-between'
                            }}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{
                                        fontSize: moderateScale(13),
                                        color: "#999999"
                                    }}>{author}</Text>
                                    <Text style={{
                                        width: px2dp(2),
                                        height: px2dp(20),
                                        marginLeft: StringUtils.isEmpty(author) ? 0 : px2dp(16),
                                        marginRight: px2dp(24),
                                        backgroundColor: "#999"
                                    }}>|</Text>
                                    <Text style={{
                                        fontSize: moderateScale(13),
                                        color: "#999999"
                                    }}>{releaseDate}</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Image source={Images.eyes} style={{width: px2dp(32), height: px2dp(20)}}/>
                                    <Text style={{
                                        marginLeft: px2dp(14),
                                        fontSize: moderateScale(13),
                                        color: "#999999"
                                    }}>{views + ''}</Text>
                                </View>
                            </View>
                        </View>
                        {this._renderHtml(html)}
                        <View style={{
                            paddingLeft: px2dp(30),
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: px2dp(72)
                        }}>
                            <Text style={{
                                fontSize: moderateScale(15),
                                color: "#333333", marginRight: px2dp(14)
                            }}>文章标签：</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <ScrollView showsHorizontalScrollIndicator={false}
                                            keyboardShouldPersistTaps={Platform.OS === 'android' ? 'always' : 'never'}
                                            horizontal={true}>
                                    {tagStrArray && tagStrArray.map(item => {
                                        return (
                                            <View style={{
                                                borderRadius: px2dp(32),
                                                marginLeft: px2dp(16),
                                                height: px2dp(48),
                                                justifyContent: 'center',
                                                backgroundColor: 'rgba(237,152,59,0.1)'
                                            }}>
                                                <Text style={{
                                                    paddingHorizontal: px2dp(18),
                                                    paddingVertical: px2dp(8),
                                                    textAlign: 'center',
                                                    fontSize: moderateScale(13),
                                                    color: "#ff9726"
                                                }}>{item}</Text>
                                            </View>
                                        );
                                    })
                                    }
                                </ScrollView>
                            </View>
                        </View>
                        <View style={{paddingHorizontal: px2dp(30), marginTop: px2dp(70),}}>
                            <View style={{
                                borderRadius: px2dp(4),
                                paddingRight: px2dp(42),
                                paddingBottom: px2dp(48),
                                backgroundColor: "#fafafa"
                            }}>
                                <Text style={{
                                    marginLeft: px2dp(36), marginTop: px2dp(46),
                                    fontSize: moderateScale(15),
                                    color: "#333333"
                                }}>
                                    声明：
                                </Text>
                                <Text style={{
                                    marginTop: px2dp(38),
                                    marginLeft: px2dp(34),
                                    fontSize: moderateScale(14),
                                    color: "#333333",
                                    lineHeight: px2dp(48)
                                }}>
                                    {attr_newstypeId === '转载' ? '本文由区块链音符转载收录，观点仅代表作者本人，不代表区块链音符立场，区块链音符不对所包含内容的准确性、可靠性或完整性提供任何明示或暗示的保证。若以此作为投资依据，请自行承担全部责任。' : '本文系区块链音符原创稿件，版权属区块链音符所有，转载时须注明"稿件来源：区块链音符"，违者将依法追究责任。'}
                                </Text>
                                <Text style={{
                                    marginLeft: px2dp(36), fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(15),
                                    marginTop: px2dp(58),
                                    color: "#333333"
                                }}>
                                    提示：
                                </Text>
                                <Text style={{
                                    marginTop: px2dp(38),
                                    marginLeft: px2dp(34),
                                    lineHeight: px2dp(48),
                                    fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(14),
                                    color: "#333333"
                                }}>
                                    投资有风险，入市须谨慎。本资讯不作为投资理财建议。
                                </Text>
                            </View>
                        </View>
                        <Text style={{
                            marginTop: px2dp(30),
                            marginLeft: px2dp(28),
                            fontSize: moderateScale(18),
                            color: "#222222"
                        }}>
                            热门评论
                        </Text>
                            <FlatList
                                data={dataArray}
                                nestedScrollEnabled={true}
                                keyExtractor={this._keyExtractor}
                                renderItem={this._renderItem}
                                ListFooterComponent={this._renderFooter}
                                onEndReached={this._onEndReached}
                                onEndReachedThreshold={0.1}
                                ListEmptyComponent={
                                    !isEmpty ? <View/> :
                                        <View style={{height: px2dp(554 * 2), justifyContent: 'center',}}>
                                            <View style={{alignItems: 'center'}}>
                                                <Image source={Images.empty}
                                                       style={{width: px2dp(490), height: px2dp(300)}}/>
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
                    <View style={{flex: 1, justifyContent: 'flex-end'}}>
                        <View style={{height: px2dp(98), justifyContent: 'center', backgroundColor: '#fff'}}>
                            <View style={{
                                marginLeft: px2dp(30),
                                marginRight: px2dp(36),
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <Image source={Images.news_back} style={{width: px2dp(22), height: px2dp(34)}}/>
                                <View style={{
                                    marginLeft: px2dp(30),
                                    flexDirection: 'row',
                                    flex: 1,
                                    height: px2dp(64),
                                    alignItems: 'center',
                                    borderRadius: px2dp(32),
                                    backgroundColor: "#f5f5f5"
                                }}>
                                    <Image source={Image.comment} style={{width: px2dp(30), height: px2dp(30)}}/>
                                    <Input placeholder={'写评论'} style={{
                                        flex: 1,
                                        fontFamily: "PingFangSC-Regular",
                                        fontSize: moderateScale(13),
                                        color: "#999999",
                                        borderWidth: 0, height: px2dp(64), backgroundColor: 'transparent'
                                    }} value={text} onChangeText={(text) => {
                                        this.setState({text});
                                    }} onSubmitEditing={this._onSubmitEdit}/>
                                </View>
                                <TouchableOpacity activeOpacity={0.8} onPress={this._onSubmitEdit}>
                                    <Image source={Images.message}
                                           style={{width: px2dp(38), marginLeft: px2dp(36), height: px2dp(40)}}/>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.8} onPress={this._toCollect}>
                                    <Image source={like ? Images.like : Images.dislike}
                                           style={{width: px2dp(38), marginLeft: px2dp(40), height: px2dp(36)}}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Drawer>
                <Loading visible={this.state.visible}/>
            </SafeAreaView>
        );
    }
}

