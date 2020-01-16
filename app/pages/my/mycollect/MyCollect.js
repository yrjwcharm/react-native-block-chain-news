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
import Title from '../../../components/Title1'
import StatusBarUtil from "../../../utils/StatusBarUtil";
import {SceneMap, TabBar, TabView} from "react-native-tab-view";
import Info from "./Info";
import Project from "./Project";

export default class MyCollect extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            deleteStatus: false,
                index: 0,
                routes: [
                    {key: 'first', title: '资讯'},
                    {key: 'second', title: '项目'},
                ],

        }
    }

    componentWillMount(): void {
        StatusBarUtil.setStatusBarStyle('#fff');
    }

    componentDidMount(): void {
        //监听到设备触发返回键时，调用backForAndroid方法
        BackHandler.addEventListener('hardwareBackPress', this.backForAndroid);

    }

    _back = () => {
        StatusBarUtil.setStatusBarStyle('#5691f7');
        this.props.navigation.goBack();
    }
    _onPressForward = () => {
        this.setState({deleteStatus: !this.state.deleteStatus});
    }
    //在backForAndroid方法作出需要的操作
    backForAndroid = () => {
        // 发api请求/第二次按下退出应用
        StatusBarUtil.setStatusBarStyle('#5691f7');
    }

    // 渲染
    render() {
        const {deleteStatus} = this.state;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#f5f5f5'}}>
                <Title title={'我的收藏'} onPressForward={this._onPressForward}
                       forwardLabelText={deleteStatus ? '取消' : '编辑'} border forward back onPressBack={this._back}/>
                <TabView
                    navigationState={this.state}
                    renderScene={SceneMap({
                        first: () => <Info {...this.props} CI={this}  {...this.state}/>,
                        second: () => <Project {...this.props} CI={this} {...this.state}/>,
                    })}
                    onIndexChange={index => this.setState({index})}
                    initialLayout={{width: Dimensions.get('window').width}}
                    renderTabBar={props =>
                        <TabBar
                            {...props}
                            // scrollEnabled={true}
                            style={{
                                backgroundColor: "#fff",
                            }}
                            getLabelText={({route}) => route.title}
                            labelStyle={{
                                fontSize: moderateScale(15),
                            }}
                            // tabStyle={{width:'auto',}}
                            indicatorStyle={{backgroundColor: '#5691f7'}}
                            activeColor={'#5691f7'}
                            inactiveColor={'#666666'}

                        />
                    }
                />
            </SafeAreaView>
        );
    }

}
