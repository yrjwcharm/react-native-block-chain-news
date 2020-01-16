import {createStackNavigator, createAppContainer} from "react-navigation";
import CardStackStyleInterpolator from 'react-navigation-stack/src/views/StackView/StackViewStyleInterpolator';
import Login from './pages/Login';
import Main from './pages/Main';
import Splash from './pages/Splash'
import Register from "./pages/Register";
import IndustryInformationContent from "./pages/information/IndustryInformationContent";
import SearchPage from "./pages/information/SearchPage";
import CoinDetail from "./pages/market/CoinDetail";
import ExchangeDetail from "./pages/market/ExchangeDetail";
import ProjectNavigatorDetail from "./pages/project/ProjectNavigatorDetail";
import ActivityDetail from "./pages/activity/ActivityDetail";
import DataMarket from "./pages/market/DataMarket";
import Index from "./pages/market";
import _24HourFlashContent from "./pages/information/_24HourFlashContent";
import InfoSearchResult from "./pages/information/InfoSearchResult";
import RepositorySearchResult from "./pages/repository/RepositorySearchResult";
import Guide from "./pages/Guide";
import RepositoryDetail from "./pages/repository/RepositoryDetail";
import PersonalData from "./pages/my/PersonalData";
import SecuritySettings from "./pages/my/SecuritySettings";
import UpdatePwd from "./pages/my/UpdatePwd";
import UpdatePhone from "./pages/my/UpdatePhone";
import EmailSettings from "./pages/my/EmailSettings";
import Message from "./pages/my/Message";
import Project from "./pages/my/myproject/Project";
import Act from "./pages/my/myactivity/Act";
import Ad from "./pages/my/myad/Ad";
import MyComment from "./pages/my/MyComment";
import MyCollect from "./pages/my/mycollect/MyCollect";
import ForgetPwd from "./pages/ForgetPwd";
import UpdateEmail_1 from "./pages/my/UpdateEmail_1";
import UpdateEmail_2 from "./pages/my/UpdateEmail_2";
import UpdatePhone_2 from "./pages/my/UpdatePhone_2";
import MessageDetail from "./pages/my/MessageDetail";

const TransitionConfiguration = () => ({
    screenInterpolator: (sceneProps) => {
        const {scene} = sceneProps;
        const {route} = scene;
        // 获取屏幕切换时新屏幕的参数
        const params = route.params || {};
        // 看看参数中是否有 transition 参数，有则使用，否则使用缺省值 forHorizontal
        // forHorizontal 表示从右向左滑出
        const transition = params.transition || 'forHorizontal';
        return CardStackStyleInterpolator[transition](sceneProps);
    },
});
const AppNavigator = createStackNavigator({
        Splash: {
            screen: Splash,
        },
        Register: {
            screen: Register
        },
        Login: {
            screen: Login
        },
        Market: {
            screen: Index
        },
        Main: {
            screen: Main
        },
        IndustryInfoContent: {
            screen: IndustryInformationContent
        },
        RepositoryDetail: {
            screen: RepositoryDetail
        },
        Guide: {
            screen: Guide,
        },
        FlashDetail: {
            screen: _24HourFlashContent
        },
        ExchangeDetail: {
            screen: ExchangeDetail
        },
        ProjectNavigatorDetail: {
            screen: ProjectNavigatorDetail
        },
        SearchPage: {
            screen: SearchPage
        },
        CoinDetail: {
            screen: CoinDetail
        },
        ActivityDetail: {
            screen: ActivityDetail
        },
        InfoSearchResult: {
            screen: InfoSearchResult
        },
        RepositorySearchResult: {
            screen: RepositorySearchResult
        },
        PersonalData: {
            screen: PersonalData
        },
        SecuritySettings: {
            screen: SecuritySettings
        },
        PwdSettings: {
            screen: UpdatePwd
        },
        PhoneSettings: {
            screen: UpdatePhone
        },
        UpdPhone: {
            screen: UpdatePhone_2
        },
        EmailSettings: {
            screen: EmailSettings
        },
        Message: {
            screen: Message
        },
        MessageDetail: {
            screen: MessageDetail
        },
        Project: {
            screen: Project
        },
        Act: {
            screen: Act
        },
        Ad: {
            screen: Ad
        },
        Comment: {
            screen: MyComment
        },
        Collection: {
            screen: MyCollect
        },
        ForgetPwd: {
            screen: ForgetPwd
        },
        UpdateEmail_1: {
            screen: UpdateEmail_1
        },
        UpdateEmail_2: {
            screen: UpdateEmail_2
        },
        CollectDetail: {
            screen: CoinDetail
        }


    },
    {
        initialRouteName: "Splash",
        headerMode: 'none',
        defaultNavigationOptions: {
            headerVisible: false
        },
        transitionConfig: () => ({ // 修改页面跳转动画方向
            screenInterpolator: CardStackStyleInterpolator.forFade,
        }),

    },
);
const defaultGetStateForAction = AppNavigator.router.getStateForAction;
AppNavigator.router.getStateForAction = (action, state) => {
    // goBack返回指定页面
    if (state && action.type === 'Navigation/BACK' && action.key) {
        const backRoute = state.routes.find((route) => route.routeName === action.key);
        if (backRoute) {
            const backRouteIndex = state.routes.indexOf(backRoute);
            const purposeState = {
                ...state,
                routes: state.routes.slice(0, backRouteIndex + 1),
                index: backRouteIndex,
            };
            return purposeState;
        }
    }
    return defaultGetStateForAction(action, state)
};
const AppContainer = createAppContainer(AppNavigator);
export default AppContainer
