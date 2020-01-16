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
import Loading from "../../components/Loading";

export default class _24HourFlashContent extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            title: '', shortTitle: '', releaseDate: '',
            visible:true,
        }
    }

    componentDidMount(): void {
        const {params} = this.props.navigation.state;
        let url = Config.requestUrl + Config.informationPage.listDetail + `?id=${params.id}`;
        fetch(url, {method: 'POST'}).then(res => res.json()).then(responseText => {
            this.setState({visible:false},()=>{
                if (responseText.code === '200') {
                    const {title, shortTitle, releaseDate} = responseText.body;
                    console.log(333, responseText);
                    this.setState({title, shortTitle, releaseDate});
                }
            })

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

    // 渲染
    render() {
        const {title, shortTitle, releaseDate} = this.state;
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
                            }}>24H快讯</Text>
                            <TouchableOpacity onPress={this.openDrawer} activeOpacity={0.8}>
                                <Image source={Images.nav} style={{width: px2dp(42), height: px2dp(36)}}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{padding: px2dp(30),backgroundColor:'#ffff'}}>
                        <Text style={{
                            fontFamily: "PingFangSC-Medium",
                            fontSize: moderateScale(21),
                            color: "#222222",
                            lineHeight: px2dp(58),
                        }}>
                            {title}
                        </Text>
                        <Text style={{
                            marginVertical:px2dp(20),
                            marginLeft:px2dp(8),
                            fontSize: moderateScale(16),
                            color: "#999999"
                        }}>{releaseDate}</Text>
                        <Text style={{
                            marginLeft: px2dp(14),
                            lineHeight:px2dp(52),
                            fontSize: moderateScale(17),
                            color: "#333"
                        }}>{shortTitle}</Text>
                    </View>
                </Drawer>
                <Loading visible={this.state.visible}/>
            </SafeAreaView>
        );
    }

}
