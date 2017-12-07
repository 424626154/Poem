'use strict'
/**
 * 消息页
 * @flow
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
     } from 'react-native';

import {
       StyleConfig,
       HeaderConfig,
       UIName,
       HttpUtil,
       pstyles,
       MessageDao,
       ChatDao,
       goPersonalUI,
     } from '../../AppUtil';

import NewsListItem from '../NewsListItem';
type Props = {
      navigation:any,
      papp:Object,
      reduxMsgRead:Function,
};

type State = {
    sourceData:Array<Object>,
    selected:Map<string, boolean>,
    refreshing:boolean,
    isSwiping:boolean,
};
class NewsPage extends React.Component<Props,State>{
  // 数据容器，用来存储数据
  dataContainer = [];
  state = {
      // 存储数据的状态
      sourceData : [],
      selected: (new Map(): Map<string, boolean>),
      refreshing: false,
      isSwiping:false,
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
            keyExtractor={ (item, index) => index+''}
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
  _onPressItem = (id:string,message:Object) => {
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
    if(message.type == 1||message.type == 2||message.type == 3){
      var extend = JSON.parse(message.extend);
      var userid = extend.userid;
      if(userid){
        goPersonalUI(this.props.navigation.navigate,userid);
      }
    }
  }
  _onDelItem = (id: number,item:Object) => {
    if(Platform.OS === 'android'){
      Alert.alert('删除通知',null,
            [
              {text: '删除', onPress: () =>{
                this._onDeleteItem(item);
              }},
            ]
          )
    }else{
      this._onDeleteItem(item);
    }
  }
  _onDeleteItem(item){
    var del = false;
    console.log('---rid',item.rid)
    this.dataContainer = this.state.sourceData;
    for(var i = this.dataContainer.length-1 ; i >= 0 ; i -- ){
      if(this.dataContainer[i].rid == item.rid){
        this.dataContainer.splice(i,1);
        MessageDao.deleteMessage(item.rid);
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
          <NewsListItem
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
  _pushNews(){
    console.log('------NewsPage() _pushNews')
    let msgs = MessageDao.getMessages();
    this.dataContainer = msgs||[];
    this.setState({
      sourceData: this.dataContainer
    });
  }
  _requestMessages(){
    // console.log('---_requestMessages')
    // console.log(this.props.papp.userid)
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
      userid:this.props.papp.userid,
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
