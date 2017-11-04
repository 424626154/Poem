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

const receiveCustomMsgEvent = "receivePushMsg";
const receiveNotificationEvent = "receiveNotification";
const openNotificationEvent = "openNotification";
const getRegistrationIdEvent = "getRegistrationId";

import {
  StyleConfig,
  HeaderConfig,
  StorageConfig,
  UserConfig,
  Storage,
  HttpUtil,
  Global,
  MessageDao,
  Emitter,
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
    this._requestUserInfo = this._requestUserInfo.bind(this);
    this._requestMessages = this._requestMessages.bind(this);
    this._requestMsgRead = this._requestMsgRead.bind(this);
  }
  componentDidMount() {
    Storage.getUserid().then(userid=>{
      if(userid){
        Global.user.userid = userid;
        this._requestUserInfo(userid);
      }
    });
    // this.timer = setTimeout(
    //         () => {
    //             this._goHide();
    //         },
    //         3000
    //     );

		if(Platform.OS == 'android'){
      JPushModule.getInfo((map) => {
      	// this.setState({
      	// 	appkey: map.myAppKey,
      	// 	imei: map.myImei,
      	// 	package: map.myPackageName,
      	// 	deviceId: map.myDeviceId,
      	// 	version: map.myVersion
      	// });
      	console.log('---JPushModule getInfo');
        console.log(map);
      });
      // 通知 JPushModule 初始化完成，发送缓存事件。
      JPushModule.notifyJSDidLoad((resultCode) => {
  			if (resultCode === 0) {

        }
        console.log('---JPushModule notifyJSDidLoad resultCode:'+resultCode);
  		});
    }

    DeviceEventEmitter.addListener(Emitter.OBSERVER,obj=>{
       this._analysisObserver(obj);
    });
    /*
      极光推送
      ios map
      map{
      appState:"active"
      aps:{badge: 1, alert: "asd", sound: "default"}
      _j_business:1
      _j_msgid:27021597978863340
      _j_uid:6163529375
      }
      android map
      {extras: "{}", alertContent: "salads", id: 533201812}
     */
    JPushModule.getRegistrationID((registrationId) => {
      console.log('---JPushModule getRegistrationID registrationId:'+registrationId)
      if(registrationId){
        this._savePushId(registrationId);
      }
    })
    //接收自定义消息事件
		JPushModule.addReceiveCustomMsgListener((map) => {
      console.log('---JPushModule Custom Msg')
      // console.log("pushMsg: "+ map.message);
			// console.log("extras: " + map.extras);
			// console.log(map.aps);
		});
    //接收推送事件
		JPushModule.addReceiveNotificationListener((map) => {
      console.log('---JPushModule Receive Notification')
      console.log(map)
      // console.log(map.aps)
			// console.log("alertContent: " + map.alertContent);
			// console.log("extras: " + map.extras);
      // var extra = JSON.parse(map.extras);
      // console.log(extra.key + ": " + extra.value);
      this._requestMessages();
		});
    //点击推送事件
		JPushModule.addReceiveOpenNotificationListener((map) => {
			console.log("---JPushModule Open Notification");
      console.log(map);
			// console.log("map.extra: " + map.extras);
			// JPushModule.jumpToPushActivity("SecondActivity");
			this._requestMessages();
      if(Platform.OS == 'android'){
        var id = map.id;
        JPushModule.clearNotificationById(id);
      }
		});
    //如果添加这个监听，设备注册成功后，打开应用将会回调这个事件。
		JPushModule.addGetRegistrationIdListener((registrationId) => {
			console.log("---JPushModule Device register succeed, registrationId " + registrationId);
		});

    SplashScreen.hide();
  }
  componentWillUnmount(){
    JPushModule.removeReceiveCustomMsgListener(receiveCustomMsgEvent);
		JPushModule.removeReceiveNotificationListener(receiveNotificationEvent);
		JPushModule.removeReceiveOpenNotificationListener(openNotificationEvent);
		JPushModule.removeGetRegistrationIdListener(getRegistrationIdEvent);
    DeviceEventEmitter.removeAllListeners();
  }
  render() {
      return(
        // <Provider store={store}>
        //     <AppWithNavigationState/>
        // </Provider>
        <AppNavigator/>
        )
  }
  _setMsgState(){
    var num = MessageDao.getUnreadNum();
    console.log('---_setMsgState num:'+num);
    if(Platform.OS == 'ios'){
      JPushModule.setBadge(num, (success) => {
        console.log('------JPushModule');
        console.log(success)
      });
    }
    if(Platform.OS == 'android'){
      if(num == 0){
        JPushModule.clearAllNotifications();
      }
    }
  }
  /**
   * 请求个人信息
   */
  _requestUserInfo(){
    if(!Global.user.userid){
      return;
    }
    var json = JSON.stringify({
      userid:Global.user.userid ,
    })
    HttpUtil.post(HttpUtil.USER_INFO,json).then(res=>{
      if(res.code == 0){
        Global.user = res.data ;
        this._requestMessages();
      }else{
        this._goHide();
        Alert.alert(res.errmsg);
      }
    }).catch(err=>{
      console.error(err);
    })
  }
  /**
   * 请求消息列表
   */
   _requestMessages(){
     if(!Global.user.userid){
       return;
     }
     var json = JSON.stringify({
       userid:Global.user.userid,
     });
     HttpUtil.post(HttpUtil.MESSAGE_MESSAGES,json).then(res=>{
       if(res.code == 0){
         var messages = res.data;
         if(messages.length > 0){
           MessageDao.addMessages(messages);
           var reads = [];
           for(var i = 0 ; i < messages.length ; i ++){
             var id = messages[i].id;
             reads[i]= id;
           }
           if(reads.length >0){
             this._requestMsgRead(reads);
             this._setMsgState();
           }
         }
       }else{
         this._goHide();
         Alert.alert(res.errmsg);
       }
     }).catch(err=>{
       console.error(err);
     })
   }
   /**
    * 设置消息已读
    */
   _requestMsgRead(reads){
     if(!Global.user.userid){
       return;
     }
     var json = JSON.stringify({
       userid:Global.user.userid,
       reads:reads
     });
     HttpUtil.post(HttpUtil.MESSAGE_READ,json).then(res=>{
       if(res.code == 0){
         console.log(res.data);
       }else{
         Alert.alert(res.errmsg);
       }
       this._goHide();
     }).catch(err=>{
       console.error(err);
     })
   }
   /**
    * 保存pushid
    */
  _savePushId(pushid){
    Storage.savePushId(pushid)
    Storage.getUserid().then(userid=>{
      if(userid){
        this._requestPushId(userid,pushid);
      }
    });
  }
  /**
   * 设置pushid
   */
  _requestPushId(userid,pushid){
    var os = '';
    if(Platform.OS == 'ios'){
      os = 'ios';
    }
    if(Platform.OS == 'android'){
      os = 'android';
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
  _analysisObserver(obj){
    var action = obj.action;
    var param = obj.param;
    switch (action) {
      case Emitter.READMSG:
        this._setMsgState();
        break;
      default:
        break;
    }
  }
}
