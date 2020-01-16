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
    StatusBar
} from 'react-native'
import Title from '../../components/Title';
import publicDesensitization from '../../utils/Desensitization'
import {NavigationActions, StackActions} from "react-navigation";
import StatusBarUtil from "../../utils/StatusBarUtil";
import {StringUtils} from "../../utils";
import Loading from "../../components/Loading";
export default class SecuritySettings extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state={
            userInfo:null,
            email:'',
            mobile:'',
            visible:true,
        }
    }
    componentWillMount(): void {
        StatusBarUtil.setStatusBarStyle('#fff');
        store.get('userInfo').then(userInfo=>{
            this.setState({userInfo,mobile:userInfo.mobile},()=>{
                this._getAccountSet(userInfo);
            });
        })
    }
    _getAccountSet=(userInfo)=>{
        let url  =  Config.requestUrl  + Config.securitySettingsPage.getSecurityRelationSet + `?mobile=${userInfo.mobile}`;
        fetch(url,{method:'POST'}).then(res=>{
            console.log(888,res);
            return res.json()

        }).then(responseText=>{
            console.log(444,responseText);
            this.setState({visible:false},()=>{
                if(responseText.code==='200'){
                    this.setState({email:responseText.email,mobile:responseText.mobile});
                }
            });

        }).catch(error=>{
            ErrorUtil.getErrorLog(error);
        })
    }
    componentDidMount(): void {
        //监听到设备触发返回键时，调用backForAndroid方法
        BackHandler.addEventListener('hardwareBackPress', this.backForAndroid);
        this.accountSetListener=DeviceEventEmitter.addListener('accountSetSuccess',(result)=>{
            this._getAccountSet(this.state.userInfo);
        })

    }
    componentWillUnmount(): void {
        this.accountSetListener&&this.accountSetListener.remove();
    }

    _exitLogin=()=>{
        store.delete('userInfo');
        //重置路由代码
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Login' })],
        });
        this.props.navigation.dispatch(resetAction);
    }
    _back=()=>{
        // if(Platform.OS==='android'){
        //
        // }
        StatusBarUtil.setStatusBarStyle('#5691f7');
        this.props.navigation.goBack();
    }
    //在backForAndroid方法作出需要的操作
    backForAndroid = () => {
        StatusBarUtil.setStatusBarStyle('#5691f7');
    }
    _toUpdatePwd=()=>{
        this.props.navigation.navigate('PwdSettings')
    }
    _toUpdatePhone=()=>{
        this.props.navigation.navigate('PhoneSettings')

    }
    _toBindOrUpdateEmailPage=()=>{
        const {email}  = this.state;
        if(StringUtils.isEmpty(email)) {
            this.props.navigation.navigate('EmailSettings');
        }else{
            this.props.navigation.navigate('UpdateEmail_1');
        }
    }
    // 渲染
    render() {
        const  {email,mobile}=this.state;
        return (
            <SafeAreaView style={{flex:1,backgroundColor:'#f5f5f5'}}>
                <Title title={'安全设置'} source={Images.icon_back} back onPressBack={this._back}/>
                <Menu border detail={'修改密码'} onPress={this._toUpdatePwd} style={{marginTop: px2dp(24)}} title={'密码设置'}/>
                <Menu border title={'手机设置'} onPress={this._toUpdatePhone} detail={publicDesensitization(String(mobile))}/>
                <Menu title={'邮箱设置'} onPress={this._toBindOrUpdateEmailPage} detail={publicDesensitization(email)}/>
                <View style={{paddingHorizontal: px2dp(90)}}>
                    <TouchableOpacity activeOpacity={0.75} onPress={this._exitLogin}>
                        <View style={{
                            height: px2dp(88), marginTop: px2dp(50), borderRadius: px2dp(10),
                            backgroundColor: "#5691f7", justifyContent: 'center'
                        }}>
                            <Text style={{
                                fontSize: moderateScale(16),
                                color: "#ffffff",
                                textAlign: 'center'
                            }}>退出登录</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <Loading visible={this.state.visible}/>
            </SafeAreaView>
        );
    }

}

const Menu = (props) => {
    return (
        <TouchableOpacity activeOpacity={.75} onPress={props.onPress}>
            <View style={[props.style, {
                shadowColor: "#ececec",
                shadowOffset: {
                    width: 0,
                    height: 1
                },
                shadowRadius: 0,
                shadowOpacity: 1, height: px2dp(98), justifyContent: 'center', backgroundColor: '#fff'
            }]}>
                <TouchableOpacity activeOpacity={.75} onPress={props.onPress}>
                    <View style={{
                        height: px2dp(96),
                        borderBottomWidth: props.border?1:0,
                        borderBottomColor: '#ededed',
                        marginHorizontal: px2dp(30),
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Text style={{
                            fontSize: moderateScale(14),
                            color: "#333",
                            marginRight: px2dp(32),
                        }}>{props.title}</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{
                                fontSize: moderateScale(13),
                                color: "#808387",
                                marginRight:px2dp(32),
                            }}>{props.detail}</Text>
                            <Image source={Images.arrow_right} style={{width: px2dp(16), height: px2dp(24)}}/>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}
