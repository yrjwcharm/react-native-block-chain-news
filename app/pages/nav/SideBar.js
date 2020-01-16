import React, {PureComponent} from 'react';
import {
    ScrollView,
    RefreshControl,
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
import Title from '../../components/Title'

export default class SideBar extends PureComponent {
    constructor(props) {
        super();
        console.log(3333, props);
    }

    render() {
        const {isChange24HourFlashShape,isChangeIndustryInfoShape,isChangeDataMarketShape,
            isChangeRankingListShape,repositorySelected, projectNavigatorSelected,activitySelected}=this.props;
        return (
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <Text style={{
                    fontFamily: "PingFangSC-Medium",
                    fontSize: moderateScale(21),
                    color: "#666666", marginTop: px2dp(82), marginLeft: px2dp(72)
                }}>导航</Text>

                <View style={{marginTop: px2dp(110),}}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => this.props.closeDrawer1()}>
                        <View style={{marginLeft:px2dp(80),flexDirection: 'row',alignItems:'center' }}>
                            <Image source={isChangeIndustryInfoShape?Images.nav1_selected:Images.nav1_default} style={{width: px2dp(38), height: px2dp(34)}}/>
                            <Text style={{
                                marginLeft:px2dp(20),
                                fontFamily: "PingFangSC-Medium",
                                fontSize: moderateScale(16),
                                color: isChangeIndustryInfoShape?"#5691f7":"#333"
                            }}>行业资讯</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => this.props.closeDrawer2()}>
                        <View style={{marginLeft:px2dp(80),marginTop: px2dp(68), flexDirection: 'row',alignItems:'center'}}>
                            <Image source={isChange24HourFlashShape?Images.nav2_selected:Images.nav2_default} style={{width: px2dp(30), height: px2dp(32)}}/>
                            <Text style={{
                                marginLeft:px2dp(26),
                                fontFamily: "PingFangSC-Medium",
                                fontSize: moderateScale(16),
                                color: isChange24HourFlashShape?"#5691f7":"#333",
                            }}>24H快讯</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => this.props.closeDrawer3()}>
                        <View style={{marginLeft:px2dp(78),marginTop: px2dp(68), flexDirection: 'row',alignItems:'center'}}>
                            <Image source={isChangeDataMarketShape?Images.nav3_selected:Images.nav3_default} style={{width: px2dp(34), height: px2dp(34)}}/>
                            <Text style={{
                                marginLeft:px2dp(26),
                                fontFamily: "PingFangSC-Medium",
                                fontSize: moderateScale(16),
                                color: isChangeDataMarketShape?"#5691f7":"#333"
                            }}>数据行情</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => this.props.closeDrawer4()}>
                        <View style={{marginLeft:px2dp(76),marginTop: px2dp(68), flexDirection: 'row',alignItems:'center' }}>
                            <Image source={isChangeRankingListShape?Images.nav4_selected:Images.nav4_default} style={{width: px2dp(40), height: px2dp(38)}}/>
                            <Text style={{
                                marginLeft:px2dp(20),
                                fontFamily: "PingFangSC-Medium",
                                fontSize: moderateScale(16),
                                color: isChangeRankingListShape?"#5691f7":"#333"
                            }}>排行榜</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => this.props.closeDrawer5()}>
                        <View style={{marginLeft:px2dp(76),marginTop: px2dp(68), flexDirection: 'row', alignItems:'center'}}>
                            <Image source={projectNavigatorSelected?Images.nav5_selected:Images.nav5_default} style={{width: px2dp(36), height: px2dp(36)}}/>
                            <Text style={{
                                marginLeft:px2dp(23),
                                fontFamily: "PingFangSC-Medium",
                                fontSize: moderateScale(16),
                                color: projectNavigatorSelected?"#5691f7":"#333"
                            }}>项目导航</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => this.props.closeDrawer6()}>
                        <View style={{marginLeft:px2dp(76),marginTop: px2dp(68), flexDirection: 'row', alignItems: 'center'}}>
                            <Image source={activitySelected?Images.nav6_selected:Images.nav6_default} style={{width: px2dp(34), height: px2dp(36)}}/>
                            <Text style={{
                                marginLeft:px2dp(23),
                                fontFamily: "PingFangSC-Medium",
                                fontSize: moderateScale(16),
                                color: activitySelected?"#5691f7":"#333",
                            }}>活动沙龙</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => this.props.closeDrawer7()}>
                        <View style={{marginLeft:px2dp(76),marginTop: px2dp(68), flexDirection: 'row',alignItems:'center' }}>
                            <Image source={repositorySelected?Images.nav7_selected:Images.nav7_default} style={{width: px2dp(36), height: px2dp(36)}}/>
                            <Text style={{
                                marginLeft:px2dp(23),
                                fontFamily: "PingFangSC-Medium",
                                fontSize: moderateScale(16),
                                color: repositorySelected?"#5691f7":"#333"
                            }}>知识库</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

