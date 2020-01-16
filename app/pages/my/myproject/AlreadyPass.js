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
import Title from '../../../components/Title'
import Loading from "../../../components/Loading";

const {width} = Dimensions.get('window')
export default class AlreadyPass extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        console.log(333, props.deleteStatus);
        this.state = {
            dataArray: [],
            deleteStatus: props.deleteStatus,
            isEmpty: false,
            isAllSelect: false,
            count: 0,
        }
    }

    componentWillMount(): void {
        // * @param channelIds  项目ids 123   活动ids  121
        // * @param mobile
        // * @param status 6(全部) 0(草稿)  1(待审核)  -1(未通过)  2(已通过)
        store.get('userInfo').then(userInfo => {
            this.setState({userInfo}, () => {
                this._getAllProjectList(userInfo);
            });
        })

    }

    _getAllProjectList = (userInfo) => {
        let url = Config.requestUrl + Config.myProject.projectList + `?mobile=${userInfo.mobile}&channelIds=123&status=2`;
        fetch(url, {method: 'POST'}).then(res => res.json()).then(responseText => {
            console.log(333,responseText);
                if (responseText.code === '200') {
                    let list = responseText.body, rows = [];
                    list&&list.map(item => {
                        rows.push({...item, checked: false})
                    })
                    this.setState({dataArray: rows}, () => {
                        if (this.state.dataArray.length === 0) {
                            this.setState({isEmpty: true});
                        }
                    });
                }
            console.log(333, responseText);
        }).catch(error => {
            ErrorUtil.getErrorLog(error);
        })
    }
    _multiSelect = (checked, items: {}) => {
        console.log(333, '走了');
        this.state.dataArray.map(item => {
            if (JSON.stringify(items) === JSON.stringify(item)) {
                item.checked = !checked;
            }
        });
        this.setState({
            dataArray: [
                ...this.state.dataArray,
            ]
        }, () => {
            let count = 0;
            const {dataArray} = this.state;
            for (let i = 0; i < dataArray.length; i++) {
                if (dataArray[i].checked) {
                    count++;
                }
            }
            this.setState({count},()=>{
                const {dataArray,count}=this.state;
                if(count===dataArray.length){
                    this.setState({isAllSelect:true});
                }else{
                    this.setState({isAllSelect:false});
                }
            });
        });
        console.log(444, this.state.dataArray);
    }
    _renderItem = ({item}) => {
        return (
            <View style={{
                height: px2dp(210),
                backgroundColor: '#fff',
                justifyContent: 'center',
                paddingHorizontal: px2dp(30),
                borderBottomWidth: 1,
                borderBottomColor: '#ebebeb'
            }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => this._multiSelect(item.checked, item)}>
                        {this.state.deleteStatus ?
                            <Image resizeMode={'contain'} source={item.checked ? Images.selected : Images.select}
                                   style={{width: px2dp(32), height: px2dp(32)}}/> : <View/>}
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row', marginLeft: px2dp(30)}}>
                        <Image source={{uri: item.typeImg}} style={{width: px2dp(100), height: px2dp(100)}}/>
                        <View style={{flex: 1,}}>
                            <View style={{
                                flexDirection: 'row',
                                // alignItems: 'center',
                                marginLeft: px2dp(18),
                                justifyContent: 'space-between'
                            }}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <View style={{
                                        backgroundColor: "#5691f7"
                                    }}>
                                        <Text style={{
                                            paddingHorizontal: px2dp(10),
                                            paddingVertical: px2dp(6),
                                            fontSize: moderateScale(11),
                                            color: "#ffffff"
                                        }}>{item.channelName}</Text>
                                    </View>
                                    <Text style={{
                                        marginLeft: px2dp(16),
                                        fontSize: moderateScale(15),
                                        color: "#222222"
                                    }}>{item.title}</Text>
                                </View>
                                <Text style={{
                                    fontSize: moderateScale(14),
                                    color: "#33b661"
                                }}>已通过</Text>
                            </View>
                            <Text style={{
                                marginTop: px2dp(26),
                                textAlign: 'left',
                                marginLeft: px2dp(20),
                                fontSize: moderateScale(14),
                                lineHeight: px2dp(42),
                                color: "#333333"
                            }}>
                                {item.description}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
    _keyExtractor = (item, index) => index;
    _delete = () => {
        const {dataArray} = this.state;
        console.log(555, dataArray);
        let ids = [], splitIds = '';
        for (let i = 0; i < dataArray.length; i++) {
            if (dataArray[i].checked) {
                ids.push(String(dataArray[i].id));
            }
        }
        console.log(41444, ids);
        if (ids.length === 0) {
            Toast.info('请选择项目');
            return;
        }
        for (let i = 0; i < ids.length; i++) {
            splitIds += ids[i] + ','
        }
        splitIds = splitIds.substring(0, splitIds.lastIndexOf(','));
        console.log('read', splitIds);
        Alert.alert(
            '删除项目',
            '项目删除后不可恢复，确定要删除当前项目吗？',
            [
                // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {
                    text: 'OK', onPress: () => {
                        this._deleteMsg(ids, splitIds)
                    }
                },
            ],
            {cancelable: false}
        )
    }
    _deleteMsg = (ids, splitIds) => {
        const {mobile} = this.state.userInfo;
        this.setState({visible: true}, () => {
            let url = Config.requestUrl + Config.myProject.deleteActOrProjectList + `?mobile=${mobile}&ids=${splitIds}`;
            console.log(666, url);
            fetch(url, {method: 'POST'}).then(res => {
                console.log(987, res);
                return res.json()
            }).then(responseText => {
                console.log(666, responseText);
                this.setState({visible: false}, () => {
                    if (responseText.code === '200') {
                        Toast.message(responseText.message);
                        this.setState({page: 1, dataArray: [], count: 0, isAllSelect: false}, () => {
                            this._getAllProjectList(this.state.userInfo);
                        });
                    } else {
                        Toast.message(responseText.message);
                    }
                });

            }).catch(error => {
                ErrorUtil.getErrorLog(error)
            })
        });

    }
    _allSelect = () => {
        this.setState({isAllSelect: !this.state.isAllSelect}, () => {
            if (this.state.isAllSelect) {
                this.state.dataArray.map(item => {
                    item.checked = true
                });
                this.setState({
                    dataArray: [
                        ...this.state.dataArray,
                    ]
                }, () => {
                    let count = 0;
                    const {dataArray} = this.state;
                    for (let i = 0; i < dataArray.length; i++) {
                        if (dataArray[i].checked) {
                            count++;
                        }
                    }
                    this.setState({count});
                });
            } else {
                this.state.dataArray.map(item => {
                    item.checked = false
                });
                this.setState({
                    dataArray: [
                        ...this.state.dataArray,
                    ]
                }, () => {
                    let count = 0;
                    const {dataArray} = this.state;
                    for (let i = 0; i < dataArray.length; i++) {
                        if (dataArray[i].checked) {
                            count++;
                        }
                    }
                    this.setState({count});
                });
            }
        });
    }

    // 渲染
    render() {
        //待审核 color: "#eea04d"  未通过 	color: "#ed5345"  已通过 color: "#33b661"
        const {deleteStatus, dataArray, isEmpty, isAllSelect, count} = this.state;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#f5f5f5'}}>
                <FlatList
                    data={dataArray}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    // ListFooterComponent={this._renderFooter}
                    // onEndReached={this._onEndReached}
                    onEndReachedThreshold={0.1}
                    refreshing={false}
                    ListEmptyComponent={
                        !isEmpty ? <View/> : <View style={{height: px2dp(554 * 2), justifyContent: 'center',}}>
                            <View style={{alignItems: 'center'}}>
                                <Image source={Images.empty} style={{width: px2dp(490), height: px2dp(300)}}/>
                                <Text style={{
                                    fontSize: moderateScale(18),
                                    fontFamily: "PingFangSC-Medium",
                                }}>空空如也哦~</Text>
                            </View>
                        </View>}
                />
                {deleteStatus ? <View style={{
                    position: 'absolute', zIndex: 1, bottom: 0,
                    width,
                    height: px2dp(98), justifyContent: 'center',
                    backgroundColor: '#fff',
                }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginHorizontal: px2dp(30)
                    }}>
                        <TouchableOpacity onPress={this._allSelect} activeOpacity={.75}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <TouchableOpacity activeOpacity={0.8} onPress={this._allSelect}>
                                    <Image resizeMode={'contain'} source={isAllSelect ? Images.selected : Images.select}
                                           style={{width: px2dp(32), height: px2dp(32)}}/>
                                </TouchableOpacity>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{
                                        marginLeft: px2dp(20),
                                        fontSize: moderateScale(13),
                                        color: "#666666"
                                    }}>已选</Text>
                                    <Text style={{
                                        color: '#ff2c2d',
                                        fontSize: moderateScale(13),
                                    }}>{count}</Text>
                                    <Text style={{
                                        fontSize: moderateScale(13),
                                        color: "#666666"
                                    }}>条</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <TouchableOpacity activeOpacity={0.8} onPress={this._delete}>
                                <View style={{
                                    borderRadius: px2dp(10),
                                    borderStyle: "solid",
                                    borderWidth: 1,
                                    borderColor: "#ff2c2d"
                                }}>
                                    <Text style={{
                                        fontSize: moderateScale(17),
                                        color: "#ff2c2d",
                                        paddingHorizontal: px2dp(28),
                                        paddingVertical: px2dp(14),
                                    }}>
                                        删除
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View> : <View/>}
            </SafeAreaView>
        );
    }

}
