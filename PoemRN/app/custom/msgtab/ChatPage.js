'use strict'
/**
 * 消息页
 */
import React from 'react';
import {
      StyleSheet,
      Platform,
      Text,
      View,
      FlatList,
      TouchableOpacity,
      DeviceEventEmitter,
     } from 'react-native';
import {
      StyleConfig,
      HeaderConfig,
      UIName,
      Global,
      HttpUtil,
      pstyles,
      MessageDao,
      ChatDao,
      Emitter,
      goPersonalUI,
    } from '../../AppUtil';
import ChatListItem from '../ChatListItem';

export default class ChatPage extends React.Component{
  dataContainer = [];
  constructor(props){
    super(props);
    this.state = {
        // 存储数据的状态
        sourceData : [],
        selected: (new Map(): Map<String, boolean>),
        refreshing: false,
        userid:Global.user.userid,
    }
  }
  componentDidMount(){
    DeviceEventEmitter.addListener(Emitter.OBSERVER,obj=>{
       this._parseObserver(obj);
    });
    let db_chatlist = ChatDao.queryChatLists();
    console.log('---db_chatlist---')
    console.log(db_chatlist)
    this.setState({
      sourceData:db_chatlist,
    })
    this._requestChats();
  }
  componentWillUnmount(){
    DeviceEventEmitter.removeAllListeners();
  }
  render(){
    return(
      <FlatList
            data={ this.state.sourceData }
            extraData={ this.state.selected }
            keyExtractor={ (item, index) => index}
            renderItem={ this._renderItem }
            onEndReachedThreshold={0.1}
            onEndReached={ this._onEndReached }
            ItemSeparatorComponent={ this._renderItemSeparatorComponent }
            ListEmptyComponent={ this._renderEmptyView }
            refreshing={ this.state.refreshing }
            onRefresh={ this._renderRefresh }
            onSwipeStart={() => this.setState({isSwiping: true})}
            onSwipeRelease={() => this.setState({isSwiping: false})}
        />
    )
  }
  // 自定义分割线
  _renderItemSeparatorComponent = ({highlighted}) => (
      <View style={{ height:1, backgroundColor:StyleConfig.C_D4D4D4 }}></View>
  );
  // 空布局
  _renderEmptyView = () => (
      <View style={pstyles.empty}>
       <Text style={pstyles.empty_font}>
       </Text>
      </View>
  );
  _onPressItem = (id: string,item:Object) => {
      this.setState((state) => {
          const selected = new Map(state.selected);
          selected.set(id, !selected.get(id));
          return {selected}
      });
      console.log('---_onPressItem---');
      console.log(item);
      console.log(this.props)
      this.props.navigation.navigate(UIName.ChatUI,
      {tuserid:item.chatuid,head:item.head,pseudonym:item.pseudonym})
  };
  _onIconItem = (id: string,item:Object) => {
    console.log(item)
    let userid = item.chatuid;
    if(userid){
      goPersonalUI(this.props.navigation.navigate,userid);
    }
  }
  _onDelItem = (id: int,item:Object) => {
    var del = false;
    this.dataContainer = this.state.sourceData;
    for(var i = this.dataContainer.length-1 ; i >= 0 ; i -- ){
      if(this.dataContainer[i].id == id){
        this.dataContainer.splice(i,1);
        //数据库删除 列表和子元素
        let chatuid = item.chatuid
        if(chatuid){
          ChatDao.deletaFUidChat(chatuid);
          ChatDao.deletaFUidChatList(chatuid);
        }
        del = true;
      }
    }
    if(del){
      this.setState({
        sourceData: this.dataContainer,
      });
    }
  }
  _renderItem = ({item}) =>{
      return(
          <ChatListItem
              id={item.id}
              onPressItem={ this._onPressItem }
              onDelItem={this._onDelItem}
              onIconItem={this._onIconItem}
              selected={ !!this.state.selected.get(item.id) }
              item= {item}
          />
      );
  };
  //下拉刷新
  _renderRefresh = () => {
    console.log('---_renderRefresh')
  }
  //上拉刷新
  _onEndReached = () => {
    console.log('---_onEndReached')
  }
  /**
   * 解析观察者
   */
  _parseObserver(obj){
    var action = obj.action;
    var param = obj.param;
    console.log('---emitter action:'+action);
    console.log('---emitter param:');
    console.log(param);
    switch (action) {
      case Emitter.READCHAT:
        let chatuid = param.chatuid;
        let num = param.num;
        let ischange = false;
        this.dataContainer = this.state.sourceData;
        for(var i = 0 ; i < this.dataContainer.length;i++){
          if(this.dataContainer[i].chatuid == chatuid){
            this.dataContainer[i].num = num;
            ischange = true;
          }
        }
        console.log(this.dataContainer);
        if(ischange){
          this.setState({
            sourceData:this.dataContainer,
          })
        }
        break;
      default:
        break;
    }
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
        // console.log(chats);
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
              //  console.log(key + '---' + value);
              chatlist.push(value);
           }
           console.log(chatlist);
           ChatDao.addChats(chats,0);
           let db_chatlist = ChatDao.addChatLists(chatlist);
           let temp_chatlist = this.state.sourceData;
           console.log('---temp_chatlist---')
           console.log(temp_chatlist)
           console.log('---db_chatlist---')
           console.log(db_chatlist)
           for(var i = temp_chatlist.length-1 ; i >= 0 ; i -- ){
             for(var j = 0 ; j < db_chatlist.length ; j++){
               if(temp_chatlist[i].chatuid == db_chatlist[j].chatuid){
                 temp_chatlist.splice(i,1);
                 break;
               }
             }
           }
           this.dataContainer = db_chatlist.concat(temp_chatlist);
           console.log(this.dataContainer);
           this.setState({
             sourceData: this.dataContainer
           });
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
}

const styles = StyleSheet.create({

});
