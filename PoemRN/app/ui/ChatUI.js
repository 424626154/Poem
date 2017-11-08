'use strict'
/**
 * 私信页面
 */
 import React from 'react';
 import {
         StyleSheet,
         View,
         TouchableOpacity,
         Alert,
         Text,
         DeviceEventEmitter,
 } from 'react-native';
 import {
   StyleConfig,
   HeaderConfig,
   StorageConfig,
   HttpUtil,
   Global,
   Utils,
   pstyles,
   PImage,
   UIName,
   ChatDao,
   Emitter,
 } from '../AppUtil';
import { GiftedChat } from 'react-native-gifted-chat';
// const messages  = [
//   {
//     _id: Math.round(Math.random() * 1000000),
//     text: 'Yes, and I use Gifted Chat!',
//     createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
//     user: {
//       _id: 1,
//       name: 'Developer',
//     },
//     sent: true,
//     received: true,
//     // location: {
//     //   latitude: 48.864601,
//     //   longitude: 2.398704
//     // },
//   },
//   {
//     _id: Math.round(Math.random() * 1000000),
//     text: 'Are you building a chat app?',
//     createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
//     user: {
//       _id: 2,
//       name: 'React Native',
//     },
//   },
//   {
//     _id: Math.round(Math.random() * 1000000),
//     text: "You are officially rocking GiftedChat.",
//     createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
//     system: true,
//   },
// ];
export default class ChatUI extends React.Component{
  static navigationOptions = ({navigation}) => ({
        title: navigation.state.params.pseudonym,
        headerTintColor:StyleConfig.C_FFFFFF,
        headerTitleStyle:HeaderConfig.headerTitleStyle,
        headerStyle:HeaderConfig.headerStyle,
        headerLeft:(
          <TouchableOpacity  onPress={()=>navigation.goBack()}>
            <Text style={pstyles.nav_left}>返回</Text>
          </TouchableOpacity>
        ),
     });
  constructor(props){
    super(props);
    let params = this.props.navigation.state.params;
    let tuserid = params.tuserid;
    let head = params.head;
    let pseudonym = params.pseudonym;
    let headurl = HttpUtil.getHeadurl(head);
    this.state = {
       tuserid:tuserid,
       headurl:headurl,
       head:head,
       pseudonym:pseudonym,
       messages: [],
    }
  }
  componentDidMount(){
    let messages = [];
    let chats = ChatDao.queryChats(this.state.tuserid);
    this._setRead(chats);
    this._addMessages(chats);
    this._requestChats();
    DeviceEventEmitter.addListener(Emitter.OBSERVER,obj=>{
       this._parseObserver(obj);
    });
  }
  componentWillUnmount(){
    DeviceEventEmitter.removeAllListeners();
  }
  onSend(messages = []) {
   let message = messages[0];
   console.log(message);
   let msg = message.text;
   let time = Utils.getTime();
   let chat = {
      type:0,
      fuserid:Global.user.userid,
      tuserid:this.state.tuserid,
      msg:msg,
      time:time,
   }
   var save_chat = ChatDao.addChat(chat,1,0)
   this._requestSendChat(msg,save_chat.rid);
   let chatlist = {
     fuserid:Global.user.userid,
     tuserid:this.state.tuserid,
     msg:msg,
     head:this.state.head,
     pseudonym:this.state.pseudonym,
     time:time,
   }
   ChatDao.addChatList(chatlist);
   var addmessage  = {
       _id: save_chat.rid,
       text: save_chat.msg,
       createdAt: save_chat.time,
       user: {
         _id: 1,
       },
     }
   this.setState((previousState) => ({
     messages: GiftedChat.append(previousState.messages, addmessage),
   }));
 }
 render(){
    return(
      <GiftedChat
      messages={this.state.messages}
      onSend={(messages) => this.onSend(messages)}
      user={{
        _id: 1,
      }}
    />
    )
  }
  /**
   * 解析观察者
   */
  _parseObserver(obj){
    var action = obj.action;
    var param = obj.param;
    switch (action) {
      case Emitter.NEWCHAT:
        let db_chats = ChatDao.queryUnreadChats(this.state.tuserid);
        this._setRead(db_chats);
        this._addMessages(db_chats);
        break;
      default:
        break;
    }
  }
  /**
   * 填充消息内容
   */
  _addMessages(chats){
    if(chats.length > 0){
      let messages = [];
      for(let i = 0 ; i < chats.length ;i++){
        let chat = chats[i];
        if(chat.style == 1){
          let message = {
              _id: chat.rid,
              text: chat.msg,
              createdAt: chat.time,
              user: {
                _id: 1,
              },
            }
            messages[i] = message;
        }else{
          let message = {
              _id: chat.rid,
              text: chat.msg,
              createdAt: chat.time,
              user: {
                _id: 2,
                name: this.state.pseudonym,
                avatar: this.state.headurl,
              },
            }
            messages[i] = message;
        }
      }
      console.log('---addMessages---');
      console.log(messages);
      this.setState((previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }));
    }
  }
  /**
   * 设置已读
   */
  _setRead(chats){
    if(chats.length == 0){
      return;
    }
    let rids = [];
    let chatuid = '';
    for(var i = 0 ; i < chats.length ; i ++){
        if(chats[i].read == 0){
          rids.push(chats[i].rid);
          chatuid = chats[i].chatuid;
        }
    }
    ChatDao.setChatRead(rids,1);
    let num = ChatDao.updateChatListNum(chatuid)
    Emitter.emit(Emitter.READCHAT,{chatuid:chatuid,num:num})
  }
  /**
   * 发送消息
   */
  _requestSendChat(msg,checkid){
    if(msg){
      var json = JSON.stringify({
        type:0,
        fuserid:Global.user.userid,
        tuserid:this.state.tuserid,
        msg:msg,
        checkid:checkid,
      });
      HttpUtil.post(HttpUtil.CHAT_SEND,json).then(res=>{
        if(res.code == 0){
          let chat = res.data;
          if(chat.checkid){
            var extend = chat.extend;
            if(typeof(extend) !== 'string'){
              extend = JSON.stringify(chat.extend);
            }
            ChatDao.updateChatSend(chat.checkid,chat.id,extend,1);
          }
        }
      }).catch(err=>{
        console.error(err);
      })
    }
  }

  /**
   * 消息列表
   */
  _requestChats(){
    var json = JSON.stringify({
      userid:Global.user.userid,
      fuserid:this.state.fuserid,
    });
    HttpUtil.post(HttpUtil.CHAT_CHATS,json).then(res=>{
      if(res.code == 0){
        let chats = res.data;
        console.log(chats);
        let temp_chats = ChatDao.addChats(chats,0);
        this._setRead(temp_chats);
        this._addMessages(temp_chats);
        if(chats.length > 0){
          let reads = [];
          for(let i = 0 ;i < chats.length ; i ++){
            reads[i] = chats[i].id;
          }
          this._requestReads(reads);
        }
      }else{
        console.log(res.errmsg);
      }
    }).catch(err=>{
      console.error(err);
    });
  }
  /**
   * 设置已读
   */
  _requestReads(reads){
    var json = JSON.stringify({
      userid:Global.user.userid,
      reads:reads,
    });
    HttpUtil.post(HttpUtil.CHAT_READ,json).then(res=>{
      if(res.code == 0){
        console.log(res.data);
      }else{
        console.log(res.errmsg);
      }
    }).catch(err=>{
      console.error(err);
    });
  }
}

const styles = StyleSheet.create({

});
