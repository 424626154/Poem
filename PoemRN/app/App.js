import React, { Component } from 'react';
import {
  Platform,
  AsyncStorage,
  DeviceEventEmitter,
} from 'react-native';
// import { connect,Provider } from 'react-redux';
// import {addNavigationHelpers} from 'react-navigation';
import SplashScreen from 'react-native-splash-screen';
import JPushModule from 'jpush-react-native';
// import SQLite from './db/Sqlite';
// const sqlite = new SQLite();
import {
  StyleConfig,
  HeaderConfig,
  StorageConfig,
  UserConfig,
  Storage,
  HttpUtil,
  Global,
} from './AppUtil';

import {AppNavigator} from './AppNavigator';

const uriPrefix = Platform.OS == 'ios'?'poem://':'poem://poem/';

// import getStore from './redux/store/ConfigureStore';

// let store = configureStore();
// const navReducer = (state, action) => {
//     const newState = AppNavigator.router.getStateForAction(action, state);
//     return newState || state;
// };

// const mapStateToProps = (state) => ({
//     nav: state.nav
// });

// class AppRoot extends Component {
//     render() {
//         return (
//             <AppNavigator
//                 navigation={addNavigationHelpers({
//                     dispatch: this.props.dispatch,
//                     state: this.props.nav
//                 })}
//             />
//         );
//     }
// }

// const AppWithNavigationState = connect(mapStateToProps)(AppRoot);
// const store = getStore(navReducer);
/**
 * 程序入口
 */
export default class App extends Component {
  ishide = false;
  constructor(props){
    super(props);
  }
  componentDidMount() {
    // sqlite.initDB().then(()=>{
    // }).catch(err=>{
    //   console.error(err);
    // })
      // AsyncStorage.getItem(StorageConfig.USERID,(error,userid)=>{
      //   if(!error){
      //     if(userid){
      //       this._requestUserInfo(userid);
      //     }else{
      //       this._goHide();
      //     }
      //   }else{
      //     console.error(err);
      //   }
      // })
    // this.timer = setTimeout(
    //         () => {
    //             this._goHide();
    //         },
    //         3000
    //     );

    JPushModule.getRegistrationID((registrationId) => {
      console.log('@@@@@@registrationId:'+registrationId)
      if(registrationId){
        this._savePushId(registrationId);
      }
    })
    // 点击推送事件
    JPushModule.addReceiveOpenNotificationListener((map)=>{
      console.log('---openNotificationCallback')
      console.log(map.aps)
    });
    //接收推送事件
    JPushModule.addReceiveNotificationListener((event) => {
      console.log("alertContent: " + JSON.stringify(event));
    });
    //接收自定义消息事件
    JPushModule.addReceiveCustomMsgListener((message) => {
      console.log("alertContent: " + JSON.stringify(message));
    });
    SplashScreen.hide();
  }
  componentWillUnmount(){
      // sqlite.close();
      JPushModule.removeReceiveOpenNotificationListener();
      JPushModule.removeReceiveNotificationListener();
      JPushModule.removeReceiveCustomMsgListener();
  }
  render() {
      return(
        // <Provider store={store}>
        //     <AppWithNavigationState/>
        // </Provider>
        <AppNavigator/>
        )
  }
  /**
   * 请求个人信息
   */
  _requestUserInfo(userid){
    Global.user.userid = userid;
    var json = JSON.stringify({
      userid:userid,
    })
    HttpUtil.post(HttpUtil.USER_INFO,json).then(res=>{
      if(res.code == 0){
        Global.user = res.data ;
        this._goHide();
      }else{
        Alert.alert(res.errmsg);
      }
    }).catch(err=>{
      console.error(err);
    })
  }
  _savePushId(pushid){
    Storage.savePushId(pushid)
    Storage.getUserid().then(userid=>{
      if(userid){
        this._requestPushId(userid,pushid);
      }
    });
  }
  _requestPushId(userid,pushid){
    var os = '';
    if(Platform.OS == 'ios'){
      os = 'ios';
    }
    if(Platform.OS == 'android'){
      os = ' android';
    }
    var json = JSON.stringify({
      userid:userid,
      pushid:pushid,
      os:os,
    })
    HttpUtil.post(HttpUtil.MESSAGE_PUSHID,json).then(res=>{
      if(res.code == 0){
        var user = res.data;
        Storage.saveUser(user.userid,{"pushid":user.pushid});
      }else{
        console.log(res.errmsg);
      }
    }).catch(err=>{
      console.error(err);
    })
  }
  _goHide(){
    if(!this.ishide){
      this.ishide = true;
      SplashScreen.hide();
    }
  }
}
