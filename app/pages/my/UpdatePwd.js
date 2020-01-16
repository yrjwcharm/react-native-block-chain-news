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
import Title from '../../components/Title'
import {Input} from "teaset";
import {NavigationActions, StackActions} from "react-navigation";
import Loading from "../../components/Loading";
import {StringUtils} from "../../utils";
export default class UpdatePwd extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state={
            oldPwd:'',
            newPwd:'',
            confirmPwd:'',
            userInfo:null,
            visible:false,
        }
    }
    componentWillMount(): void {
        StatusBar.setBackgroundColor('#fff')
        StatusBar.setNetworkActivityIndicatorVisible(true);
        global.height = px2dp(88);
        store.get('userInfo').then(userInfo=>{
            this.setState({userInfo});
        })
    }
    componentDidMount(): void {
        //监听到设备触发返回键时，调用backForAndroid方法
        BackHandler.addEventListener('hardwareBackPress', this.backForAndroid);

    }
    _back=()=>{
        this.props.navigation.goBack();
    }
    toUpdatePwd=()=>{
        // * @param mobile
        // * @param oldPassword
        // * @param newPassword
        const {userInfo:{mobile},oldPwd,newPwd,confirmPwd} = this.state;

        if(StringUtils.isEmpty(oldPwd)){
            Toast.info('原密码不能为空');
            return;
        }
        if(StringUtils.isEmpty(newPwd)){
            Toast.info('新密码不能为空');
        }
        if(newPwd!==confirmPwd){
            Toast.info('请检查新密码');
            return;
        }
        this.setState({visible:true},()=>{
            let url = Config.requestUrl + Config.updatePwdPage.updatePwd + `?mobile=${mobile}&oldPassword=${oldPwd}&newPassword=${newPwd}`;
            console.log(888,url);
            fetch(url,{method:'POST'}).then(res=>res.json()).then(responseText=>{
                this.setState({visible:false},()=>{
                    if(responseText.code==='200'){
                        Toast.message(responseText.message);
                        //重置路由代码
                        const resetAction = StackActions.reset({
                            index: 0,
                            actions: [NavigationActions.navigate({ routeName: 'Login' })],
                        });
                        this.props.navigation.dispatch(resetAction);
                    }else{
                        Toast.message(responseText.message);
                    }
                });
                console.log(33333,responseText);
            }).catch(error=>{
                ErrorUtil.getErrorLog(error);
            })

        });
    }

    //在backForAndroid方法作出需要的操作
    backForAndroid = () => {
        // 发api请求/第二次按下退出应用
        StatusBar.setBackgroundColor('#5691f7')
        StatusBar.setNetworkActivityIndicatorVisible(true);
        global.height = px2dp(88);
    }

    // 渲染
    render() {
        const {oldPwd,newPwd,confirmPwd}=this.state;
        return (
            <SafeAreaView style={{flex:1,backgroundColor:'#f5f5f5'}}>
                <Title title={'修改密码'} source={Images.icon_back} back onPressBack={this._back}/>
                <Menu onChangeText={(oldPwd)=>{
                    this.setState({oldPwd})
                }} border style={{marginTop:px2dp(24)}} title={'原密码'} placeholder={'请输入原密码'}/>
                <Menu onChangeText={(newPwd)=>{
                    this.setState({newPwd})
                }} border title={'新密码'} placeholder={'请输入原密码'}/>
                <Menu onChangeText={(confirmPwd)=>{
                    this.setState({confirmPwd})
                }}  title={'确认密码'} placeholder={'再次输入密码'}/>
                <View style={{paddingHorizontal: px2dp(90)}}>
                    <TouchableOpacity activeOpacity={0.75} onPress={this.toUpdatePwd}>
                        <View style={{
                            height: px2dp(88), marginTop: px2dp(50), borderRadius: px2dp(10),
                            backgroundColor: "#5691f7", justifyContent: 'center'
                        }}>
                            <Text style={{
                                fontSize: moderateScale(16),
                                color: "#ffffff",
                                textAlign: 'center'
                            }}>保存</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <Loading visible = {this.state.visible}/>
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
                        color: "#333333"
                    }}>{props.title}</Text>
                    <Input style={{
                        flex: 1, backgroundColor: 'transparent', borderWidth: 0,
                        fontSize: moderateScale(13),
                        color: props.color ? props.color : "#808387"
                    }} secureTextEntry={true} onChangeText={props.onChangeText} editable={props.editable} value={props.value}
                           placeholder={props.placeholder}/>
                </View>
            </View>
        </TouchableOpacity>
    );
}
