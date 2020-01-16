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
    DeviceEventEmitter,
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


    _openEyeState1 = () => {
        this.setState({openEye1: !this.state.openEye1});
    }
    _openEyeState2 = () => {
        this.setState({openEye2: !this.state.openEye2});
    }
    _resetPwd=()=>{
        const { password, confirmPassword,} = this.state;

        if (StringUtils.isEmpty(password)) {
            Toast.info('密码不能为空');
            return;
        }
        if (password !== confirmPassword) {
            Toast.info('密码输入不一致');
            return;
        }
        const {params}=this.props.navigation.state;
        let url = Config.requestUrl + Config.loginPage.resetPwd+`?mobile=${params.phone}&password=${password}`;
        fetch(url,{method:'POST'}).then(res=>res.json()).then(responseText=>{
            console.log(888,responseText);
            if(responseText.code==='200'){
                Toast.message(responseText.message);
                DeviceEventEmitter.emit('resetPwdSuccess',true);
                this.props.navigation.goBack();
            }
        }).catch(error=>{
            Toast.fail(error)
        })
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
                    <TouchableOpacity activeOpacity={0.75} onPress={this._resetPwd}>
                        <View style={{
                            height: px2dp(88), marginTop: px2dp(50), borderRadius: px2dp(10),
                            backgroundColor: "#5691f7", justifyContent: 'center'
                        }}>
                            <Text style={{
                                fontSize: moderateScale(16),
                                color: "#ffffff",
                                textAlign: 'center'
                            }}>完成</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <Loading visible={this.state.visible}/>
            </SafeAreaView>
        );
    }

}
