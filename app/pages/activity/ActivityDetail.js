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
import Title from '../../components/Title'
import Loading from "../../components/Loading";
import {StringUtils} from "../../utils";
import HTMLView from 'react-native-htmlview';
const {width} = Dimensions.get('window');
export default class ActivityDetail extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            visible: true,
            attr_address: '',
            typeImg: '',
            title: '',
            author: '',
            attr_link: '',
            attr_time: '',
            attr_moneyactivity: '',
            attr_people: '',
            releaseDate: '',
            attr_times: '',
            attr_sponsor: '',
            txt: ''
        }
    }

    openDrawer = () => {
        this.drawer._root.open()
    };
    // 渲染
    closeDrawer = () => {
        this.drawer._root.close()
    }

    componentDidMount(): void {
        const {params} = this.props.navigation.state;
        let url = Config.requestUrl + Config.informationPage.listDetail + `?id=${params.id}`;
        fetch(url, {method: 'POST'}).then(res => res.json()).then(responseText => {
            console.log(333, responseText);
            this.setState({visible: false}, () => {
                if (responseText.code === '200') {
                    const {attr_link, attr_time, attr_address, typeImg, attr_times, title, attr_sponsor, author, attr_moneyactivity, attr_people, releaseDate, txt} = responseText.body;
                    this.setState({
                        attr_link,
                        attr_time,
                        attr_address,
                        attr_times,
                        typeImg,
                        attr_sponsor,
                        title,
                        author,
                        attr_moneyactivity,
                        attr_people,
                        releaseDate,
                        txt
                    });
                }
            });

        }).catch(error => {
            Toast.fail(error)
        })
    }

    _renderHtml = (html) => {
        if (!StringUtils.isEmpty(html)) {
            console.log(333, html);
            return (
                <View style={{marginHorizontal: px2dp(30)}}>
                    <HTMLView
                        value={html}
                        stylesheet={styles}
                    />
                </View>
            );
        } else {
            return (<View/>);
        }
    }
    _attend=(attr_link)=>{
        console.log('link',attr_link);
        if(attr_link.indexOf("http")!==-1){
            Linking.openURL(attr_link);
        }
    }
    // 渲染
    render() {
        const {attr_link, attr_address, attr_time, attr_sponsor, attr_times, typeImg, title, author, attr_moneyactivity, attr_people, releaseDate, txt: html} = this.state;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
                <View style={{height: global.height, justifyContent: 'center', backgroundColor: '#5691F7'}}>
                    <View style={{
                        marginHorizontal: px2dp(34),
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => this.props.navigation.goBack()}>
                            <Image source={Images.back} style={{width: px2dp(40), height: px2dp(40)}}/>
                        </TouchableOpacity>
                        <Text style={{
                            fontFamily: "PingFangSC-Medium",
                            fontSize: px2dp(36),
                            color: "#ffffff"
                        }}>活动沙龙</Text>
                        <Image source={null} style={{width: px2dp(42), height: px2dp(36)}}/>
                    </View>
                </View>
                <ScrollView keyboardShouldPersistTaps={Platform.OS === 'android' ? 'always' : 'never'}
                            showsVerticalScrollIndicator={false}>
                    <View style={{alignItems: 'center', marginTop: px2dp(40), position: 'relative', zIndex: 1}}>
                        <Image resizeMode={'stretch'} source={{uri: typeImg}}
                               style={{width: px2dp(345 * 2), height: px2dp(193 * 2)}}/>
                    </View>
                    <View style={{paddingHorizontal: px2dp(30)}}>
                        <Text style={{
                            fontFamily: "PingFangSC-Regular",
                            fontSize: moderateScale(18),
                            marginTop: px2dp(60),
                            lineHeight: px2dp(46),
                            color: "#222222"
                        }}>
                            {title}
                        </Text>
                        <View style={{
                            flexDirection: 'row',
                            marginTop: px2dp(52),
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <View>
                                <Text style={{
                                    fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(13),
                                    color: "#666666"
                                }}>主办方：{attr_sponsor}</Text>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={{
                                    fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(21),
                                    color: "#de5151"
                                }}>{attr_moneyactivity}</Text>
                                <View style={{
                                    borderTopLeftRadius: px2dp(20),
                                    borderTopRightRadius: px2dp(20),
                                    borderBottomLeftRadius: 0,
                                    marginLeft: px2dp(14),
                                    borderBottomRightRadius: px2dp(20),
                                    backgroundColor: "#de5151"
                                }}>
                                    <Text style={{
                                        fontFamily: "PingFangSC-Regular",
                                        fontSize: moderateScale(13),
                                        paddingLeft: px2dp(18),
                                        paddingRight: px2dp(16),
                                        paddingTop: px2dp(10),
                                        paddingBottom: px2dp(8),
                                        color: "#ffffff"
                                    }}>{attr_people}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: px2dp(68)}}>
                            <Image source={Images.timer_clock} style={{width: px2dp(28), height: px2dp(28)}}/>
                            <Text style={{
                                marginLeft: px2dp(18),
                                fontFamily: "PingFangSC-Regular",
                                fontSize: moderateScale(13),
                                color: "#222222"
                            }}>{attr_time}</Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: px2dp(34)}}>
                            <Image source={Images.location_marker} style={{width: px2dp(26), height: px2dp(30)}}/>
                            <Text style={{
                                marginLeft: px2dp(22),
                                fontFamily: "PingFangSC-Regular",
                                fontSize: moderateScale(13),
                                color: "#222222"
                            }}>{attr_address}</Text>
                        </View>
                        <Text style={{
                            fontFamily: "PingFangSC-Regular",
                            fontSize: moderateScale(18),
                            color: "#222222",
                            marginTop: px2dp(80),
                        }}>简介</Text>
                        <View>
                            {this._renderHtml(html)}
                        </View>
                    </View>
                </ScrollView>
                <View style={{marginHorizontal: px2dp(30), marginBottom: px2dp(20)}}>
                    <TouchableOpacity activeOpacity={0.8} onPress={()=>this._attend(attr_link)}>
                        <View style={{
                            height: px2dp(80),
                            backgroundColor: '#5691F7',
                            borderRadius: px2dp(8),
                            justifyContent: 'center'
                        }}>
                            <View style={{alignItems: 'center'}}>
                                <Text style={{
                                    fontFamily: "PingFangSC-Regular",
                                    fontSize: moderateScale(18),
                                    color: "#ffffff"
                                }}>立即参加</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <Loading visible={this.state.visible}/>
            </SafeAreaView>
        );
    }

}
const styles = StyleSheet.create({
    a: {
        fontWeight: 'bold',
        color: '#5691F7', // make links coloured pink
    },
    p:{
        fontFamily: "PingFangSC-Regular",
        fontSize: moderateScale(17),
        color: "#333333",
        lineHeight: px2dp(54),
    }
});
