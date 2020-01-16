import React, {PureComponent} from 'react';
import {ScrollView,Dimensions,Linking,SafeAreaView,StyleSheet,DeviceEventEmitter,Image,FlatList,Platform,BackHandler,View,Text,TextInput,Alert,ImageBackground,TouchableOpacity} from 'react-native'
import Title from '../../components/Title'
import {SceneMap, TabBar, TabView} from "react-native-tab-view";
import Flash from "./Flash";
import Analysis from "./Analysis";
import Market_24H from "./Market_24H";
import Dynamic from "./Dynamic";
import Voice from "./Voice";
import Notice from "./Notice";
import {SegmentedView} from 'teaset'
export default class _24HourFlash extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state={
            index: 0,
            routes: [
                {key: 'first', title: '快讯'},
                {key: 'second', title: '动态'},
                {key: 'third', title: '行情'},
                {key: 'fourth', title: '声音'},
                {key: 'fifth', title: '分析'},
                {key: 'sixth', title: '公告'},
            ],
        }
    }
    // 渲染
    render() {
        return (
            <View style={{flex:1}}>
                <TabView
                    navigationState={this.state}
                    renderScene={SceneMap({
                        first: () => <Flash {...this.props} CI={this}/>,
                        second: () =><Dynamic {...this.props} CI={this}/>,
                        third: () => <Market_24H {...this.props} CI={this}/>,
                        fourth: () => <Voice {...this.props} CI={this}/>,
                        fifth: () => <Analysis {...this.props} CI={this}/>,
                        sixth: () => <Notice {...this.props} CI={this}/>
                    })}
                    onIndexChange={index => this.setState({index})}
                    initialLayout={{width: Dimensions.get('window').width}}
                    renderTabBar={props =>
                        <TabBar
                            {...props}
                            style={{
                                backgroundColor: "#fff",
                            }}
                            getLabelText={({route}) => route.title}
                            labelStyle={{
                                fontSize: moderateScale(15),
                                justifyContent:'center',
                            }}
                            scrollEnabled={true}
                            tabStyle={{ width:'auto',}}
                            indicatorStyle={{backgroundColor: '#5691f7'}}
                            activeColor={'#5691f7'}
                            inactiveColor={'#666666'}

                        />
                    }
                />
            </View>
        );
    }

}
