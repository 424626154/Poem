'use strict';
/**
 * 根视图
 * @flow
 */
import React, { Component } from 'react';
import {
  BackHandler,
  Platform,
  AppState,
} from 'react-native';
import {AppNavigator} from './AppNavigator';
import {addNavigationHelpers,NavigationActions} from 'react-navigation';
import { connect } from 'react-redux';
import * as UserActions from './redux/actions/UserActions'
import _ from 'lodash';
import {
    Storage,
    HttpUtil,
    MessageDao,
    ChatDao,
} from './AppUtil';

import JPushModule from 'jpush-react-native';
import AnalyticsUtil from './umeng/AnalyticsUtil';

const uriPrefix = Platform.OS == 'ios'?'poem://':'poem://poem/';

const receiveCustomMsgEvent = "receivePushMsg";
const receiveNotificationEvent = "receiveNotification";
const openNotificationEvent = "openNotification";
const getRegistrationIdEvent = "getRegistrationId";
type Props = {
    dispatch:any,
    nav:any,
    papp:Object,
};
type State = {
    currentAppState:string,
    j_msgid:string,
};
class AppRoot extends Component <Props,State>{
    state = {
      currentAppState: AppState.currentState||'',
      j_msgid:'',
    };
    componentDidMount() {
      AppState.addEventListener('change', this._handleAppStateChange);
      if (Platform.OS === 'android') {
        console.log('---BackHandler.addEventListener---')
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
      }
      let userid = Storage.getUserid();
      console.log('---- AppRoot() userid:',userid)
      if(userid){
        const { dispatch } = this.props;
        dispatch(UserActions.raAutoLogin(userid));
        AnalyticsUtil.profileSignInWithPUID(userid);
        this._requestMessages();
        this._requestChats();
      }

      /*****JPushModule*****/
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
        console.log('--- currentAppState',this.state.currentAppState )
        if(this.state.currentAppState === 'active'){
          console.log('----active')
          if(Platform.OS === 'android'){
            var id = map.id;
            JPushModule.clearNotificationById(id);
          }
          if(Platform.OS === 'ios'){
            // console.log('----ios')
            // JPushModule.getBadge((badge) => {
            //    console.log('------ getBadge',badge)
            //    let temp_badge = badge > 0 ?badge-1:0;
            //    JPushModule.setBadge(0, (success) => {
            //       console.log('------ temp_badge:',temp_badge,' setBadge',success)
            //     });
            //  });
            JPushModule.setBadge(0, (success) => {
               console.log('------ setBadge',success)
             });
          }
        }
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
    }
    componentWillUnmount() {
      AppState.removeEventListener('change', this._handleAppStateChange);
      if (Platform.OS === 'android') {
        console.log('---BackHandler.removeEventListener---')
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
      }
      JPushModule.removeReceiveCustomMsgListener(receiveCustomMsgEvent);
  		JPushModule.removeReceiveNotificationListener(receiveNotificationEvent);
  		JPushModule.removeReceiveOpenNotificationListener(openNotificationEvent);
  		JPushModule.removeGetRegistrationIdListener(getRegistrationIdEvent);
    }
    shouldComponentUpdate(nextProps, nextState){
      if(nextProps.papp.userid !== this.props.papp.userid){
        console.log('------AppRoot() shouldComponentUpdate');
        console.log('-----change userid')
        console.log('------nextProps.papp.userid:',nextProps.papp.userid)
        console.log('------this.props.papp.userid:',this.props.papp.userid)
        if(nextProps.papp.userid){
          let pushid = Storage.getPushId();
          console.log('------pushid:',pushid);
          if(pushid){
            let { dispatch } = this.props;
            dispatch(UserActions.raPushId(nextProps.papp.userid,pushid));
          }
        }
      }
      if(nextProps.papp.num !== this.props.papp.num){
        console.log('------ AppRoot() shouldComponentUpdate')
        console.log('-----change num')
        this._setMsgState(nextProps.papp.num);
      }
      return true;
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
    onBackPress = () =>{
      console.log('---onBackPress---')
      const { dispatch, nav } = this.props;
      if (this.isRootScreen(nav)){
        console.log('---return false')
        BackHandler.exitApp();
        return false
      }
      dispatch(NavigationActions.back());
      return true;
   };
    isRootScreen(nav) {
      console.log('---isRootScreen')
      console.log(nav)
      if (nav.index === 0&&nav.routes.length === 1&&nav.routes[0].index === 0) {
         return true;
       }
      return false;
    }
   _handleAppStateChange = (nextAppState) => {
      if (this.state.currentAppState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground!')
      }
      console.log('---- _handleAppStateChange nextAppState:',nextAppState)
      this.setState({currentAppState: nextAppState});
    }

   /**
    * 请求消息列表
    */
    _requestMessages(){
      if(!this.props.papp.userid){
        return;
      }
      var json = JSON.stringify({
        userid:this.props.papp.userid,
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
              let { dispatch } = this.props;
              dispatch(UserActions.raSetPushNews(true));
              dispatch(UserActions.raMsgRead());
            }
          }
        }else{
          console.log(res.errmsg);
        }
      }).catch(err=>{
        console.error(err);
      })
    }
    /**
     * 设置消息已读
     */
    _requestMsgRead(reads){
      if(!this.props.papp.userid){
        return;
      }
      var json = JSON.stringify({
        userid:this.props.papp.userid,
        reads:reads
      });
      HttpUtil.post(HttpUtil.MESSAGE_READ,json).then(res=>{
        if(res.code == 0){
          console.log(res.data);
        }else{
          console.log(res.errmsg);
        }
      }).catch(err=>{
        console.error(err);
      })
    }
    /**
     * 请求私信列表
     */
    _requestChats(){
      if(!this.props.papp.userid){
        return;
      }
      var json = JSON.stringify({
        userid:this.props.papp.userid,
      });
      HttpUtil.post(HttpUtil.CHAT_CHATS,json).then(res=>{
        if(res.code == 0){
          let chats = res.data;
          console.log(chats);
          if(chats.length > 0){
            var reads = [];
            var chatsMap = new Map();
            var ischatuser = false;
            for(var i = 0 ; i < chats.length;i++){
               var chat = chats[i];
               reads[i] = chat.id;
               if(chat.fuserid === this.props.papp.chatuser){
                 console.log('---- chatuser:',this.props.papp.chatuser);
                 ischatuser = true;
               }
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
             const { dispatch } = this.props;
             dispatch(UserActions.raSetPushChat(true));
             dispatch(UserActions.raMsgRead());
             if(ischatuser){
               dispatch(UserActions.raSetPushChatUser(true));
             }
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
      if(!this.props.papp.userid){
        return;
      }
      var json = JSON.stringify({
        userid:this.props.papp.userid,
        reads:reads
      });
      HttpUtil.post(HttpUtil.CHAT_READ,json).then(res=>{
        if(res.code == 0){
          console.log(res.data);
        }else{
          console.log(res.errmsg);
        }
      }).catch(err=>{
        console.error(err);
      })
    }

    // handleConnectivityChange(status) {
    //     console.log('status change:' + status);
    //     //监听第一次改变后, 可以取消监听.或者在componentUnmount中取消监听
    //    NetInfo.removeEventListener('change', this.handleConnectivityChange);
    // }
    _setMsgState(num:number){
      console.log('---_setMsgState num:'+num);
      if(Platform.OS == 'ios'){
        JPushModule.setBadge(num, (success) => {
          console.log('------JPushModule setBadge');
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

      var type = '';
      let j_msgid = '';
      if(Platform.OS === 'android'){
        var extras = JSON.parse(map.extras);
        type = extras.type;
        j_msgid = map.id;
      }
      if(Platform.OS === 'ios'){
        type = map.type;
        j_msgid = map._j_msgid;
      }
      console.log('------_parseJPushExtras type:',type);
      console.log('------_parseJPushExtras j_msgid:',j_msgid);
      if(this.state.j_msgid === j_msgid){
        console.log('----- repetition pushid',j_msgid);
        return;
      }
      this.setState({j_msgid:j_msgid})
      if(type == 'chat'){
          this._requestChats();
      }else if(type == 'news'){
          this._requestMessages();
      }
    }
}

const mapStateToProps = (state) => ({
    nav: state.nav,
    papp: state.papp,
});
export default connect(mapStateToProps)(AppRoot);
