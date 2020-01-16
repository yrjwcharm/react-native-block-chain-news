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
    TouchableOpacity,
    Animated
} from 'react-native'
import Title from '../../components/Title'
import {SceneMap, TabBar, TabView} from "react-native-tab-view";
import Headline from "../information/Headline";
import News from "../information/News";
import Policy from "../information/Policy";
import Market from "../information/Market";
import Technology from "../information/Technology";
import Mining from "../information/Mining";
import Talk from "../information/Talk";
import GainsList from "./GainsList";
import DropList from "./DropList";
import ClinchList from "./ClinchList";
import ChangeHandList from "./ChangeHandList";
const {width} = Dimensions.get('window');
export default class RankingList extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state={
            index: 0,
            key:undefined,
            routes: [
                {key: 'first', title: '涨幅榜'},
                {key: 'second', title: '跌幅榜'},
                {key: 'third', title: '成交榜'},
                {key: 'fourth', title: '换手榜'},
            ],
        }
    }

    // 渲染
    render() {
        const {key}=this.state;
        return (
            <View style={{flex:1}}>
                <TabView
                    navigationState={this.state}
                    renderScene={SceneMap({
                        first: () => <GainsList {...this.props} CI={this}/>,
                        second: () => <DropList {...this.props} CI={this}/>,
                        third: () => <ClinchList {...this.props} CI={this}/>,
                        fourth: () => <ChangeHandList {...this.props} CI={this}/>,
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
                            }}
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
