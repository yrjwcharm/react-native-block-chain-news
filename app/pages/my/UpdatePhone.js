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
import {Input} from "teaset";
import {StringUtils} from "../../utils";
import ErrorUtil from "../../utils/ErrorUtil";
import Loading from "../../components/Loading";

export default class UpdatePhone extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            phone: '',
            disabled: false, seconds: 60,
            visible:false,
            smsSendType:3,
            userName:'',
        }
        this.timer=null;
    }
    componentDidMount(): void {
        store.get('userInfo').then(userInfo=>{
            this.setState({userInfo,phone:userInfo.mobile});
        })
    }

    _back=()=>{
        this.props.navigation.goBack();
    }
    _sendVerifyCode=()=>{
        const {phone,verifyCode,smsSendType,userName} = this.state;
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
    _toUpdatePhone=()=>{
        // * @param mobile
        // * @param captcha
        const  {phone,verifyCode}= this.state;
        if(!StringUtils.isMobile(phone)){
            Toast.info('请检查手机号');
            return;
        }
        if (StringUtils.isEmpty(verifyCode)){
            Toast.info('验证码不能为空');
            return;
        }
        this.setState({visible:true},()=>{
            let url = Config.requestUrl  +  Config.updatePhonePage.step1 +  `?mobile=${phone}&captcha=${verifyCode}`;
            console.log(999,url);
            fetch(url,{method:'POST'}).then(res=>res.json()).then(responseText=>{
                console.log(888,responseText);
                this.setState({visible:false},()=>{
                    if(responseText.code==='200'){
                        Toast.message(responseText.message);
                        this.props.navigation.navigate('UpdPhone',{phone});
                    }else{
                        Toast.message(responseText.message);
                    }
                })

            }).catch(error=>{
                ErrorUtil.getErrorLog(error);
            })
        });

    }
    // 渲染
    render() {
        const {verifyCode, phone,seconds} = this.state;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#f5f5f5'}}>
                <Title title={'修改手机号'} source={Images.icon_back} back onPressBack={this._back}/>
                <View style={{
                    height: px2dp(98),
                    marginTop: px2dp(24),
                    backgroundColor: '#fff', justifyContent: 'center',
                }}>
                    <View style={{
                        paddingHorizontal: px2dp(30),
                        borderBottomColor: '#ededed',
                        borderBottomWidth: 1
                    }}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{color: '#333', fontSize: moderateScale(14)}}>原手机号</Text>
                            <Input style={{
                                height: px2dp(96),
                                fontSize: moderateScale(15),
                                color: "#222222", backgroundColor: 'transparent', borderWidth: 0, flex: 1,
                            }} value={phone} placeholder={'输入手机号'} editable={false} placeholderTextColor={'#999'}/>
                        </View>
                    </View>
                </View>
                <View style={{
                    height: px2dp(98),
                    marginTop: px2dp(24),
                    backgroundColor: '#fff', justifyContent: 'center',
                }}>
                    <View style={{
                        paddingHorizontal: px2dp(30),
                        borderBottomColor: '#ededed',
                        borderBottomWidth: 1
                    }}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Input style={{
                                height: px2dp(96),
                                fontSize: moderateScale(15),
                                color: "#222222", backgroundColor: 'transparent', borderWidth: 0, flex: 1,
                            }} value={verifyCode} placeholder={'输入验证码'} onChangeText={(verifyCode) => {
                                this.setState({verifyCode});
                            }}/>
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
                </View>
                <View style={{paddingHorizontal: px2dp(90)}}>
                    <TouchableOpacity activeOpacity={0.75} onPress={this._toUpdatePhone}>
                        <View style={{
                            height: px2dp(88), marginTop: px2dp(50), borderRadius: px2dp(10),
                            backgroundColor: "#5691f7", justifyContent: 'center'
                        }}>
                            <Text style={{
                                fontSize: moderateScale(16),
                                color: "#ffffff",
                                textAlign: 'center'
                            }}>提交</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <Loading visible={this.state.visible}/>
            </SafeAreaView>
        );
    }

}
