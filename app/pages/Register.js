import React, {PureComponent} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Image,
    FlatList,
    Platform,
    BackHandler,
    View,
    Text,
    TextInput,
    Alert,
    ImageBackground,
    TouchableOpacity, StatusBar
} from 'react-native'
import Title from '../components/Title'
import SmallButton from "../components/SmallButton";
import {StringUtils} from "../utils";
import {Input} from "teaset";
import StatusBarUtil from "../utils/StatusBarUtil";
import ErrorUtil from "../utils/ErrorUtil";
import Loading from "../components/Loading";

export default class Register extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            phone: '',
            agree: false,
            confirmPassword: '',
            password: '',
            userName: '',
            verifyCode: '',
            seconds: 60,
            showClearBtn: false,
            openEye1: false,
            disabled: false,
            openEye2: false,
            visible: false,
        }
        this.timer = null;
    }

    componentWillMount(): void {
        StatusBarUtil.setStatusBarStyle('#F5F9FF');
    }

    componentWillUnmount(): void {
        this.timer && clearInterval(this.timer);
    }

    _openEyeState1 = () => {
        this.setState({openEye1: !this.state.openEye1});
    }
    _openEyeState2 = () => {
        this.setState({openEye2: !this.state.openEye2});
    }
    _sendVerifyCode = () => {
        const {phone, password, userName, confirmPassword, verifyCode} = this.state;
        if (!StringUtils.isMobile(phone)) {
            Toast.info('请检查手机号');
            return;
        }
        this.setState({visible: true,}, () => {
            let url = Config.requestUrl + Config.registerPage.sendMsg + `?mobilePhone=${phone}&smsSendType=5&vCode=${verifyCode}&username=${userName}`;

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
    _toRegister = () => {
        const {phone, password, confirmPassword, verifyCode} = this.state;
        if (!StringUtils.isMobile(phone)) {
            Toast.info('请检查手机号');
            return;
        }
        if (StringUtils.isEmpty(password)) {
            Toast.info('密码不能为空');
            return;
        }
        if (password !== confirmPassword) {
            Toast.info('密码输入不一致');
            return;
        }
        if (StringUtils.isEmpty(verifyCode)) {
            Toast.info('请先输入验证码');
            return;
        }
        if (!this.state.agree) {
            Toast.info('请先同意注册协议')
            return;
        }
        this.setState({visible: true}, () => {
            let url = Config.requestUrl + Config.registerPage.register + `?mobile=${phone}&password=${password}&captcha=${verifyCode}`;
            fetch(url, {method: 'POST'}).then(res => {
                console.log(888, res);
                return res.json()

            }).then(responseText => {
                console.log(3333, responseText);
                this.setState({visible: false}, () => {
                    if (responseText.code === '200') {
                        Toast.message(responseText.message);
                        this.props.navigation.goBack();
                    } else {
                        Toast.message(responseText.message);
                    }
                });

            }).catch(error => {
                ErrorUtil.getErrorLog(error);
            })
        });

    }
    _agreeProtocol = () => {
        this.setState({agree: !this.state.agree});
    }

    // 渲染
    render() {
        const {phone, seconds, password, agree, confirmPassword, openEye1, openEye2, verifyCode, showClearBtn} = this.state;
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
                            }} value={phone} placeholder={'请输入手机号'} onChangeText={(phone) => {
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
                            <Input style={{
                                height: px2dp(96),
                                fontSize: moderateScale(15),
                                color: "#222222", backgroundColor: 'transparent', borderWidth: 0, flex: 1,
                            }} value={password} onChangeText={(password) => {
                                this.setState({password});
                            }} secureTextEntry={openEye1 ? false : true} placeholder={'输入密码'}/>
                            <TouchableOpacity activeOpacity={.75} onPress={this._openEyeState1}>
                                <View style={{height: px2dp(96), justifyContent: 'center'}}>
                                    <Image source={openEye1 ? Images.open_eye : Images.close_eye} resizeMode={'contain'}
                                           style={{width: px2dp(30), height: px2dp(30)}}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
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
                            <Input style={{
                                height: px2dp(96),
                                fontSize: moderateScale(15),
                                color: "#222222", backgroundColor: 'transparent', borderWidth: 0, flex: 1,
                            }} value={confirmPassword} onChangeText={(confirmPassword) => {
                                this.setState({confirmPassword});
                            }} secureTextEntry={openEye2 ? false : true} placeholder={'再次输入密码'}/>
                            <TouchableOpacity activeOpacity={.75} onPress={this._openEyeState2}>
                                <View style={{height: px2dp(96), justifyContent: 'center'}}>
                                    <Image source={openEye2 ? Images.open_eye : Images.close_eye} resizeMode={'contain'}
                                           style={{width: px2dp(30), height: px2dp(30)}}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
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
                    </View>
                    <TouchableOpacity activeOpacity={0.75} onPress={this._toRegister}>
                        <View style={{
                            height: px2dp(88), marginTop: px2dp(50), borderRadius: px2dp(10),
                            backgroundColor: "#5691f7", justifyContent: 'center'
                        }}>
                            <Text style={{
                                fontSize: moderateScale(16),
                                color: "#ffffff",
                                textAlign: 'center'
                            }}>注册</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{height: px2dp(80), justifyContent: 'center'}}>
                        <TouchableOpacity activeOpacity={0.8} onPress={this._agreeProtocol}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Image source={agree ? Images.agree : Images.disagree} resizeMode={'contain'}
                                       style={{width: px2dp(28), height: px2dp(28)}}/>
                                <View style={{marginLeft: px2dp(10), flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{
                                        fontSize: moderateScale(11),
                                        color: "#5b5b5b"
                                    }}>
                                        我已经阅读并同意
                                    </Text>
                                    <Text style={{
                                        fontSize: moderateScale(11),
                                        color: "#5691f7"
                                    }}>《用户注册协议》</Text>
                                </View>

                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <Loading visible={this.state.visible}/>
            </SafeAreaView>
        );
    }

}
