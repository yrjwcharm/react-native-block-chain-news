import {Platform,Text,View} from 'react-native'
/**
 * Created by Fandy 下午2:13
 */
const Config = {
    // requestUrl:'http://172.16.10.223:8007',//测试环境 ----谭少军
    requestUrl:'http://172.16.10.15:9091',//测试环境 ----李康
    // websocket:'ws://172.16.10.223:2020/webSocket', //测试环境websocket

    // requestUrl:'http://13.231.116.216:80',//正式环境
    websocket:'ws://39.97.119.6:2020/webSocket',  //正式环境websocket
    registerPage:{
        register:'/api/app/register',
        sendMsg:'/api/front/sms/send_register_msg',

    },
    myCollect:{
        collectList:'/api/app/member/contentCollectionList',
        cancelCollect:'/api/app/member/contentCollect?operate=0',
        AddCollect:'/api/app/member/contentCollect?operate=1'
    },
    myProject:{
        projectList:'/api/app/member/contentList',
        deleteActOrProjectList:'/api/app/member/contentDeleteList'
    },
    myComment:{
        commentList:'/api/app/member/contentCommentList'
    },
    myAd:{
        adList:'/api/app/member/adList'
    },
    siteMsgPage:{
        getSiteMsgList:'/api/app/member/messageList',
        maskAsRead:'/api/app/member/messageReadList',
        deleteMsg:'/api/app/member/messageDeleteList',
        msgDetail:'/api/app/member/messageGet',
    },
    loginPage:{
            passwordLogin:'/api/app/login' ,
            phoneLogin:'/api/app/loginCode',
            forgetPwd:'/api/app/forgetPassword',
            resetPwd:'/api/app/resetPassword'
    },
    personData:{
        uploadImg:'/api/app/member/uploadImage',
        getUserDataUrl:'/api/app/member/get',
        updatePersonData:'/api/app/member/update'

    },
    securitySettingsPage:{
        getSecurityRelationSet:'/api/app/member/account',
    },
    updatePwdPage:{
        updatePwd:'/api/app/member/resetPassword'
    },
    updatePhonePage:{
        step1:'/api/app/member/resetMobileFirst',
        step2:'/api/app/member/resetMobileSecond'
    },
    emailSettingPage:{
        emailSetUrl:'/api/app/member/resetEmail',
        sendEmailCode:'/api/app/member/sendEmailCode'
    },

    informationPage:{
        getDataList:'/api/app/content/list',
        listDetail:'/api/app/content/info',
        addViews:'/content_view.jspx',
        commentOp:'/api/app/member/comment'
    },
    coinDetail:{
        coinDetailInfo:'/api/app/currency/information'
    },
    exchangeDetail:{
        exchangeDetailInfo:'/api/app/exchange/information'
    },
    market:{
        rankingPage:{
            rankingList:'/api/app/currency/rank'
        },
        dataMarket:{
            coinDetail:'/api/app/currency/info',
            exchangeDetail:'/api/app/exchange/info'
        }


    },
    projectNavigator:{
        projectNavigatorList:'/api/app/content/list',
        listDetail:'/api/app/content/info'
    },
    activity:{
        selectItems:'/api/app/activity/type'
    },
    repository:{
        getDataList:'/api/app/content/list'
    },
    searchPage:{
        searchWords:'/api/app/search/words',
        searchList:'/api/app/search/list'
    }
};
export default Config;
