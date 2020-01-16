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
    TouchableOpacity, StatusBar
} from 'react-native'
import Title from '../../components/Title1'
import {Input,Select} from "teaset";
import DatePicker from "../../components/DatePicker";
import StatusBarUtil from "../../utils/StatusBarUtil";
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet'
import Loading from "../../components/Loading";

export default class PersonalData extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            birthday: '',
            avatarSource:Images.avatar,
            visible:true,
            member:'',
            realName:'',
            gender:1,
            comeFrom:'',
            wx:'',
            qq:'',
            userInfo:null,
            imagUri:'',
        }
        this.selectSexItems=[{text:'男',value:1},{text:'女',value:0}]
    }

    componentWillMount(): void {
        StatusBarUtil.setStatusBarStyle('#fff');
        store.get('userInfo').then(userInfo=>{
            this.setState({userInfo},()=>{
                let url  = Config.requestUrl  + Config.personData.getUserDataUrl + `?mobile=${userInfo.mobile}`;
                fetch(url,{method:'POST'}).then(res=>{
                    console.log('lajis',res);
                    return    res.json()

                }).then(responseText=>{
                    console.log(3333,responseText);
                    this.setState({visible:false},()=>{
                        if(responseText.code==='200'){
                            const {userImg,msn,comefrom,birthday,qq,gender,user:{username,realname,mobile,group:{name}}}=responseText.body;
                            this.setState({wx:msn,comeFrom:comefrom,birthday:birthday?birthday.substring(0,birthday.lastIndexOf(' ')):birthday,qq,gender:gender?1:0,realName:realname,member:name,avatarSource:{uri:userImg}});
                        }
                    });

                }).catch(error=>{
                    ErrorUtil.getErrorLog(error);
                })
            });

        })
    }

    componentDidMount(): void {
        //监听到设备触发返回键时，调用backForAndroid方法
        BackHandler.addEventListener('hardwareBackPress', this.backForAndroid);

    }

    //在backForAndroid方法作出需要的操作
    backForAndroid = () => {
        // 发api请求/第二次按下退出应用
        StatusBarUtil.setStatusBarStyle('#5691f7');
    }

    _selectSex = (item) => {
        console.log(444,item);
        this.setState({gender:item.value});
    }
    _selectBirth = () => {
        this.refs.datePicker.show({
            title: "请选择日期", //标题
            // years: 10, //展示总年数
            // lastYear: 2020, //展示最后一年，须同时传years
            selectedValue: this.state.date, //默认选择的日期，格式"yyyy-MM-dd"
            onPickerConfirm: (chooseDate) => { //确认回调，格式"yyyy-MM-dd"
                this.setState({
                    birthday: chooseDate,
                });
            },
        });
    }
    _back = () => {
        StatusBarUtil.setStatusBarStyle('#5691f7');
        this.props.navigation.goBack();
    }
    _selectDistrict = () => {

    }

    _showActionSheet = () => {
        this.ActionSheet.show();
    }

    //拍照
    _getAvatarFromCapture = () => {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            let source = {uri: image.path};
            this.setState({
                avatarSource: source,
            }, () => {
                this._uploadImage(image.path);
            });
        });
    }
    //从相册选取
    _getAvatarFromGallery = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            // cropping: true,
            // mediaType: "photo",
        }).then(image => {
            let source = {uri: image.path};
            this.setState({
                avatarSource: source,
            }, () => {
                this._uploadImage(image.path);
            });

        });
    }
    _uploadImage = (uri) => {
        this.setState({visible:true},()=>{
            let formData = new FormData();
            let file = {uri: uri, type: 'multipart/form-data', name: 'image.jpg'};
            let url = Config.requestUrl  +  Config.personData.uploadImg;
            formData.append("file", file);
            formData.append("mobile",this.state.userInfo.mobile)
            fetch(url,{
                method:'POST',
                headers:{
                    'Content-Type':'multipart/form-data',
                },
                body:formData
            }).then(res=>{
                console.log(888,res);
                return    res.json()

            }).then(responseText=>{
                console.log(333,responseText);
                this.setState({visible:false},()=>{
                    if(responseText.code==='200'){
                        this.setState({avatarSource:{uri:responseText.body},imagUri:responseText.body},()=>{
                            DeviceEventEmitter.emit('updateUserInfo',true);
                        });
                    }
                });

            }).catch(error=>{
                ErrorUtil.getErrorLog(error);
            })
        });

    }
    _savePersonData=()=>{
        //     b.参数：post
        // * @param realname 昵称
        // * @param Boolean gender
        // * @param birthdayStr
        // * @param phone
        // * @param mobile  必传
        // * @param qq
        // * @param msn     微信号
        // * @param comefrom  来自
        // * @param intro  介绍
        const  {realName,wx,qq,comeFrom,gender,birthday,userInfo:{mobile},imagUri}=this.state;
        let sex =false;
        if(gender===1){
            sex=true;
        }else{
            sex = false;
        }
        let url =  Config.requestUrl  +  Config.personData.updatePersonData  + `?realname=${realName}&gender=${sex}&birthdayStr=${birthday}&mobile=${mobile}&qq=${qq}&msn=${wx}&comefrom=${comeFrom}`;
        console.log(333,imagUri);
        fetch(url,{method:'POST'}).then(res=>{
            console.log(66,res);
            return   res.json()
        }
        ).then(responseText=>{
            console.log(444,responseText);
            if(responseText.code==='200'){
                Toast.message('保存成功');
                DeviceEventEmitter.emit('updateUserInfo',true);
                this.props.navigation.goBack();
            }
        }).catch(error=>{
            ErrorUtil.getErrorLog(error);
        })
    }
    // 渲染
    render() {
        const {avatarSource,realName,member,birthday,gender,qq,wx,comeFrom}=this.state;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#f5f5f5'}}>
                <Title title={'个人资料'} forwardLabelText={'保存'} source={Images.icon_back} back onPressBack={this._back}  forward onPressForward={this._savePersonData} />
                <ListRow title={'头像'} style={{marginTop: px2dp(24)}} source={avatarSource} onPress={this._showActionSheet}/>
                <Menu title={'昵称'} placeholder={'请输入昵称'} value={realName} onChangeText={(realName)=>{

                    this.setState({realName});
                }}/>
                <Menu2 title={'性别'} value={gender} items={this.selectSexItems} onSelected={(item)=>{
                    this._selectSex(item)
                }}/>
                <Menu1 title={'生日'} detail={birthday} onPress={this._selectBirth}/>
                <Menu style={{marginTop: px2dp(26)}} title={'微信'} color={'#5691f7'} value={wx} placeholder={'请输入'}
                      onChangeText={(wx)=>{
                          this.setState({wx});
                      }} />
                <Menu title={'QQ'} color={'#5691f7'} placeholder={'请输入'} value={qq} onChangeText={(qq)=>{
                    this.setState({qq});
                }}/>
                <Menu title={'来自'} color={'#5691f7'}placeholder={'请输入'}  value={comeFrom} onChangeText={(comeFrom)=>{
                    this.setState({comeFrom});
                }} onPress={this._selectDistrict}/>
                <DatePicker title={''} ref={"datePicker"} hide={true}/>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    // title={'头像上传'}
                    styles={{fontSize: px2dp(14), color: '#5691f7'}}
                    options={['拍照', '从相册选取', '取消']}
                    cancelButtonIndex={2}
                    // destructiveButtonIndex={2}
                    onPress={(index) => {
                        if (index === 0) {
                            this._getAvatarFromCapture();
                        } else if (index === 1) {
                            this._getAvatarFromGallery();
                        } else if (index === 2) {
                        }
                        /* do something */
                    }
                    }
                />

                <Loading visible={this.state.visible}/>
            </SafeAreaView>
        );
    }

}
const ListRow = (props) => {
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
                    borderBottomWidth: 1,
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
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image source={props.source}
                               style={{
                                   width: px2dp(60),
                                   height: px2dp(60),
                                   borderRadius: px2dp(30),
                                   marginRight: px2dp(32)
                               }}/>
                        <Image source={Images.arrow_right} style={{width: px2dp(16), height: px2dp(24)}}/>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
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
                    borderBottomWidth: 1,
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
                        textAlign: 'right',
                        color: props.color ? props.color : "#808387"
                    }} onChangeText={props.onChangeText} editable={props.editable} value={props.value}
                           placeholder={props.placeholder}/>
                </View>
            </View>
        </TouchableOpacity>
    );
}
const Menu1 = (props) => {
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
                        borderBottomWidth: 1,
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
                                color: "#5691f7",
                                marginRight: px2dp(32),
                            }}>{props.detail}</Text>
                            <Image source={Images.arrow_right} style={{width: px2dp(16), height: px2dp(24)}}/>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}
const Menu2 = (props) => {
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
                        borderBottomWidth: 1,
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
                        <Select value={props.value}
                                onSelected={props.onSelected}
                                items={props.items}
                                getItemText={(item)=>item.text}
                                getItemValue={(item)=>item.value}
                                style={{flex:1,backgroundColor:'transparent',borderWidth: 0,}}
                                placeholderTextColor={'#5691f7'}
                                placeholder={'请选择'}
                                valueStyle={{color: "#5691f7", fontSize: moderateScale(13),textAlign:'right',}}
                                icon={<Image source={Images.arrow_right} style={{width: px2dp(16), height: px2dp(24),marginLeft:px2dp(12)}}/>} />
                    </View>
            </View>
        </TouchableOpacity>
    );
}
