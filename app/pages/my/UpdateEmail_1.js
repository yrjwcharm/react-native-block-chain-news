import React, {PureComponent} from 'react';
import {ScrollView,Dimensions,Linking,SafeAreaView,StyleSheet,DeviceEventEmitter,Image,FlatList,Platform,BackHandler,View,Text,TextInput,Alert,ImageBackground,TouchableOpacity} from 'react-native'
import Title from '../../components/Title'
import {Input} from "teaset";
import {StringUtils} from "../../utils";
import Loading from "../../components/Loading";
export default class UpdateEmail_1 extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state={
            email:'',
            verifyCode:'',
            userInfo:null,
            visible:false,
        }
        this.timer =null;
    }
    componentWillMount(): void {
        store.get('userInfo').then(userInfo=>{
            this.setState({userInfo});
        })
    //      * @param newEmail邮箱
    //     * @param mobile//校验验证码时无mobile
    //     * @param codeNumber 验证码
    }
    _checkEmail=()=>{
        const {email,verifyCode,userInfo:{mobile}}= this.state;
        if(!StringUtils.isEmail(email)){
            Toast.info('请检查邮箱格式');
            return;
        }
        if(StringUtils.isEmail(verifyCode)){
            Toast.info('验证码不能为空');
            return;
        }
        this.setState({visible:true},()=>{
            let url = Config.requestUrl + Config.emailSettingPage.emailSetUrl +  `?newEmail=${email}&codeNumber=${verifyCode}`;
            fetch(url,{method:'POST'}).then(res=>res.json()).then(responseText=>{
                console.log(444,responseText);
                this.setState({visible:false},()=>{
                    if(responseText.code==='200'){
                        this.props.navigation.navigate('UpdateEmail_2');
                        Toast.message(responseText.message);
                    }else{
                        Toast.message(responseText.message);
                    }
                });
            }).catch(error=>{
                ErrorUtil.getErrorLog(error);
            })
        });

    }

    componentWillUnmount(): void {
    }

    _back=()=>{
        this.props.navigation.goBack();
    }
    _sendVerifyCode=()=>{
        const {email,userInfo:{mobile}}=this.state;
        if(!StringUtils.isEmail(email)){
            Toast.info('请检查邮箱格式');
            return;
        }
        this.setState({visible:true},()=>{
            let url  =  Config.requestUrl  +  Config.emailSettingPage.sendEmailCode  +  `?email=${email}&mobile=${mobile}`;
            console.log(3333,url);
            fetch(url,{method:'POST'}).then(res=>{

                console.log(777,res);
                return    res.json()
            }).then(responseText=>{
                console.log(999,responseText);
                this.setState({visible:false},()=>{
                    if(responseText.code==='200'){
                        Toast.message('发送成功');
                    }
                });

            }).catch(error=>{
                ErrorUtil.getErrorLog(error);
            })
        });

    }
    // 渲染
    render() {
        const {verifyCode,email}=this.state;
        return (
            <SafeAreaView style={{flex:1,backgroundColor:'#f5f5f5'}}>
                <Title title={'邮箱设置'} source={Images.icon_back} back onPressBack={this._back}/>
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
                            <Text style={{color: '#333', fontSize: moderateScale(14)}}>原邮箱地址</Text>
                            <Input style={{
                                height: px2dp(96),
                                fontSize: moderateScale(15),
                                color: "#222222", backgroundColor: 'transparent', borderWidth: 0, flex: 1,
                            }} value={email} placeholder={'输入邮箱'} onChangeText={(email) => {
                                this.setState({email});
                            }}/>
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
                            <TouchableOpacity activeOpacity={0.8} onPress={this._sendVerifyCode}>
                                <Text style={{color: '#5691f7', fontSize: moderateScale(14)}}>获取验证码</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={{paddingHorizontal: px2dp(90)}}>
                    <TouchableOpacity activeOpacity={0.75} onPress={this._checkEmail}>
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
