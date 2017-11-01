'use strict'
/**
 * 消息
 */
import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    FlatList,
    Text,
} from 'react-native';
import MessageListItem from '../custom/MessageListItem';
import {
  StyleConfig,
  HeaderConfig,
  Global,
  HttpUtil,
  pstyles,
  MessageDao,
} from '../AppUtil';

export default class MessageUI extends Component {
  static navigationOptions = ({navigation}) => ({
        title:'消息',
        headerTintColor:StyleConfig.C_FFFFFF,
        headerTitleStyle:HeaderConfig.headerTitleStyle,
        headerStyle:HeaderConfig.headerStyle,
        headerLeft:(
          <TouchableOpacity  onPress={()=>navigation.goBack()}>
            <Text style={pstyles.nav_left}>返回</Text>
          </TouchableOpacity>
        ),
     });
     // 数据容器，用来存储数据
     dataContainer = [];
     constructor(props){
       super(props)
       this.state = {
           // 存储数据的状态
           sourceData : [],
           selected: (new Map(): Map<String, boolean>),
           refreshing: false,
           userid:Global.user.userid,
       }
     }
     componentDidMount(){
        let msgs = MessageDao.getMessages();
        if(msgs.length > 0){
          this.dataContainer = msgs.concat(this.dataContainer);
          this.setState({
            sourceData: this.dataContainer
          });
        }
        this._requestMessages();
     }
     componentWillUnmount(){

     }
    render(){
      return(
        <View style={styles.container}>
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

        </View>
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
        message.state = 1;
        MessageDao.updateMessageState(message);
        this.props.navigation.navigate('MsgContentUI',{message:message})
    };
    _onDelItem = (id: int,message:Object) => {
      var del = false;
      this.dataContainer = this.state.sourceData;
      for(var i = this.dataContainer.length-1 ; i >= 0 ; i -- ){
        if(this.dataContainer[i].id == id){
          this.dataContainer.splice(i,1);
          MessageDao.deleteMessage(id);
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
                selected={ !!this.state.selected.get(item.id) }
                message= {item}
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

    _requestMessages(){
      var json = JSON.stringify({
        userid:this.state.userid,
      });
      HttpUtil.post(HttpUtil.MESSAGE_MESSAGES,json).then(res=>{
        if(res.code == 0){
          var messages = res.data;
          if(messages.length > 0){
            MessageDao.addMessages(messages);
            this.dataContainer = messages.concat(this.state.sourceData);
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
        }else{
          Alert.alert(res.errmsg);
        }
      }).catch(err=>{
        console.error(err);
      })
    }

    _requestMsgRead(reads){
      var json = JSON.stringify({
        userid:this.state.userid,
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
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
