'use strict'
/**
 * 消息列表
 */
import React from 'react';
import {
   StyleSheet,
   Text,
   View,
   TouchableOpacity,
} from 'react-native';
import Swipeable from 'react-native-swipeable';
import HTMLView from 'react-native-htmlview';
import {
      StyleConfig,
      ImageConfig,
      Utils,
      pstyles,
      HttpUtil,
      PImage,
    } from '../AppUtil';
export default class NewsListItem extends React.Component{
  swipeable = null;
  constructor(props){
    super(props);
  }
  componentDidMount(){

  }
  componentWillUpdate(){

  }
  _onPress = () => {
    console.log(this.props.onPressItem)
      this.props.onPressItem(this.props.id,this.props.message);
  };
  _onDel = () => {
    this.swipeable.recenter();
    console.log(this.props.onPressItem)
    this.props.onDelItem(this.props.id,this.props.message);
  };
  _onIcon = ()=>{
    this.props.onIconItem(this.props.id,this.props.message);
  }
  render(){
    const message = this.props.message
    return (
      <Swipeable
        onRef={ref => this.swipeable = ref}
        rightButtons={this._renserRightButtons()}>
      <TouchableOpacity
        {...this.props}
        onPress={this._onPress}
        >
        <View style={[styles.msg,{backgroundColor:message.state == 1?StyleConfig.C_FFFFFF:'#d4d4d422'}]}>
          <TouchableOpacity
            style={styles.msg_icon}
            onPress={this._onIcon}>
            <PImage
              style={pstyles.small_head}
              source={this._logicSource(message)}
              />
          </TouchableOpacity>
          <View style={styles.msg_text}>
            {this._renderMsg(message)}
          </View>
          <View style={styles.msg_more}>
            <Text style={styles.msg_time}>{Utils.dateStr(message.time)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
      );
  }
  _renderMsg(message){
    var extend = JSON.parse(message.extend);
    if(message.type == 1||message.type == 2||message.type == 3){//点赞 评论 关注
      var msg_html =  '';
      if(message.type == 1){
        msg_html = '<div><span><msg_name>'+extend.pseudonym+'</msg_name></span>'+
                      '<span><msg_love>赞了</msg_love></span>'+
                      '<span><msg_info>['+extend.title+']</msg_info></span></div>';

      }
      if(message.type == 2){
        var op_str = '评论:';
        if(extend.cid > 0){
          op_str = '回复:'
        }
        msg_html = '<div><span><msg_name>'+extend.pseudonym+'</msg_name></span>'+
                      '<span><msg_love>'+op_str+'</msg_love></span>'+
                      '<span><msg_info>'+extend.comment+'</msg_info></span></div>';

      }
      if(message.type == 3){
        msg_html = '<div><span><msg_name>'+extend.pseudonym+'</msg_name></span>'+
                      '<span><msg_love>关注了你</msg_love></span></div>'
      }
      // console.log(msg_html);
      return(
        <HTMLView
            style={styles.msg_html}
            value={msg_html}
            stylesheet={styles}
            />
      )
    }else{
      return(
        <View>
          <Text style={styles.msg_title}>{message.title}</Text>
          <Text style={styles.msg_content} numberOfLines={1}>{message.content}</Text>
        </View>
      )
    }
  }
  _logicSource(message){
    var source = ImageConfig.nothead;
      if(message.type == 0||message.type == 4){
        source = ImageConfig.official;
      }else if (message.type == 1||message.type == 2||message.type == 3){
        // console.log('---extend---');
        var extend = JSON.parse(message.extend);
        // console.log(extend);
        var head = extend.head;
        // console.log(head);
        if(head){
          source = {uri:HttpUtil.getHeadurl(head)};
        }
      }
      // console.log(source);
    return source;
  }
  _renserRightButtons(){
    return(
      [
        <TouchableOpacity
          onPress={this._onDel}>
          <View style={styles.delete}>
            <Text style={styles.delete_font}>删除</Text>
          </View>
        </TouchableOpacity>
      ]
    )
  }
}

const styles = StyleSheet.create({
  msg:{
    flexDirection:'row',
    padding:10,
    height:64,
  },
  msg_icon:{

  },
  msg_text:{
    flex:1,
    paddingLeft:10,
  },
  msg_title:{
    paddingBottom:6,
  },
  msg_content:{

  },
  msg_more:{

  },
  msg_titme:{

  },
  msg_html:{

  },
  msg_name:{
    fontSize:16,
    color:StyleConfig.C_000000,
  },
  msg_love:{
    fontSize:16,
    color:StyleConfig.C_D4D4D4,
  },
  msg_info:{
    fontSize:16,
    color:StyleConfig.C_000000,
  },
  msg_time:{
    color:StyleConfig.C_D4D4D4,
  },
  delete:{
    justifyContent:'center',
    backgroundColor:'red',
    height:64,
  },
  delete_font:{
    fontSize:18,
    width:80,
    textAlign:'center',
    color:StyleConfig.C_FFFFFF,
  }
});
