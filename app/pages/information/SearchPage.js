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
import Title from '../../components/Title';
import {Input} from "teaset";
import Loading from "../../components/Loading";

export default class SearchPage extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state={
            keyWordsList:[],
            visible:true,
            keywords:''
        }
    }

    _cancel = () => {
            this.props.navigation.goBack();
    }
    componentDidMount(): void {
        this._searchWords(this.state.keywords);
    }
    _searchWords=(keywords)=>{
        let url=Config.requestUrl+Config.searchPage.searchWords+`?qname=${keywords}`;
        console.log(333,url);
        fetch(url,{method:'POST'}).then(res=>res.json()).then(responseText=>{
            console.log(333,responseText);
            this.setState({visible:false},()=>{
                if(responseText.code==='200'){
                    this.setState({keyWordsList:responseText.body});
                }
            });

        }).catch(error=>{
            Toast.fail(error)
        })
    }
    _onSubmitEdit=()=>{
            const {params}=this.props.navigation.state;
            if(params.code===1)
                this.props.navigation.navigate('InfoSearchResult',{name:this.state.keywords});
            else
                this.props.navigation.navigate('RepositorySearchResult',{name:this.state.keywords});
    }
    _searchResult=(name)=>{
        const {params}=this.props.navigation.state;
        if(params.code===1)
        this.props.navigation.navigate('InfoSearchResult',{name});
        else
            this.props.navigation.navigate('RepositorySearchResult',{name});
    }
    // 渲染
    render() {
        const {keyWordsList}=this.state;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
                <View style={{
                    marginTop: px2dp(52),
                    marginHorizontal: px2dp(30),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <View style={{
                        paddingLeft: px2dp(14),
                        height: px2dp(64),
                        flexDirection: 'row',
                        flex: 1,
                        alignItems: 'center',
                        borderRadius: px2dp(8),
                        backgroundColor: "#f5f5f5"
                    }}>
                        <Image source={Images._search_}
                               style={{width: px2dp(32), height: px2dp(32), marginRight: px2dp(14)}}/>
                        <Input style={{
                            fontFamily: "PingFangSC-Regular",
                            fontSize: moderateScale(14),
                            color: "#999999", flex: 1, height: px2dp(64), borderWidth: 0, backgroundColor: 'transparent'
                        }} placeholder="Search" onChangeText={(keywords)=>{
                            this.setState({keywords},()=>{
                                this._searchWords(keywords);
                            });
                        }} onSubmitEditing={this._onSubmitEdit} />
                    </View>
                    <TouchableOpacity onPress={this._cancel}>
                        <Text style={{
                            fontFamily: "PingFangSC-Regular",
                            fontSize: moderateScale(16),
                            marginLeft: px2dp(30),
                            color: "#5691f7"
                        }}>取消</Text>
                    </TouchableOpacity>
                </View>
                <Text style={{fontFamily: "PingFangSC-Regular",
                    fontSize: moderateScale(14),
                    marginLeft:px2dp(54),
                    marginTop:px2dp(38),
                    color: "#999999",marginBottom:px2dp(10)}}>热门搜索</Text>
                <View style={{marginHorizontal:px2dp(30),justifyContent:'space-between',flexDirection:'row',flexWrap:'wrap'}}>
                    {keyWordsList&&keyWordsList.map(item=>{
                        return(
                            <TouchableOpacity activeOpacity={0.8} onPress={()=>this._searchResult(item.name)}>
                                <View style={{borderRadius: px2dp(8),  marginTop:px2dp(20),
                                    width:px2dp(160),
                                    height:px2dp(44),
                                    justifyContent:'center',
                                    backgroundColor: "#f5f5f5"}}>
                                    <Text style={{fontFamily: "PingFangSC-Regular",
                                        fontSize: moderateScale(13),
                                        textAlign:'center',
                                        color: "#333333"}}>{item.name}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                     })
                    }

                </View>
                <Loading visible={this.state.visible}/>
            </SafeAreaView>
        );
    }

}
