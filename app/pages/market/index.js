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
import DataMarket from "./DataMarket";
import RankingList from "./RankingList";
import {Drawer} from "native-base";
import SideBar from "../nav/SideBar";
import ReconnectingWebSocket from "react-native-reconnecting-websocket";
const {width} = Dimensions.get('window');
export default class Index extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state={
            isChangeDataMarketShape:true,
            isChangeRankingListShape:false,
        }

    }
    _clickDataMarket=()=>{
        this.setState({  isChangeDataMarketShape:true,
            isChangeRankingListShape:false,});
    }
    _clickRankingList=()=>{
        this.setState({  isChangeDataMarketShape:false,
            isChangeRankingListShape:true,});
    }
    openDrawer = () => {
        this.drawer._root.open()
    };
    // 渲染
    closeDrawer = () => {
        this.drawer._root.close()
    }
    componentDidMount(): void {
        this.updateBottomNavigatorListener=DeviceEventEmitter.addListener('update_bottom_nav',result=>{
            if(result.code===3){
                this.setState({  isChangeDataMarketShape:true,
                    isChangeRankingListShape:false,});
            }else if(result.code===4){
                this.setState({  isChangeDataMarketShape:false,
                    isChangeRankingListShape:true,});
            }
        });

    }
    componentWillUnmount(): void {
        this.updateBottomNavigatorListener&&this.updateBottomNavigatorListener.remove();
    }
    // 渲染
    render() {
        const {isChangeDataMarketShape,isChangeRankingListShape}=this.state;
        return (
            <SafeAreaView style={{flex: 1,backgroundColor:'#f5f5f5'}}>
                <Drawer panCloseMask={0.5} openDrawerOffset={0.5} side={'right'} ref={(ref) => {
                    this.drawer = ref;
                }} content={<SideBar {...this.props} {...this.state} closeDrawer1={
                    () => {
                        DeviceEventEmitter.emit('update_bottom_nav', {page: 'information',code:1});
                        this.closeDrawer();
                    }
                } closeDrawer2={
                    () => {
                        DeviceEventEmitter.emit('update_bottom_nav', {page: 'information',code:2});
                        this.closeDrawer();
                    }
                } closeDrawer3={
                    () => {
                        this.setState({  isChangeDataMarketShape:true,
                            isChangeRankingListShape:false,},()=>{
                            this.closeDrawer();
                        });
                    }

                } closeDrawer4={
                    () => {
                        this.setState({  isChangeDataMarketShape:false,
                            isChangeRankingListShape:true,},()=>{
                            this.setState({  isChangeDataMarketShape:true,
                                isChangeRankingListShape:false,},()=>{
                                this.closeDrawer();
                            });
                        });
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
                <View style={{height:global.height,justifyContent:'center',backgroundColor:'#5691F7'}}>
                    <View style={{marginHorizontal:px2dp(34),flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                        <Image source={null}  style={{width:px2dp(40),height:px2dp(40)}}/>
                        <View style={{	borderStyle: "solid",
                           flexDirection:'row',alignItems:'center'}}>
                            <TouchableOpacity onPress={this._clickDataMarket}>
                                <View style={{   borderColor: "#ffffff",  borderWidth: px2dp(2.5),borderRightWidth:0, borderBottomLeftRadius:px2dp(8), borderTopLeftRadius:px2dp(8),backgroundColor: isChangeDataMarketShape ? '#fff' : '#5691f7'}}>
                                    <Text style={{
                                        fontFamily: "PingFangSC-Medium",
                                        fontSize: moderateScale(13),
                                        color: isChangeDataMarketShape ? "#5691f7" : "#fff",
                                        paddingVertical: px2dp(10),
                                        paddingHorizontal: px2dp(10)
                                    }}>数据行情</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this._clickRankingList}>
                                <View style={{  borderColor: "#ffffff", borderWidth: px2dp(2.5),borderLeftWidth:0,borderBottomRightRadius:px2dp(8), borderTopRightRadius:px2dp(8),backgroundColor: isChangeRankingListShape ? '#fff' : '#5691f7'}}>
                                    <Text style={{
                                        fontFamily: "PingFangSC-Medium",
                                        fontSize: moderateScale(13),
                                        color: isChangeRankingListShape ? '#5691f7' : "#ffffff",
                                        paddingVertical: px2dp(10),
                                        paddingHorizontal: px2dp(10)
                                    }}>{`${'  排行榜  '}`}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={this.openDrawer} activeOpacity={0.8}>
                           <Image source={Images.nav} resizeMode={'contain'}  style={{width:px2dp(36),height:px2dp(36)}}/>
                        </TouchableOpacity>
                    </View>
                </View>
                {isChangeDataMarketShape?<DataMarket {...this.props}  />:<RankingList {...this.props}/>}
                </Drawer>
            </SafeAreaView>
        )
    }
}
