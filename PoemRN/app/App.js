import React, { Component } from 'react';
import {
  Platform,
  DeviceEventEmitter,
  NetInfo,
  BackHandler,
} from 'react-native';
import { connect,Provider } from 'react-redux';
import {addNavigationHelpers,NavigationActions} from 'react-navigation';
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
  ChatDao,
  Emitter,
} from './AppUtil';

import {AppNavigator} from './AppNavigator';

const uriPrefix = Platform.OS == 'ios'?'poem://':'poem://poem/';
import store from './redux/store/ConfigureStore';
// import getStore from './redux/store/ConfigureStore';

// let store = configureStore();
// const navReducer = (state, action) => {
//     const newState = AppNavigator.router.getStateForAction(action, state);
//     return newState || state;
// };

const mapStateToProps = (state) => ({
    nav: state.nav
});

class AppRoot extends Component {
    componentDidMount() {
      BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    }
    componentWillUnmount() {
      BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    }
    render() {
      const { dispatch, nav } = this.props;
      const navigation = addNavigationHelpers({
        dispatch:dispatch,
        state:nav
      });
        return (
            <AppNavigator
                navigation={navigation}
            />
        );
    }
    onBackPress = () => {
      console.log('---onBackPress---')
      const { dispatch, nav } = this.props;
      console.log(nav);
      if (nav.index === 0) {
         return false;
      }
      dispatch(NavigationActions.back());
      return true;
   };
}

