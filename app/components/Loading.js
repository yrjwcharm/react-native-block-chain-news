import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';

const Loading = (props) => {
    return (
        <Spinner size="large"  color={'#5691f7'} overlayColor={'transparent'}  visible={props.visible}
                 textStyle={{color: '#FFF', fontSize: moderateScale(14)}}/>
    )
};
export default Loading;
