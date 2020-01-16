import React, {PureComponent} from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    ImageBackground,
    SafeAreaView,
    Image,
    TouchableOpacity,
    TouchableNativeFeedback,
    TouchableHighlight,
    Text,
    TextInput,
    DeviceEventEmitter,
    StatusBar
} from 'react-native' ;
import Title from '../components/Title'
import SmallButton from "../components/SmallButton";
import Loading from "../components/Loading";
import {StringUtils} from "../utils/StringUtils";
import {Dialog} from "beeshell";
import {Input} from "teaset";
import StatusBarUtil from "../utils/StatusBarUtil";
import ErrorUtil from "../utils/ErrorUtil";

const {width, height} = Dimensions.get('window');
export default class Login extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            phone: '',
            disabled: false, seconds: 60,
            password: '',
            phoneLogin: true,
            verifyCode: '',
            smsSendType: 4,
            userName: '',
            isForgetPwd: false,
            visible: false,
            openEye: false,
            showClearBtn: false
        }
        this.timer = null;

    }

    _openEyeState = () => {
        this.setState({openEye: !this.state.openEye});
    }

    componentWillMount(): void {
        StatusBarUtil.setStatusBarStyle('#F5F9FF');
    }

    componentWillUnmount(): void {
        this.timer && clearInterval(this.timer);
        this.resetPwdListener&&this.resetPwdListener.remove();
    }
    componentDidMount(): void {
        this.resetPwdListener=DeviceEventEmitter.addListener('resetPwdSuccess',(result)=>{
            this.setState({isForgetPwd:false});
        })
    }

    _sendVerifyCode = () => {
        const {phone, password, userName, smsSendType, verifyCode} = this.state;
        if (!StringUtils.isMobile(phone)) {
            Toast.info('请检查手机号');
            return;
        }
        this.setState({visible: true,}, () => {
            let url = Config.requestUrl + Config.registerPage.sendMsg + `?mobilePhone=${phone}&smsSendType=${smsSendType}&vCode=${verifyCode}&username=${userName}`;

            fetch(url, {method: 'POST'}).then(res => {
                console.log(888, res);
                return res.json()
            }).then(responseText => {
                console.log(333, responseText);
                this.setState({visible: false, disabled: true}, () => {
                    let seconds = 60;
                    if (responseText.code === '200') {
                        this.timer = setInterval(() => {
                            this.setState({seconds: seconds--});
                            if (this.state.seconds === 1) {
                                clearInterval(this.timer);
                                this.setState({seconds: 60, disabled: false});
                            }

                        }, 1000);
                        Toast.message(`短信发送` + responseText.message);
                    } else {
                        Toast.message(responseText.message);
                        this.setState({disabled: false, seconds: 60});
                    }
                });

            }).catch(error => {
                ErrorUtil.getErrorLog(error);
            })
        });
    }
    _forgetPwd = () => {
        this.setState({phoneLogin: true, isForgetPwd: true, smsSendType: 6});
    }

    _toLogin = () => {
        // this.props.navigation.navigate('Main');
        const {phone, password, phoneLogin, isForgetPwd, confirmPassword, verifyCode} = this.state;
        if (isForgetPwd) {
            if (!StringUtils.isMobile(phone)) {
                Toast.info('请检查手机号');
                return;
            }
            if (StringUtils.isEmpty(verifyCode)) {
                Toast.info('请先输入验证码');
                return;
            }
            this.setState({visible: true}, () => {
                let url = Config.requestUrl + Config.loginPage.forgetPwd + `?mobile=${phone}&captcha=${verifyCode}`;
                fetch(url, {method: 'POST'}).then(res => res.json()).then(responseText => {
                    this.setState({visible: false}, () => {
                        if (responseText.code === '200') {
                            Toast.message(responseText.message);
                            this.props.navigation.navigate('ForgetPwd', {phone});
                        } else {
                            Toast.message(responseText.message);
                        }
                    });

                }).catch(error => {
                    ErrorUtil.getErrorLog(error)
                })
            });

        } else {

            if (phoneLogin) {
                if (!StringUtils.isMobile(phone)) {
                    Toast.info('请检查手机号');
                    return;
                }
                if (StringUtils.isEmpty(verifyCode)) {
                    Toast.info('请先输入验证码');
                    return;
                }
            } else {
                if (!StringUtils.isMobile(phone)) {
                    Toast.info('请检查手机号');
                    return;
                }
                if (StringUtils.isEmpty(password)) {
                    Toast.info('密码不能为空');
                    return;
                }
            }
            let url = '';
            if (this.state.phoneLogin) {
                url = Config.requestUrl + Config.loginPage.phoneLogin + `?mobile=${this.state.phone}&captcha=${this.state.verifyCode}`;
            } else {
                url = Config.requestUrl + Config.loginPage.passwordLogin + `?mobile=${this.state.phone}&password=${this.state.password}`;
            }
            this.setState({visible: true, isForgetPwd: false}, () => {
                fetch(url, {method: 'POST'}).then(res => {

                    console.log(3333, res);
                    return res.json()
                }).then(responseText => {
                    console.log(888, responseText);
                    this.setState({visible: false}, () => {
                        if (responseText.code === '200') {
                            Toast.message(`登录成功`);
                            const {user: {appuserId, mobile, realname}} = responseText.body;
                            store.save('userInfo', {userId: appuserId, mobile, trueName: realname}).then(() => {
                                this.props.navigation.navigate('Main');
                            })

                        } else {
                            Toast.message(responseText.message);
                        }
                    });

                }).catch(error => {
                    ErrorUtil.getErrorLog(error);
                })
            });
        }

    }
    _loginWay = () => {
        this.setState({phoneLogin: !this.state.phoneLogin,isForgetPwd:false});
    }
    _register = () => {
        this.props.navigation.navigate('Register')
    }

    // 渲染
    render() {
        const {phone, isForgetPwd, phoneLogin, seconds, openEye, password, verifyCode, showClearBtn} = this.state;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
                <Image source={Images.banner} style={{width: px2dp(750), height: px2dp(561)}}/>
                <View style={{paddingHorizontal: px2dp(90)}}>
                    <View style={{
                        height: px2dp(98),
                        shadowColor: "#efefef",
                        shadowOffset: {
                            width: 0,
                            height: 1
                        },
                        justifyContent: 'center',
                        shadowRadius: 0,
                        shadowOpacity: 1,
                        borderBottomWidth: 1,
                        borderBottomColor: '#EFEFEF',
                    }}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={{
                                    fontSize: moderateScale(15),
                                    color: "#222222"
                                }}>+86</Text>
                                <View style={{
                                    width: 1,
                                    marginLeft: px2dp(30),
                                    height: 20,
                                    backgroundColor: "#efefef"
                                }}>
                                    <Text>|</Text>
                                </View>
                            </View>
                            <Input style={{
                                height: px2dp(96),
                                fontSize: moderateScale(15),
                                color: "#222222", backgroundColor: 'transparent', borderWidth: 0, flex: 1,
                            }} value={phone} placeholder={'输入手机号'} onChangeText={(phone) => {
                                this.setState({phone}, () => {
                                    if (phone.length > 0) {
                                        this.setState({showClearBtn: true});
                                    } else {
                                        this.setState({showClearBtn: false});
                                    }
                                });
                            }}/>
                            {showClearBtn ?
                                <Image source={Images.clear} style={{width: px2dp(26), height: px2dp(26)}}/> : <View/>}
                        </View>
                    </View>
                    {phoneLogin ? <View style={{
                        height: px2dp(98),
                        shadowColor: "#efefef",
                        shadowOffset: {
                            width: 0,
                            height: 1
                        },
                        justifyContent: 'center',
                        shadowRadius: 0,
                        shadowOpacity: 1,
                        borderBottomWidth: 1,
                        borderBottomColor: '#EFEFEF',
                    }}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Input style={{
                                height: px2dp(96),
                                fontSize: moderateScale(15),
                                color: "#222222", backgroundColor: 'transparent', borderWidth: 0, flex: 1,
                            }} value={verifyCode} onChangeText={(verifyCode) => {
                                this.setState({verifyCode});
                            }} placeholder={'输入验证码'}/>
                            <TouchableOpacity activeOpacity={.75} disabled={this.state.disabled}
                                              onPress={this._sendVerifyCode}>
                                <View style={{height: px2dp(96), justifyContent: 'center'}}>
                                    <Text style={{
                                        fontSize: moderateScale(13),
                                        color: "#5081ec"
                                    }}>{seconds === 60 ? '获取验证码' : seconds + `s重新获取`}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View> : <View style={{
                        height: px2dp(98),
                        shadowColor: "#efefef",
                        shadowOffset: {
                            width: 0,
                            height: 1
                        },
                        justifyContent: 'center',
                        shadowRadius: 0,
                        shadowOpacity: 1,
                        borderBottomWidth: 1,
                        borderBottomColor: '#EFEFEF',
                    }}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Input style={{
                                height: px2dp(96),
                                fontSize: moderateScale(15),
                                color: "#222222", backgroundColor: 'transparent', borderWidth: 0, flex: 1,
                            }} secureTextEntry={openEye ? false : true} value={password} onChangeText={(password) => {
                                this.setState({password});
                            }} placeholder={'输入密码'}/>
                            <TouchableOpacity activeOpacity={.75} onPress={this._openEyeState}>
                                <View style={{height: px2dp(96), justifyContent: 'center'}}>
                                    <Image source={openEye ? Images.open_eye : Images.close_eye} resizeMode={'contain'}
                                           style={{width: px2dp(30), height: px2dp(30)}}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>}
                    <TouchableOpacity activeOpacity={0.8} onPress={this._forgetPwd}>
                        <Text style={{
                            textAlign: 'right',
                            paddingVertical: px2dp(26),
                            fontSize: moderateScale(13),
                            color: "#5b5b5b"
                        }}>忘记密码</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.75} onPress={this._toLogin}>
                        <View style={{
                            height: px2dp(88), marginTop: px2dp(50), borderRadius: px2dp(10),
                            backgroundColor: "#5691f7", justifyContent: 'center'
                        }}>
                            <Text style={{
                                fontSize: moderateScale(16),
                                color: "#ffffff",
                                textAlign: 'center'
                            }}>{isForgetPwd ? '下一步' : '登录'}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{height: px2dp(78), justifyContent: 'center'}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <TouchableOpacity onPress={this._register} activeOpacity={0.8}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{
                                        fontSize: moderateScale(13),
                                        color: "#5b5b5b"
                                    }}>没有账号？</Text>
                                    <Text style={{
                                        fontSize: moderateScale(13),
                                        color: '#5691f7',
                                    }}>注册</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this._loginWay} activeOpacity={0.8}>
                                <Text style={{
                                    fontSize: moderateScale(13),
                                    color: "#5691f7"
                                }}>{!phoneLogin ? '手机快捷登录' : '账号密码登录'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <Loading visible={this.state.visible}/>
            </SafeAreaView>

        );
    }

}
