/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    Alert,
    View,
    NativeModules,
    Platform, StatusBar,
} from 'react-native';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import AppContainer from './app/RouterConfig';
import {Root} from 'native-base';
import * as reducers from './app/reducers';
import HotUpdate, { ImmediateCheckCodePush } from 'react-native-code-push-dialog';
import {setJSExceptionHandler, setNativeExceptionHandler} from "react-native-exception-handler";
import RNRestart from "react-native-restart";
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
// const store = createStoreWithMiddleware(reducer);
const { StatusBarManager } = NativeModules;

type Props = {};
if (!__DEV__) {
    global.console = {
        info: () => {},
        log: () => {},
        warn: () => {},
        debug: () => {},
        error: () => {},
    };
}
/**
 * 捕获异常信息
 * @private
 */

const errorHandler = (e, isFatal) => {
    if (isFatal) {
        if (__DEV__) {
            console.log('error', e.message);
            Alert.alert(
                '异常捕获',
                `${(isFatal) ? '严重BUG:' : ''}

            ${e.name}  ${e.message}

             APP出现异常闪退迹象,请尽快联系开发人员解决此BUG.
             `,
                [{
                    text: 'Close'
                }]
            );
        } else {
            //重启APP //兼容双平台
            RNRestart.Restart();
        }

    } else {
        console.log('333', e); // So that we can see it in the ADB logs in case of Android if needed
    }
}
export  default class App extends Component<Props> {
    componentWillMount(): void {
        StatusBar.setBackgroundColor('#5691f7')
        StatusBar.setNetworkActivityIndicatorVisible(true);
        global.height = px2dp(88);

    }

    componentDidMount(): void {
        this._causeJSError();
        this._causeNativeError();
    }

    _causeJSError = () => {
        setJSExceptionHandler(errorHandler, true);
    }
    _causeNativeError = () => {
        setNativeExceptionHandler((errorString) => {
            if (__DEV__) {
                Alert.alert(errorString);
                console.log('error', errorString);
            } else {
                RNRestart.Restart();
                console.log('setNativeExceptionHandler', errorString);
            }
        });
        //RnTestExceptionHandler.raiseTestNativeError();
    }

    render() {
        return (
            <Root>
                <AppContainer/>
                {/*<HotUpdate isActiveCheck={false}/>*/}
            </Root>
        )

    }
}


