import React, {PureComponent} from 'react';
import {ScrollView,Dimensions,Linking,SafeAreaView,StyleSheet,DeviceEventEmitter,Image,FlatList,Platform,BackHandler,View,Text,TextInput,Alert,ImageBackground,TouchableOpacity} from 'react-native'
import Title from '../../components/Title'
import {SceneMap, TabBar, TabView} from "react-native-tab-view";
import Headline from "./Headline";
import News from "./News";
import Policy from "./Policy";
import Market from "./Market";
import Technology from "./Technology";
import Mining from "./Mining";
import Talk from "./Talk";
export default class IndustryInformation extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state={
            index: 0,
            routes: [
                {key: 'first', title: '头条'},
                {key: 'second', title: '新闻'},
                {key: 'third', title: '政策'},
                {key: 'fourth', title: '行情'},
                {key: 'fifth', title: '技术'},
                {key: 'sixth', title: '矿业'},
                {key: 'seventh', title: '访谈'},
            ],
            time:new Date().getTime(),
        }
    }
    componentDidMount(): void {

    }
    componentWillUnmount(): void {

    }

    // 渲染

    render() {
        return (
            <View style={{flex:1}}>
                <TabView
                    navigationState={this.state}
                    renderScene={SceneMap({
                        first: () => <Headline {...this.props} CI={this} />,
                        second: () => <News {...this.props} CI={this} />,
                        third: () => <Policy {...this.props} CI={this} />,
                        fourth: () => <Market {...this.props} CI={this}/>,
                        fifth: () => <Technology {...this.props} CI={this} />,
                        sixth: () => <Mining {...this.props} CI={this} />,
                        seventh: () => <Talk {...this.props} CI={this}/>,
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
            </View>
        );
    }
}

