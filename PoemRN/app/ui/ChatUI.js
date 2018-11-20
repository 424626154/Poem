'use strict'
/**
 * 私信页面
 * @flow
 */
import React from 'react';
import {
       StyleSheet,
       View,
       TouchableOpacity,
       Alert,
       Text,
       ActivityIndicator,
       Clipboard,
       Vibration,
       Platform,
} from 'react-native';
import {connect} from 'react-redux';
import * as UserActions from '../redux/actions/UserActions';
import {
       StyleConfig,
       HeaderConfig,
       StorageConfig,
       HttpUtil,
       Utils,
       pstyles,
       UIName,
       ChatDao,
       goPersonalUI,
      } from '../AppUtil';

import{
      NavBack,
      }from '../custom/Custom';

import { GiftedChat,Send ,Bubble,Avatar} from 'react-native-gifted-chat';
import ActionSheet from 'react-native-actionsheet'
require('moment/locale/zh-cn')

const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 2
const options = [ '取消', '拷贝', '删除' ]
const title = '选择您需要的操作'
type Props = {
    navigation:any,
    papp:Object,
};

type State = {
    tuserid:string,
    headurl:any,
    head:string,
    pseudonym:string,
    mypseudonym:string,
    myheadurl:string,
    messages: Array<Object>,
    animating:boolean,
    message:Object,
};
class ChatUI extends React.Component<Props,State>{
  static navigationOptions = ({navigation}) => ({
        title: navigation.state.params.pseudonym,
        headerTintColor:HeaderConfig.headerTintColor,
        headerTitleStyle:HeaderConfig.headerTitleStyle,
        headerStyle:HeaderConfig.headerStyle,
        headerLeft:(<NavBack navigation={navigation}/>),
        headerRight:(<View style={pstyles.nav_right}/>),
     });
   handlePress:Function;
   showActionSheet:Function;
   timer:any;
   ActionSheet:any;
  constructor(props){
    super(props);
    let params = this.props.navigation.state.params;
    let tuserid = params.tuserid;
    let head = params.head;
    let pseudonym = params.pseudonym;
    let headurl = HttpUtil.getHeadurl(head);
    let user = this.props.papp.user;
    let mypseudonym = user.pseudonym;
    let myheadurl = HttpUtil.getHeadurl(user.head);
    this.state = {
       tuserid:tuserid,
       headurl:headurl,
       head:head,
       pseudonym:pseudonym,
       mypseudonym:mypseudonym,
       myheadurl:myheadurl,
       messages: [],
       animating:false,
       message:{},
    }
    this.handlePress = this.handlePress.bind(this)
    this.showActionSheet = this.showActionSheet.bind(this)
  }
  componentDidMount(){
    let messages = [];
    let { dispatch } = this.props.navigation;
    dispatch(UserActions.raSetChatUser(this.state.tuserid));
    this.setState({animating:true})
    this.timer = setTimeout(
      () => {
        let chats = ChatDao.queryChats(this.state.tuserid);
        this._setRead(chats);
        this._addMessages(chats);
        this._requestChats();
        this.setState({animating:false})
      },
      0
    );
  }
  componentWillUnmount(){
    let { dispatch } = this.props.navigation;
    dispatch(UserActions.raSetChatUser(''));
    dispatch(UserActions.raSetPushChat(true));
    this.timer && clearTimeout(this.timer)
  }
  shouldComponentUpdate(nextProps, nextState){
    if(nextProps.papp.push_chat_user&&!this.props.papp.push_chat_user){//
      console.log('----- ChatUI() shouldComponentUpdate')
      console.log('------change push_chat_user')
      console.log('------nextProps.papp.push_chat_user:',nextProps.papp.push_chat_user)
      console.log('------this.props.papp.push_chat_user:',this.props.papp.push_chat_user)
        let db_chats = ChatDao.queryUnreadChats(this.state.tuserid);
        this._setRead(db_chats);
        this._addMessages(db_chats);
        let { dispatch } = this.props.navigation;
        dispatch(UserActions.raSetPushChatUser(false));
    }
    return true;
  }
  showActionSheet() {
    this.ActionSheet.show()
  }

