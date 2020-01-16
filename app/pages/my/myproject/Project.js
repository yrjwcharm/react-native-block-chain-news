import React, {PureComponent} from 'react';
import {ScrollView,Dimensions,Linking,SafeAreaView,StyleSheet,DeviceEventEmitter,Image,FlatList,Platform,BackHandler,View,Text,TextInput,Alert,ImageBackground,TouchableOpacity} from 'react-native'
import Title from '../../../components/Title1'
import {SceneMap, TabBar, TabView} from "react-native-tab-view";
import All from "./All";
import Draft from "./Draft";
import CheckPending from "./CheckPending";
import NotPass from "./NotPass";
import AlreadyPass from "./AlreadyPass";
import StatusBarUtil from "../../../utils/StatusBarUtil";
export default class Project extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state={
            index: 0,
            routes: [
                {key: 'first', title: '全部'},
                {key: 'second', title: '草稿'},
                {key: 'third', title: '待审核'},
                {key: 'fourth', title: '未通过'},
                {key: 'fifth', title: '已通过'},
            ],
            deleteStatus:false,
        }
    }
    componentWillMount(): void {
        StatusBarUtil.setStatusBarStyle('#fff');
    }

    componentDidMount(): void {
        //监听到设备触发返回键时，调用backForAndroid方法
        BackHandler.addEventListener('hardwareBackPress', this.backForAndroid);

    }
    _back=()=>{
        StatusBarUtil.setStatusBarStyle('#5691f7')
        this.props.navigation.goBack();
    }
    //在backForAndroid方法作出需要的操作
    backForAndroid = () => {
        // 发api请求/第二次按下退出应用
        StatusBarUtil.setStatusBarStyle('#5691f7');
    }
    _onPressForward=()=>{
        this.setState({deleteStatus:!this.state.deleteStatus});
    }
    // 渲染
    render() {
        const {deleteStatus}=this.state;
        return (
            <SafeAreaView style={{flex:1,backgroundColor:'#f5f5f5'}}>
                <Title title={'我的项目'} onPressForward={this._onPressForward} forwardLabelText={deleteStatus?'取消':'编辑'} border forward  back onPressBack={this._back}/>
                <TabView
                    navigationState={this.state}
                    renderScene={SceneMap({
                        first: () => <All {...this.props} CI={this} {...this.state}/>,
                        second: () => <Draft {...this.props} CI={this} {...this.state}/>,
                        third: () => <CheckPending {...this.props} CI={this} {...this.state}/>,
                        fourth: () => <NotPass {...this.props} CI={this} {...this.state}/>,
                        fifth: () => <AlreadyPass {...this.props} CI={this} {...this.state}/>,
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
                            tabStyle={{width:'auto',}}
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
