import React, {PureComponent} from 'react';
import {ScrollView,Dimensions,Linking,SafeAreaView,StyleSheet,DeviceEventEmitter,Image,FlatList,Platform,BackHandler,View,Text,TextInput,Alert,ImageBackground,TouchableOpacity} from 'react-native'
import Title from '../../components/Title'
import {SceneMap, TabBar, TabView} from "react-native-tab-view";
import Headline from "../information/Headline";
import News from "../information/News";
import Policy from "../information/Policy";
import Market from "../information/Market";
import Technology from "../information/Technology";
import Mining from "../information/Mining";
import Talk from "../information/Talk";
import Coin from "./Coin";
import Exchange from "./Exchange";
import ReconnectingWebSocket from "react-native-reconnecting-websocket";
import Loading from "../../components/Loading";
let randomStr='';
let m = {};
export default class DataMarket extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state={
            index: 0,
            currencyList:[],
            exchangeList:[],
            routes: [
                {key: 'first', title: '币种'},
                {key: 'second', title: '交易所'},
            ],
            visible:true,
        }
        randomStr=this._randomString(8);
        m={
            "id": randomStr,
            "marketValue": "0",
            "price": "",
            "turnover": "",
            "circulation": "",
            "turnoverRate": "",
            "gain": ""
        };
    }
    componentDidMount(): void {
        this._connectWebSocket();
    }
    _connectWebSocket=()=>{
        let ws = new ReconnectingWebSocket(Config.websocket+"?id="+randomStr);
        ws.onopen = (e) => {
            // execute immediately!
            heartCheck.reset().start()
            console.log("connection ok")
            send(m);
        };
        ws.onmessage = (evt) => {
            heartCheck.reset().start()
            if (evt.data !== 'pong') {
                let result = JSON.parse(evt.data);
                if (result.heartbeat) {
                    randomStr = result.id;
                } else {
                    if (result.flag) {
                        randomStr = result.id;
                        m.id = randomStr;
                        send(m);
                        m = {
                            "id": randomStr,
                            "type": "3",
                            "riseSwitch": "24",
                            "currencyConversion": "rmb"
                        };
                        send(m);
                        m = {
                            "id": randomStr,
                            "type": "4",
                            "riseSwitch": "24",
                            "currencyConversion": "rmb"
                        };
                        send(m);
                    } else {
                            if (result.t === 0) {
                                this.setState({currencyList:result.currencys});
                            } else if(result.t === 1) {
                                this.setState({exchangeList:result.exchange});
                            }
                        this.setState({visible:false});

                    }
                }
            }
        };
        function send(message){
            ws.send(JSON.stringify(message));
        }
        let heartCheck = {
            timeout: 10000,//default 10s
            timeoutObj: null,
            serverTimeoutObj: null,
            reset:function(){
                clearTimeout(this.timeoutObj);
                clearTimeout(this.serverTimeoutObj);
                return this;
            },
            start:function(){
                let self = this;
                this.timeoutObj = setTimeout(function(){
                    ws.send("ping")
                    self.serverTimeoutObj = setTimeout(function(){
                        ws.close();
                    }, self.timeout)
                }, this.timeout)
            }
        }
    }
    _randomString=(length)=>{
        let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let result = '';
        for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }
    // 渲染
    render() {
        return (
            <View style={{flex:1}}>
                <TabView
                    navigationState={this.state}
                    renderScene={SceneMap({
                        first: () => <Coin {...this.props} CI={this} {...this.state}/>,
                        second: () => <Exchange {...this.props} CI={this} {...this.state}/>,
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
                <Loading visible={this.state.visible}/>
            </View>
        );
    }

}