  handlePress(i) {
    console.log(i)
    if(this.state.message){
      if(i == 1){
        let text = this.state.message.text
        if(text){
          Clipboard.setString(text);
        }
      }else if(i == 2){
        let id = this.state.message._id;
        if(id){
          ChatDao.deleteChat(id)
          this.setState((previousState) => ({
            messages: this.subtract(previousState.messages, id),
          }));
        }
      }
    }
  }
  subtract(currentMessages = [],id){
    console.log('-----subtract')
    console.log(currentMessages)
    console.log(id)
    if(currentMessages.length > 0){
      for(var i = currentMessages.length-1 ; i >= 0 ; i -- ){
        if(currentMessages[i]._id == id){
          currentMessages.splice(i,1);
          console.log('----delete')
        }
      }
    }
    console.log(currentMessages)

    // Object.assign(newMessages,currentMessages);
    let newMessages = [...currentMessages];
    console.log(newMessages)
    return newMessages;
  }
  onSend(messages = []) {
   let message = messages[0];
   console.log(message);
   let msg = message.text;
   let time = Utils.getTime();
   let chat = {
      type:0,
      fuserid:this.props.papp.userid,
      tuserid:this.state.tuserid,
      msg:msg,
      time:time,
   }
   var save_chat = ChatDao.addChat(chat,1,0)
   this._requestSendChat(msg,save_chat.rid);
   let chatlist = {
     fuserid:this.props.papp.userid,
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
       createdAt: save_chat.time*1000,
       user: {
         _id: 1,
         name: this.state.mypseudonym,
         avatar: this.state.myheadurl,
       },
     }
   this.setState((previousState) => ({
     messages: GiftedChat.append(previousState.messages, addmessage),
   }));
 }
 render(){
    return(
      <View style={pstyles.container}>
        <ActivityIndicator
         animating={this.state.animating}
         style={styles.centering}
         color={StyleConfig.C_333333}
         size="large"/>
        <GiftedChat
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
            name: this.state.mypseudonym,
            avatar: this.state.myheadurl,
          }}
          showUserAvatar={true}
          placeholder={'请输入私信内容'}
          renderSend={this.renderSend}
          locale='zh-cn'//设置时间
          onLongPress={(context, message) => {
              console.log(context) // I got actionSheet
              console.log(message) // I got undefined
              if(Platform.OS === 'android')Vibration.vibrate([0,10],false);
              this.showActionSheet();
              this.setState({message:message,})
          }}
          onPressAvatar={user=>{
            // console.log(user)
            goPersonalUI(this.props.navigation.navigate,this.state.tuserid);
          }}
          renderBubble={this.renderBubble}
          renderAvatar={this.renderAvatar}
        />
        <ActionSheet
            ref={o => this.ActionSheet = o}
            title={title}
            options={options}
            cancelButtonIndex={CANCEL_INDEX}
            destructiveButtonIndex={DESTRUCTIVE_INDEX}
            onPress={this.handlePress}
          />
    </View>
    )
  }
  renderSend(props) {
        return (
            <Send
                {...props}
            >
                <Text style={styles.send}>发送</Text>
            </Send>
        );
    }
    renderBubble (props) {
      return (
        <Bubble
          {...props}
          wrapperStyle={{
            left:{
              backgroundColor: '#666666',
            },
            right: {
              backgroundColor: '#ffffff',
            }
          }}
          textStyle = {{
              left: {
                color: '#ffffff',
              },
              right: {
                color: StyleConfig.C_333333,
              }
            }}
        />
      )
    }

    renderAvatar(props){
      return (
        <Avatar
          {...props}
          imageStyle={{
            left: {
              height: 40,
              width: 40,
              borderRadius: 20,
            },
            right:{
              height: 40,
              width: 40,
              borderRadius: 20,
            }
          }}
        />
      );
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
              createdAt: chat.time*1000,
              user: {
                _id: 1,
                name: this.state.mypseudonym,
                avatar: this.state.myheadurl,
              },
            }
            messages[i] = message;
        }else{
          let message = {
              _id: chat.rid,
              text: chat.msg,
              createdAt: chat.time*1000,
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
    if(chatuid){
      ChatDao.setChatRead(rids,1);
      let num = ChatDao.updateChatListNum(chatuid);
      console.log('---updateChatListNum---')
      console.log(num);
      console.log(chatuid)
    }
  }
  /**
   * 发送消息
   */
  _requestSendChat(msg,checkid){
    if(msg){
      var json = JSON.stringify({
        type:0,
        fuserid:this.props.papp.userid,
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
    if(!this.props.papp.userid){
      return;
    }
    var json = JSON.stringify({
      userid:this.props.papp.userid,
      fuserid:this.state.tuserid,
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
    if(!this.props.papp.userid){
      return
    }
    var json = JSON.stringify({
      userid:this.props.papp.userid,
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
      send:{
        fontSize:18,
        color:StyleConfig.C_333333,
        marginRight: 6,
        marginBottom: 10,
      },
      centering: {
       alignItems: 'center',
       justifyContent: 'center',
       padding: 8,
     },
});

export default connect(
    state => ({
        papp: state.papp,
    }),
)(ChatUI);
