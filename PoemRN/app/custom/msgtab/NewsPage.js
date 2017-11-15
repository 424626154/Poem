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
      Alert,
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

import MessageListItem from '../MessageListItem';

class NewsPage extends React.Component{
  // 数据容器，用来存储数据
  dataContainer = [];
  constructor(props){
    super(props);
    console.log('---NewsPage()---')
    this.state = {
        // 存储数据的状态
        sourceData : [],
        selected: (new Map(): Map<String, boolean>),
        refreshing: false,
        userid:Global.user.userid||'',
    }
  }
  componentDidMount(){
    //因为tab采用lazy加载方式，所以第一次需要在此处调用
      this._loadNews();
  }
  componentWillUnmount(){

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
  _onPressItem = (id: string,message:Object) => {
      this.setState((state) => {
          const selected = new Map(state.selected);
          selected.set(id, !selected.get(id));
          return {selected}
      });
      console.log('---_onPressItem---');
      console.log(message);
      if(message.state == 0){
        message.state = 1;
        MessageDao.updateMessageState(message);
        this.props.reduxMsgRead();
      }
      if(message.type == 1||message.type == 2){
        var extend = JSON.parse(message.extend);
        console.log("------extend------");
        console.log(extend);
        var pid = extend.pid;
        if(pid){
          this.props.navigation.navigate(UIName.DetailsUI,{id:pid});
        }
      }else if(message.type == 3){
        var extend = JSON.parse(message.extend);
        var userid = extend.userid;
        if(userid){
          goPersonalUI(this.props.navigation.navigate,userid);
        }
      }else{
        this.props.navigation.navigate(UIName.MsgContentUI,{message:message});
      }
  };
  _onIconItem = (id: string,message:Object) => {
    if(message.type == 1){
      var extend = JSON.parse(message.extend);
      var userid = extend.userid;
      if(userid){
        goPersonalUI(this.props.navigation.navigate,userid);
      }
    }
  }
  _onDelItem = (id: int,message:Object) => {
    var del = false;
    this.dataContainer = this.state.sourceData;
    for(var i = this.dataContainer.length-1 ; i >= 0 ; i -- ){
      if(this.dataContainer[i].id == id){
        this.dataContainer.splice(i,1);
        MessageDao.deleteMessage(message.rid);
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
          <MessageListItem
              id={item.id}
              onPressItem={ this._onPressItem }
              onDelItem={this._onDelItem}
              onIconItem={this._onIconItem}
              selected={ !!this.state.selected.get(item.id) }
              message= {item}
          />
      );
  };
  //下拉刷新
  _renderRefresh = () => {
    console.log('---_renderRefresh');
    this._requestMessages();
  }
  //上拉刷新
  _onEndReached = () => {
    console.log('---_onEndReached');
  }
  _loadNews(){
    let msgs = MessageDao.getMessages();
    this.dataContainer = msgs||[];
    this.setState({
      sourceData: this.dataContainer
    });
    this._requestMessages();
  }

  _requestMessages(){
    console.log('---_requestMessages')
    console.log(Global.user.userid)
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
          let msgs = MessageDao.addMessages(messages);
          this.dataContainer = msgs.concat(this.state.sourceData);
          this.setState({
            sourceData: this.dataContainer
          });
          var reads = [];
          for(var i = 0 ; i < messages.length ; i ++){
            var id = messages[i].id;
            reads[i]= id;
          }
          if(reads.length >0){
            this._requestMsgRead(reads);
          }
        }
        this.props.reduxMsgRead();
      }else{
        Alert.alert(res.errmsg);
      }
    }).catch(err=>{
      console.error(err);
    })
  }

  _requestMsgRead(reads){
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
}

const styles = StyleSheet.create({

});

export default NewsPage;
