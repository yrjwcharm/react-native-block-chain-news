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
    TouchableOpacity
} from 'react-native'
import Title from '../../components/Title'
import {Drawer} from "native-base";
import SideBar from "../nav/SideBar";
import {StringUtils} from "../../utils";
import HTML from "react-native-render-html";
import Loading from "../../components/Loading";

export default class ProjectNavigatorDetail extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            channelName: '', title: '', contentImg: '', txt: '', attr_projectweb: '', description: '',
            like: false,
            userInfo:null,
            visible:true,
        }
    }

    componentDidMount(): void {
        store.get('userInfo').then(userInfo=>{
            this.setState({userInfo},()=>{
                this._getProjectNavigatorDetail(userInfo);
            })
        })
    }

    _getProjectNavigatorDetail = (userInfo) => {
        const {params} = this.props.navigation.state;
        let url = Config.requestUrl + Config.projectNavigator.listDetail + `?mobile=${userInfo.mobile}&id=${params.id}`;
        console.log(3333, url);
        fetch(url, {method: 'POST'}).then(res => res.json()).then(responseText => {
            console.log(76, responseText);
            this.setState({visible:false},()=>{
                if (responseText.code === '200') {
                    const {channelName, attr_projectweb, title, contentImg, txt, description,hasCollect} = responseText.body;
                    this.setState({channelName, title,like:hasCollect, attr_projectweb, description, contentImg, txt});
                }
            });

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
    _renderHtml = (html) => {
        if (!StringUtils.isEmpty(html)) {
            console.log(333, html);
            return (
                <View style={{marginHorizontal: px2dp(30)}}>
                    <HTML html={html} baseFontStyle={{
                        fontFamily: "PingFangSC-Regular",
                        fontSize: moderateScale(16),
                        color: "#333333",
                        lineHeight: px2dp(54),
                    }} imagesMaxWidth={Dimensions.get('window').width - 45}/>
                </View>

            );
        } else {
            return (<View/>);
        }
    }
    _toCollect = () => {
        const {mobile}=this.state.userInfo;
        const {params} = this.props.navigation.state;
        this.setState({like: !this.state.like,visible:true},()=>{
            let url ='';
            if(this.state.like){
                 url = Config.requestUrl + Config.myCollect.AddCollect + `&mobile=${mobile}&ids=${params.id}`;
            }else{
                 url = Config.requestUrl + Config.myCollect.cancelCollect + `&mobile=${mobile}&ids=${params.id}`;
            }
            fetch(url,{method:'POST'}).then(res=>res.json()).then(responseText=>{
                this.setState({visible: false}, () => {
                    if (responseText.code === '200') {
                        Toast.message(responseText.message);
                    } else {
                        Toast.message(responseText.message);
                    }
                });
            }).catch(error=>{
                ErrorUtil.getErrorLog(error);
            })
        });
    }

    // 渲染
    render() {
        const {channelName, like,description, attr_projectweb, title, contentImg, txt: html} = this.state;
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
                            }}>{title.substring(0, 10)}</Text>
                            <TouchableOpacity onPress={this.openDrawer} activeOpacity={0.8}>
                                <Image source={Images.nav} style={{width: px2dp(42), height: px2dp(36)}}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ScrollView keyboardShouldPersistTaps={Platform.OS === 'android' ? 'always' : 'never'}
                                showsVerticalScrollIndicator={false}>
                        <View style={{padding: px2dp(30)}}>
                            <ImageBackground resizeMode={'stretch'} source={Images.project_navigator_round}
                                             style={{width: px2dp(345 * 2)}}>
                                <View style={{height: px2dp(226), justifyContent: 'center',}}>
                                    <View style={{
                                        marginHorizontal: px2dp(40),
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}>
                                        <Image source={{uri: contentImg}}
                                               style={{width: px2dp(160), height: px2dp(160)}}/>
                                        <View style={{marginLeft: px2dp(40)}}>
                                            <View style={{flexDirection: 'row', }}>
                                                <Text style={{
                                                    fontFamily: "PingFangSC-Medium",
                                                    textAlign: 'left',
                                                    width: px2dp(320),
                                                    marginRight: px2dp(20),
                                                    fontSize: moderateScale(18),
                                                    color: "#222222"
                                                }}>{title}</Text>
                                                <View>
                                                    <TouchableOpacity activeOpacity={0.8}
                                                                      onPress={() => Linking.openURL(attr_projectweb)}>
                                                        <Image source={Images.lianjie}
                                                               resizeMode={'contain'}
                                                               style={{width: px2dp(40), height: px2dp(40)}}/>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity activeOpacity={0.8} onPress={this._toCollect}>
                                                        <Image source={like ? Images.like : Images.dislike}
                                                               style={{width: px2dp(38),marginTop:px2dp(20),height: px2dp(36)}}/>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                            <View style={{
                                                borderRadius: px2dp(4),
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                height: px2dp(40),
                                                backgroundColor: "#eaf2ff",
                                                width: px2dp(160),
                                            }}>
                                                <Text style={{
                                                    fontFamily: "PingFangSC-Regular",
                                                    textAlign: 'center',
                                                    fontSize: moderateScale(10),
                                                    color: "#5691f7",
                                                }}>{channelName}</Text>

                                            </View>

                                        </View>

                                    </View>
                                </View>
                            </ImageBackground>
                            <View style={{marginTop: px2dp(60)}}/>
                        </View>
                        <Text style={{
                            marginLeft: px2dp(30),
                            color: '#333',
                            fontWeight: 'bold',
                            fontSize: moderateScale(20)
                        }}>项目简介</Text>
                        <Text style={{
                            marginHorizontal: px2dp(30),
                            marginTop: px2dp(30),
                            color: '#333', fontSize: moderateScale(16),
                            lineHeight: px2dp(42),
                        }}>{description}</Text>
                        <Text style={{
                            marginLeft: px2dp(30),
                            fontWeight: 'bold',
                            color: '#333',
                            marginTop: px2dp(60),
                            fontSize: moderateScale(20)
                        }}>项目亮点</Text>
                        {this._renderHtml(html)}
                    </ScrollView>
                </Drawer>
                <Loading visible={this.state.visible}/>
            </SafeAreaView>
        );
    }

}