const AppWithNavigationState = connect(mapStateToProps)(AppRoot);

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
    let userid = Storage.getUserid();
    if(userid){
      Global.user.userid = userid;
      this._requestUserInfo(userid);
    }
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
       this._parseObserver(obj);
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
      console.log(map)
      // console.log("pushMsg: "+ map.message);
			// console.log("extras: " + map.extras);
			// console.log(map.aps);
		});
    /**
     * 接收推送事件
     * android     {extras: "{"type":"news"}", alertContent: "nihao1", id: 531497865}
     */
		JPushModule.addReceiveNotificationListener((map) => {
      console.log('---JPushModule Receive Notification')
      console.log(map)
      // console.log(map.aps)
			// console.log("alertContent: " + map.alertContent);
			// console.log("extras: " + map.extras);
      // var extra = JSON.parse(map.extras);
      // console.log(extra.key + ": " + extra.value);
      this._parseJPushExtras(map);
		});
    //点击推送事件
		JPushModule.addReceiveOpenNotificationListener((map) => {
			console.log("---JPushModule Open Notification");
      console.log(map);
			// console.log("map.extra: " + map.extras);
			// JPushModule.jumpToPushActivity("SecondActivity");
			this._parseJPushExtras(map);
      if(Platform.OS == 'android'){
        var id = map.id;
        JPushModule.clearNotificationById(id);
      }
		});
    //如果添加这个监听，设备注册成功后，打开应用将会回调这个事件。
		JPushModule.addGetRegistrationIdListener((registrationId) => {
			console.log("---JPushModule Device register succeed, registrationId " + registrationId);
		});
    // //检测网络是否连接
    // NetInfo.isConnected.fetch().done((isConnected)=>{
    //   console.log('---检测网络是否连接---');
    //     console.log(isConnected);
    // });
    // //    检测网络连接信息
    // NetInfo.fetch().done((connectionInfo)=>{
    //     console.log('---检测网络连接信息---');
    //     console.log(connectionInfo);
    // });
    // //监听网络状态改变
    // NetInfo.addEventListener('change', this.handleConnectivityChange);
    SplashScreen.hide();
  }
  componentWillUnmount(){
    JPushModule.removeReceiveCustomMsgListener(receiveCustomMsgEvent);
		JPushModule.removeReceiveNotificationListener(receiveNotificationEvent);
		JPushModule.removeReceiveOpenNotificationListener(openNotificationEvent);
		JPushModule.removeGetRegistrationIdListener(getRegistrationIdEvent);
    DeviceEventEmitter.removeAllListeners();
    // NetInfo.removeEventListener('change', this.handleConnectivityChange);
    console.log('---this.refs.message_rot---')
  }
  render() {
      console.log('----1212121-----')
      console.log(this);
      return(
        <Provider store={store}>
            <AppWithNavigationState/>
        </Provider>
        )
  }
  onBackPress = () => {
    // console.log('---onBackPress---')
    // const { dispatch, nav } = this.props;
    // console.log("Back pressed", nav);
    // const activeRoute = nav.routes[nav.index];
    // if (activeRoute.index === 0) {
    //   return false;
    // }
    // dispatch(NavigationActions.back());
    // return true;
   // if (nav.index === 0) {
   //   return false;
   // }
   // dispatch(NavigationActions.back());
   // return true;
 };
  handleConnectivityChange(status) {
      console.log('status change:' + status);
      //监听第一次改变后, 可以取消监听.或者在componentUnmount中取消监听
     NetInfo.removeEventListener('change', this.handleConnectivityChange);
  }
  _setMsgState(){
    let news_num = MessageDao.getUnreadNum();
    let chat_nume = ChatDao.getAllUnreadNum();
    let num = news_num + chat_nume;
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
        Emitter.emit(Emitter.UPINFO,res.data);
      }else{
        Alert.alert(res.errmsg);
      }
      this._goHide();
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
     }).catch(err=>{
       console.error(err);
     })
   }
   /**
    * 请求私信列表
    */
   _requestChats(){
     if(!Global.user.userid){
       return;
     }
     var json = JSON.stringify({
       userid:Global.user.userid,
     });
     HttpUtil.post(HttpUtil.CHAT_CHATS,json).then(res=>{
       if(res.code == 0){
         let chats = res.data;
         console.log(chats);
         if(chats.length > 0){
           var reads = [];
           var chatsMap = new Map();
           for(var i = 0 ; i < chats.length;i++){
              var chat = chats[i];
              reads[i] = chat.id;
              chatsMap.set(chat.fuserid,chat);
           }
           if(reads.length >0){//设置私信已读
             this._requestChatRead(reads);
           }
           var chatlist = [];
           for (var [key, value] of chatsMap) {
                // console.log(key + '---' + value);
                chatlist.push(value);
            }
            ChatDao.addChats(chats,0);
            ChatDao.addChatLists(chatlist);
            Emitter.emit(Emitter.NEWCHAT);
            this._setMsgState();
         }
       }else{
         console.log(res.errmsg);
       }
     }).catch(err=>{
       console.error(err);
     })
   }
   /**
    * 设置私信已读
    */
   _requestChatRead(reads){
     if(!Global.user.userid){
       return;
     }
     var json = JSON.stringify({
       userid:Global.user.userid,
       reads:reads
     });
     HttpUtil.post(HttpUtil.CHAT_READ,json).then(res=>{
       if(res.code == 0){
         console.log(res.data);
       }else{
         Alert.alert(res.errmsg);
       }
     }).catch(err=>{
       console.error(err);
     })
   }
   /**
    * 保存pushid
    */
  _savePushId(pushid){
    Storage.savePushId(pushid)
    let userid = Storage.getUserid();
    if(userid){
      this._requestPushId(userid,pushid);
    }
  }
  /**
   * 设置pushid
   */
  _requestPushId(userid,pushid){
    if(!userid||!pushid){
      console.log('------_requestPushId error!');
      return;
    }
    console.log('------_requestPushId')
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
  /**
   * 解析推送
   */
  _parseJPushExtras(map){
    var extras = JSON.parse(map.extras);
    var type = extras.type;
    if(type == 'chat'){
        this._requestChats();
    }else if(type == 'news'){
        this._requestMessages();
    }
  }
  _goHide(){
    if(!this.ishide){
      this.ishide = true;
      SplashScreen.hide();
    }
  }
  _parseObserver(obj){
    var action = obj.action;
    var param = obj.param;
    switch (action) {
      case Emitter.LOGIN:
        let pushid = Storage.getPushId();
        if(pushid){
          this._requestPushId(Global.user.userid,pushid);
        }
        break;
      case Emitter.READMSG:
      case Emitter.READCHAT:
        this._setMsgState();
        break;
      default:
        break;
    }
  }
}
