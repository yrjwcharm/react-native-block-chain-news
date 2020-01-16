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
import Loading from "../../components/Loading";
import Title from "../../components/Title1";
import {StringUtils} from "../../utils";
import HTML from "react-native-render-html";
import {Drawer} from "native-base";

export default class MessageDetail extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            visible: true,
            title: '',
            releaseDate: '',
            txt: ''

        }
    }

    componentDidMount(): void {
        store.get('userInfo').then(userInfo => {
            this.setState({userInfo}, () => {
                const {params} = this.props.navigation.state;
                let url = Config.requestUrl + Config.siteMsgPage.msgDetail + `?id=${params.id}&mobile=${userInfo.mobile}`;

                fetch(url, {method: 'POST'}).then(res => {
                    console.log(444, res);
                    return res.json()
                }).then(responseText => {
                    console.log(444, responseText);
                    this.setState({visible: false}, () => {
                        if (responseText.code === '200') {
                            const {msgTitle, sendTime, contentHtml} = responseText.body;
                            this.setState({title: msgTitle, txt: contentHtml, releaseDate: sendTime});
                        }
                    });
                }).catch(error => {
                    ErrorUtil.getErrorLog(error);
                })
            });
        })

    }

    openDrawer = () => {
        this.drawer._root.open()
    };
    // 渲染
    closeDrawer = () => {
        this.drawer._root.close()
    }
    _back = () => {
        this.props.navigation.goBack();
    }
    _delete = () => {
        const {params} = this.props.navigation.state;
        Alert.alert(
            '删除消息',
            '消息删除后不可恢复，确定要删除当前消息吗？',
            [
                // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {
                    text: 'OK', onPress: () => {
                        this._deleteMsg(params.id)
                    }
                },
            ],
            {cancelable: false}
        )
    }
    _deleteMsg = (id) => {
        const {mobile} = this.state.userInfo;
        this.setState({visible: true}, () => {
            let url = Config.requestUrl + Config.siteMsgPage.deleteMsg + `?mobile=${mobile}&ids=${id}`;
            console.log(666, url);
            fetch(url, {method: 'POST'}).then(res => {
                console.log(987, res);
                return res.json()
            }).then(responseText => {
                console.log(666, responseText);
                this.setState({visible: false}, () => {
                    if (responseText.code === '200') {
                        Toast.message(responseText.message);
                        DeviceEventEmitter.emit('refreshMessageList', true);
                        this.props.navigation.goBack();
                    } else {
                        Toast.message(responseText.message);
                    }
                });

            }).catch(error => {
                ErrorUtil.getErrorLog(error)
            })
        });

    }
    _renderHtml = (html) => {
        if (!StringUtils.isEmpty(html)) {
            console.log(333, html);
            return (
                <View style={{marginHorizontal: px2dp(30)}}>
                    <HTML html={html} baseFontStyle={{
                        fontFamily: "PingFangSC-Regular",
                        fontSize: moderateScale(16),
                        color: "#333333",
                        lineHeight: px2dp(54),
                    }} imagesMaxWidth={Dimensions.get('window').width - 45}/>
                </View>

            );
        } else {
            return (<View/>);
        }
    }

    // 渲染
    render() {
        const {title, txt: html, releaseDate} = this.state;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
                <Title title={'信息详情'} forwardLabelText={'删除'} border forward onPressForward={this._delete} back
                       onPressBack={this._back}/>
                <ScrollView keyboardShouldPersistTaps={Platform.OS === 'android' ? 'always' : 'never'}
                            showsVerticalScrollIndicator={false}>
                    <View style={{marginHorizontal: px2dp(30)}}>
                        <Text style={{
                            fontFamily: "PingFangSC-Medium",
                            fontSize: moderateScale(21),
                            color: "#222222",
                            lineHeight: px2dp(58),
                        }}>
                            {title}
                        </Text>
                        <Text style={{
                            marginVertical: px2dp(20),
                            marginLeft: px2dp(8),
                            fontSize: moderateScale(16),
                            color: "#999999"
                        }}>{releaseDate}</Text>
                    </View>
                    {this._renderHtml(html)}
                </ScrollView>
                <Loading visible={this.state.visible}/>
            </SafeAreaView>
        );
    }

}
