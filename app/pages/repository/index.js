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
    TouchableOpacity, Animated
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
import Mining from "../information/Mining";
import Talk from "../information/Talk";
import BasicConcept from "./BasicConcept";
import BasicTechnology from "./BasicTechnology";
import TechnologyAdvanced from "./TechnologyAdvanced";
import DerivativeTechnology from "./DerivativeTechnology";
import DigitalCurrency from "./DigitalCurrency";
import DigitalCurrencyTransactions from "./DigitalCurrencyTransactions";
import CommonProblems from "./CommonProblems";
import TechnologyApplication from "./TechnologyApplication";
import {Drawer} from "native-base";
import SideBar from "../nav/SideBar";

const {width} = Dimensions.get('window');
export default class Index extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            index: 0,
            routes: [
                {key: 'first', title: '基本概念'},
                {key: 'second', title: '基本技术'},
                {key: 'third', title: '技术应用'},
                {key: 'fourth', title: '技术进阶'},
                {key: 'fifth', title: '衍生技术'},
                {key: 'sixth', title: '数字货币'},
                {key: 'seventh', title: '数字货币交易'},
                {key: 'eighth', title: '常见问题'},
            ],
            repositorySelected: true,
        }
    }

    openDrawer = () => {
        this.drawer._root.open()
    };
    // 渲染
    closeDrawer = () => {
        this.drawer._root.close()
    }

    _resetKey = (key) => {
        this.setState({key});
    }

    _search = () => {
        this.props.navigation.navigate('SearchPage', {code: 2});
    }

    // 渲染
    render() {
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
                <Drawer panCloseMask={0.5} openDrawerOffset={0.5} side={'right'} ref={(ref) => {
                    this.drawer = ref;
                }} content={<SideBar {...this.props} {...this.state} closeDrawer1={
                    () => {
                        DeviceEventEmitter.emit('update_bottom_nav', {page: 'information', code: 1});
                        this.closeDrawer();
                    }
                } closeDrawer2={
                    () => {
                        DeviceEventEmitter.emit('update_bottom_nav', {page: 'information', code: 2});
                        this.closeDrawer();
                    }
                } closeDrawer3={
                    () => {
                        DeviceEventEmitter.emit('update_bottom_nav', {page: 'market', code: 3});
                        this.closeDrawer();
                    }

                } closeDrawer4={
                    () => {
                        DeviceEventEmitter.emit('update_bottom_nav', {page: 'market', code: 4});
                        this.closeDrawer();
                    }

                } closeDrawer5={
                    () => {
                        DeviceEventEmitter.emit('update_bottom_nav', {page: 'project'});
                        this.closeDrawer();
                    }

                } closeDrawer6={
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
                                <Image source={Images.search} resizeMode={'contain'}
                                       style={{width: px2dp(36), height: px2dp(36)}}/>
                            </TouchableOpacity>

                            <Text style={{
                                fontFamily: "PingFangSC-Medium",
                                fontSize: px2dp(36),
                                color: "#ffffff"
                            }}>知识库</Text>
                            <TouchableOpacity onPress={this.openDrawer} activeOpacity={0.8}>
                                <Image source={Images.nav} resizeMode={'contain'}
                                       style={{width: px2dp(36), height: px2dp(36)}}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TabView
                        navigationState={this.state}
                        renderScene={SceneMap({
                            first: () => <BasicConcept  {...this.props}
                                                       _resetKey={() => this._resetKey()} {...this.state}/>,
                            second: () => <BasicTechnology {...this.props}
                                                           _resetKey={() => this._resetKey()}{...this.state}/>,
                            third: () => <TechnologyApplication {...this.props}
                                                                _resetKey={() => this._resetKey()} {...this.state}/>,
                            fourth: () => <TechnologyAdvanced {...this.props}
                                                              _resetKey={() => this._resetKey()} {...this.state}/>,
                            fifth: () => <DerivativeTechnology {...this.props}
                                                               _resetKey={() => this._resetKey()} {...this.state}/>,
                            sixth: () => <DigitalCurrency {...this.props}
                                                          _resetKey={() => this._resetKey()} {...this.state}/>,
                            seventh: () => <DigitalCurrencyTransactions {...this.props}
                                                                        _resetKey={() => this._resetKey()} {...this.state}/>,
                            eighth: () => <CommonProblems {...this.props}
                                                          _resetKey={() => this._resetKey()} {...this.state}/>,
                        })}
                        onIndexChange={index => this.setState({index})}
                        initialLayout={{width: Dimensions.get('window').width}}
                        renderTabBar={props =>
                            <TabBar
                                {...props}
                                style={{
                                    backgroundColor: "#fff",
                                }}
                                scrollEnabled={true}
                                getLabelText={({route}) => route.title}
                                labelStyle={{
                                    fontSize: moderateScale(15),
                                }}
                                tabStyle={{width: 'auto', justifyContent: 'center'}}
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
