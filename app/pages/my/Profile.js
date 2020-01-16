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
import StatusBarUtil from "../../utils/StatusBarUtil";
import Loading from "../../components/Loading";

export default class Profile extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            avatarSource: Images.avatar,
            visible:true,
            realName:'',
            member:'',
            userInfo:null,
        }
    }
    componentWillMount(): void {
        store.get('userInfo').then(userInfo=>{
            this.setState({userInfo},()=>{
                this._getPersonData(userInfo);
            });

        })
    }
    _getPersonData=(userInfo)=>{
        let url  = Config.requestUrl  + Config.personData.getUserDataUrl + `?mobile=${userInfo.mobile}`;
        fetch(url,{method:'POST'}).then(res=>{
            console.log('lajis',res);
            return    res.json()

        }).then(responseText=>{
            console.log(331133,responseText);
            this.setState({visible:false},()=>{
                if(responseText.code==='200'){
                    const {comefrom,birthday,qq,gender,userImg,user:{username,realname,mobile,group:{name}}}=responseText.body;
                    this.setState({comefrom,birthday,qq,gender,realName:realname,member:name,avatarSource:{uri:userImg}});
                }
            });

        }).catch(error=>{
            ErrorUtil.getErrorLog(error);
        })
    }
    componentDidMount(): void {
        this.updateUserInfoListener=DeviceEventEmitter.addListener('updateUserInfo',(result)=>{
            this.setState({visible:true},()=>{
                this._getPersonData(this.state.userInfo);
            });

        })
    }
    componentWillUnmount(): void {
        this.updateUserInfoListener&&this.updateUserInfoListener.remove();
    }

    _jumpToPersonalDataPage = () => {
        this.props.navigation.navigate('PersonalData')
    }
    _toSecuritySettingsPage = () => {
        this.props.navigation.navigate('SecuritySettings')
    }
    _toMessage = () => {
        this.props.navigation.navigate('Message');
    }
    _toProject = () => {
        this.props.navigation.navigate('Project');
    }
    _toAct = () => {
        this.props.navigation.navigate('Act');
    }
    _toAd = () => {
        this.props.navigation.navigate('Ad');
    }
    _toComment = () => {
        this.props.navigation.navigate('Comment');
    }
    _toCollect = () => {
        this.props.navigation.navigate('Collection');
    }

    // 渲染
    render() {
        const {avatarSource,realName,member} = this.state;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#f5f5f5'}}>
                <View style={{
                    height: px2dp(266),
                    backgroundColor: "#5691f7"
                }}>
                    <Text style={{
                        fontSize: moderateScale(18),
                        marginTop: px2dp(28),
                        textAlign: 'center',
                        color: "#ffffff",
                    }}>个人中心</Text>
                </View>
                <View style={{
                    position: 'absolute',
                    zIndex: 10,
                    top: px2dp(140), left: 0, right: 0, flexDirection: 'row', justifyContent: 'center'
                }}>
                    <ImageBackground source={Images.round_bg} style={{width: px2dp(345 * 2),}}>
                        <TouchableOpacity activeOpacity={0.75}
                                          onPress={() => this.props.navigation.navigate('PersonalData')}>
                            <View style={{
                                borderRadius: px2dp(8),
                                paddingHorizontal: px2dp(30),
                                paddingTop: px2dp(48),
                                width: px2dp(345 * 2),
                                paddingBottom: px2dp(66)
                            }}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Image source={avatarSource}
                                           style={{
                                               width: px2dp(51 * 2),
                                               height: px2dp(51 * 2),
                                               borderRadius: px2dp(51)
                                           }}/>
                                    <View style={{marginLeft: px2dp(36)}}>
                                        <Text style={{
                                            fontSize: moderateScale(16),
                                        }}>{realName}</Text>
                                        <View
                                            style={{flexDirection: 'row', alignItems: 'center', marginTop: px2dp(26)}}>
                                            <Image source={Images.level}
                                                   style={{width: px2dp(172), height: px2dp(36)}}/>
                                            <Text style={{
                                                fontSize: moderateScale(13),
                                                color: "#5691f7", position: 'relative',
                                                left: px2dp(-120),
                                            }}>{'普通会员'}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </ImageBackground>
                </View>
                <View style={{backgroundColor: '#fff'}}>
                    <Menu title={'个人资料'} style={{marginTop: px2dp(100)}} source={Images.person_data}
                          imageStyle={{width: px2dp(36), height: px2dp(30)}} onPress={this._jumpToPersonalDataPage}/>
                </View>
                <Menu title={'我的收藏'} onPress={this._toCollect} source={Images.my_collect}
                      imageStyle={{width: px2dp(36), height: px2dp(36)}}/>
                <Menu title={'我的评论'} onPress={this._toComment} source={Images.my_comment}
                      imageStyle={{width: px2dp(36), height: px2dp(36)}}/>
                <Menu title={'我的广告'} onPress={this._toAd} source={Images.my_ad}
                      imageStyle={{width: px2dp(32), height: px2dp(34)}}/>
                <Menu title={'我的活动'} onPress={this._toAct} source={Images.my_activity}
                      imageStyle={{width: px2dp(36), height: px2dp(36)}}/>
                <Menu title={'我的项目'} onPress={this._toProject} source={Images.my_project}
                      imageStyle={{width: px2dp(30), height: px2dp(26)}}/>
                <Menu title={'站内信息'} onPress={this._toMessage} style={{marginTop: px2dp(24)}} source={Images.msg}
                      imageStyle={{width: px2dp(30), height: px2dp(36)}}/>
                <Menu title={'安全设置'} onPress={this._toSecuritySettingsPage} source={Images.user_settings}
                      imageStyle={{width: px2dp(34), height: px2dp(34)}}/>
                      <Loading visible={this.state.visible}/>
            </SafeAreaView>
        );
    }
}
const Menu = (props) => {
    return (
        <TouchableOpacity activeOpacity={.75} onPress={props.onPress}>
            <View style={[props.style, {
                backgroundColor: '#fff',
                height: px2dp(98),
                justifyContent: 'center',
            }]}>
                <View style={{
                    paddingLeft: px2dp(36),
                    paddingRight: px2dp(28), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image source={props.source} style={props.imageStyle} resizeMode={'contain'}/>
                        <Text style={{
                            marginLeft: px2dp(22),
                            fontSize: moderateScale(14),
                            color: "#333333"
                        }}>{props.title}</Text>
                    </View>
                    <Image source={Images.arrow_right} style={{width: px2dp(16), height: px2dp(24)}}/>
                </View>
            </View>
        </TouchableOpacity>
    );
}
