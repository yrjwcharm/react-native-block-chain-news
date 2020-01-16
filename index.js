/**
 * @format
 */

import {AppRegistry, StatusBar,YellowBox} from 'react-native';
import {name as appName} from './app.json';
import './app/base/Global'
import App from './App';
// remove useless 'debugger in background tab' warning
YellowBox.ignoreWarnings(['Remote debugger', 'unknown call: "relay:check"',
    'Warning: componentWillReceiveProps',
    'Warning: componentWillMount',
    'Warning: componentWillUpdate',
    ])
console.reportErrorsAsExceptions = false;
console.disableYellowBox = true;
AppRegistry.registerComponent(appName, () => App);
