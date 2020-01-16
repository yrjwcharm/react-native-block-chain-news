import React, {PureComponent} from 'react';
import {View,DeviceEventEmitter, ToastAndroid, Text, Image, BackHandler, Platform, StatusBar} from 'react-native'
import TabNavigator from 'react-native-tab-navigator'
import Information from "./information/index";
import Market from "./market/index";
import Project from "./project/index";
import Activity from "./activity/index";
import Repository from "./repository/index";
import {Badge} from 'beeshell'
import Profile from "./my/Profile";
import StatusBarUtil from "../utils/StatusBarUtil";
export default class Main extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state={
            selectedTab: 'information',
        }
    }
    componentWillMount(): void {
        StatusBarUtil.setStatusBarStyle('#5691f7');
        if (Platform.OS === 'android'){
            BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        }
        this.updateBottomNavigatorListener=DeviceEventEmitter.addListener('update_bottom_nav',result=>{
            this.setState({selectedTab:result.page});
        });
    }
    componentWillUnmount(): void {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
        this.updateBottomNavigatorListener&&this.updateBottomNavigatorListener.remove();
    }
    componentDidMount(): void {
    }

    onBackAndroid = () => {
        //禁用返回键
        if(this.props.navigation.isFocused()) {//判断   该页面是否处于聚焦状态
            if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
                //最近2秒内按过back键，可以退出应用。
                // return false;
                BackHandler.exitApp();//直接退出APP
            }else{
                this.lastBackPressed = Date.now();
                ToastAndroid.show('再按一次退出应用', 1000);//提示
                return true;
            }
        }
    }
    // 渲染
    render() {
        let tabHeight=px2dp(98);
        return (
            <TabNavigator  tabBarStyle = {{backgroundColor:'#Fff',height:tabHeight,alignItems:'center'}}>
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'information'}
                    title="资讯"
                    titleStyle={{fontSize: px2dp(22),
                        color: "#999999"}}
                    selectedTitleStyle={{color: "#5691f7",fontSize: px2dp(22),}}
                    renderIcon={() => <Image source={Images.information}  style={{width:px2dp(36),height:px2dp(36)}}/>}
                    renderSelectedIcon={() =><Image source={Images.information_selected}  style={{width:px2dp(36),height:px2dp(36)}}/>}
                    onPress={() => this.setState({selectedTab: 'information'})}>
                   <Information {...this.props}/>
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'market'}
                    title="行情"
                    // renderBadge={() => <Badge label={badgeNum}/>}
                    titleStyle={{fontSize: px2dp(22),
                        color: "#999999"}}
                    selectedTitleStyle={{color: "#5691f7",fontSize: px2dp(22),}}
                    renderIcon={() => <Image source={Images.market} style={{width:px2dp(36),height:px2dp(36)}}/>}
                    renderSelectedIcon={() =><Image source={Images.market_selected}  style={{width:px2dp(36),height:px2dp(36)}}/>}
                    onPress={() => this.setState({selectedTab: 'market'})}>
                   <Market {...this.props}/>
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'project'}
                    title="项目"
                    titleStyle={{fontSize: px2dp(22),
                        color: "#999999"}}
                    selectedTitleStyle={{color: "#5691f7",fontSize: px2dp(22),}}
                    renderIcon={() => <Image source={Images.project}  style={{width:px2dp(36),height:px2dp(36)}}/>}
                    renderSelectedIcon={() =><Image source={Images.project_selected}  style={{width:px2dp(36),height:px2dp(36)}}/>}
                    onPress={() => this.setState({selectedTab: 'project'})}>
                   <Project {...this.props}/>
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'activity'}
                    title="活动"
                    titleStyle={{fontSize: px2dp(22),
                        color: "#999999"}}
                    selectedTitleStyle={{color: "#5691f7",fontSize: px2dp(22),}}
                    renderIcon={() => <Image source={Images.activity}  style={{width:px2dp(36),height:px2dp(36)}}/>}
                    renderSelectedIcon={() =><Image source={Images.activity_selected} style={{width:px2dp(36),height:px2dp(36)}}/>}
                    onPress={() => this.setState({selectedTab: 'activity'})}>
                   <Activity {...this.props}/>
                </TabNavigator.Item>
                {/*<TabNavigator.Item*/}
                {/*    selected={this.state.selectedTab === 'repository'}*/}
                {/*    title="知识库"*/}
                {/*    titleStyle={{fontSize: px2dp(22),*/}
                {/*        color: "#999999"}}*/}
                {/*    selectedTitleStyle={{color: "#5691f7",fontSize: px2dp(22),}}*/}
                {/*    renderIcon={() => <Image source={Images.repository} style={{width:px2dp(34),height:px2dp(36)}}/>}*/}
                {/*    renderSelectedIcon={() =><Image source={Images.repository_selected} style={{width:px2dp(34),height:px2dp(36)}}/>}*/}
                {/*    onPress={() => this.setState({selectedTab: 'repository'})}>*/}
                {/*   <Repository {...this.props}/>*/}
                {/*</TabNavigator.Item>*/}
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'profile'}
                    title="我的"
                    titleStyle={{fontSize: px2dp(22),
                        color: "#999999"}}
                    selectedTitleStyle={{color: "#5691f7",fontSize: px2dp(22),}}
                    renderIcon={() => <Image source={Images.my} style={{width:px2dp(34),height:px2dp(36)}}/>}
                    renderSelectedIcon={() =><Image source={Images.my_selected} style={{width:px2dp(34),height:px2dp(36)}}/>}
                    onPress={() => this.setState({selectedTab: 'profile'})}>
                   <Profile {...this.props}/>
                </TabNavigator.Item>
            </TabNavigator>
        );
    }

}
