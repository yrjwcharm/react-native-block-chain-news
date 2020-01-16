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
import {SceneMap, TabBar, TabView} from "react-native-tab-view";
import Headline from "../information/Headline";
import News from "../information/News";
import Policy from "../information/Policy";
import Market from "../information/Market";
import Technology from "../information/Technology";
import Mining from "./Mining";
import Talk from "../information/Talk";
import Wallet from "./Wallet";
import Application from "./Application";
import Browser from "./Browser";
import InvestmentInstitutions from "./InvestmentInstitutions";
import MediaInstitution from "./MediaInstitution";
import {Drawer} from "native-base";
import SideBar from "../nav/SideBar";

const {width} = Dimensions.get('window');
export default class Index extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state={
            index: 0,
            routes: [
                {key: 'first', title: '钱包'},
                {key: 'second', title: '应用'},
                {key: 'third', title: '浏览器'},
                {key: 'fourth', title: '矿业'},
                {key: 'fifth', title: '投资机构'},
                {key: 'sixth', title: '媒体机构'},
            ],
            projectNavigatorSelected:true,
        }
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
        return (
            <SafeAreaView style={{flex: 1,backgroundColor: '#f5f5f5'}}>
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
                <View style={{height:global.height, justifyContent: 'center', backgroundColor: '#5691F7'}}>
                    <View style={{
                        marginHorizontal: px2dp(34),
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                            <Image source={null} style={{width: px2dp(40), height: px2dp(40)}}/>

                        <Text style={{
                            fontFamily: "PingFangSC-Medium",
                            fontSize: px2dp(36),
                            color: "#ffffff"
                        }}>项目导航</Text>
                        <TouchableOpacity onPress={this.openDrawer} activeOpacity={0.8}>
                            <Image source={Images.nav} style={{width: px2dp(42), height: px2dp(36)}}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <TabView
                    navigationState={this.state}
                    renderScene={SceneMap({
                        first: () => <Wallet {...this.props} CI={this}/>,
                        second: () => <Application {...this.props} CI={this}/>,
                        third: () => <Browser {...this.props} CI={this}/>,
                        fourth: () => <Mining {...this.props} CI={this}/>,
                        fifth: () => <InvestmentInstitutions {...this.props} CI={this}/>,
                        sixth: () => <MediaInstitution {...this.props} CI={this}/>,
                    })}
                    onIndexChange={index => this.setState({index})}
                    initialLayout={{width: Dimensions.get('window').width}}
                    renderTabBar={props =>
                        <TabBar
                            {...props}
                            scrollEnabled={true}
                            style={{
                                backgroundColor: "#fff",
                            }}
                            getLabelText={({route}) => route.title}
                            labelStyle={{
                                fontSize: moderateScale(15),
                            }}
                            tabStyle={{width:'auto'}}
                            indicatorStyle={{backgroundColor: '#5691f7'}}
                            activeColor={'#5691f7'}
                            inactiveColor={'#666666'}

                        />
                    }
                />
                </Drawer>
            </SafeAreaView>
        )
    }
}
