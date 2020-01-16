import React, {PureComponent} from 'react';
import {
    Dimensions,
    ScrollView,
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
import Select from "teaset/components/Select/Select";
import {Checkbox} from "teaset";
import IndustryInformation from "./IndustryInformation";
import _24HourFlash from "./_24HourFlash";
import {Drawer} from 'native-base'
import SideBar from "../nav/SideBar";

const {width} = Dimensions.get('window');
export default class Index extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isChangeIndustryInfoShape: true,
            isChange24HourFlashShape: false
        }
    }

    _clickIndustryInformation = () => {
        this.setState({isChangeIndustryInfoShape: true, isChange24HourFlashShape: false});
    }
    _click24HourFlash = () => {
        this.setState({isChangeIndustryInfoShape: false, isChange24HourFlashShape: true});
    }
    componentDidMount(): void {
        this.updateBottomNavigatorListener=DeviceEventEmitter.addListener('update_bottom_nav',result=>{
            if(result.code===1){
                this.setState({   isChangeIndustryInfoShape: true,
                    isChange24HourFlashShape: false});
            }else if(result.code===2){
                this.setState({   isChangeIndustryInfoShape: false,
                    isChange24HourFlashShape: true});
            }
        });
    }
    componentWillUnmount(): void {
        this.updateBottomNavigatorListener&&this.updateBottomNavigatorListener.remove();
    }

    openDrawer = () => {
        this.drawer._root.open()
    };
    // 渲染
    closeDrawer = () => {
        this.drawer._root.close()
    }
    _search = () => {
        this.props.navigation.navigate('SearchPage',{code:1});
    }

    render() {
        const {isChangeIndustryInfoShape, isChange24HourFlashShape} = this.state;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#f5f5f5'}}>
                <Drawer panCloseMask={0.5} openDrawerOffset={0.5} side={'right'} ref={(ref) => {
                    this.drawer = ref;
                }} content={<SideBar {...this.state} {...this.props}   closeDrawer1={
                    () => {
                        this.setState({isChangeIndustryInfoShape: true, isChange24HourFlashShape: false}, () => {
                            this.closeDrawer();
                        })
                    }
                } closeDrawer2={
                    () => {
                        this.setState({isChangeIndustryInfoShape: false, isChange24HourFlashShape: true}, () => {
                            this.closeDrawer();
                        })
                    }
                } closeDrawer3={
                    () => {
                        DeviceEventEmitter.emit('update_bottom_nav', {page: 'market',code:3});
                        this.closeDrawer();
                    }

                } closeDrawer4={
                    () => {
                        DeviceEventEmitter.emit('update_bottom_nav', {page: 'market',code:4});
                        this.closeDrawer();
                    }

                } closeDrawer5={
                    () => {
                        DeviceEventEmitter.emit('update_bottom_nav', {page: 'project'});
                        this.closeDrawer();
                    }

                }  closeDrawer6={
                    () => {
                        DeviceEventEmitter.emit('update_bottom_nav', {page: 'activity'});
                        this.closeDrawer();
                    }

                } closeDrawer7={
                                         () => {
                                             DeviceEventEmitter.emit('update_bottom_nav', {page: 'repository'});
                                             this.closeDrawer();
                                         }

                                     }/>} onClose={() => this.closeDrawer()}>
                    <View style={{height: global.height, justifyContent: 'center', backgroundColor: '#5691F7'}}>
                        <View style={{
                            marginHorizontal: px2dp(34),
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <TouchableOpacity onPress={this._search} activeOpacity={0.8}>
                                <Image source={Images.search}  resizeMode={'contain'} style={{width: px2dp(36), height: px2dp(36)}}/>
                            </TouchableOpacity>
                            <View style={{
                                borderStyle: "solid",
                                borderRadius: px2dp(8),
                               flexDirection: 'row', alignItems: 'center'
                            }}>
                                <TouchableOpacity onPress={this._clickIndustryInformation}>
                                    <View style={{   borderColor: "#ffffff",  borderWidth: px2dp(2.5),borderRightWidth:0, borderBottomLeftRadius:px2dp(8), borderTopLeftRadius:px2dp(8),backgroundColor: isChangeIndustryInfoShape ? '#fff' : '#5691f7'}}>
                                        <Text style={{
                                            fontFamily: "PingFangSC-Medium",
                                            fontSize: moderateScale(13),
                                            color: isChangeIndustryInfoShape ? "#5691f7" : "#fff",
                                            paddingVertical: px2dp(10),
                                            paddingHorizontal: px2dp(10)
                                        }}>行业资讯</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this._click24HourFlash}>
                                    <View style={{  borderColor: "#ffffff", borderWidth: px2dp(2.5),borderLeftWidth:0,borderBottomRightRadius:px2dp(8), borderTopRightRadius:px2dp(8),backgroundColor: isChange24HourFlashShape ? '#fff' : '#5691f7'}}>
                                        <Text style={{
                                            fontFamily: "PingFangSC-Medium",
                                            fontSize: moderateScale(13),
                                            color: isChange24HourFlashShape ? '#5691f7' : "#ffffff",
                                            paddingVertical: px2dp(10),
                                            paddingHorizontal: px2dp(10)
                                        }}>24H快讯</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={this.openDrawer} activeOpacity={0.8}>
                                <Image source={Images.nav} resizeMode={'contain'} style={{width: px2dp(36), height: px2dp(36)}}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {isChangeIndustryInfoShape ? <IndustryInformation {...this.props}/> :
                        <_24HourFlash {...this.props}/>}
                </Drawer>
            </SafeAreaView>
        )
    }
}

