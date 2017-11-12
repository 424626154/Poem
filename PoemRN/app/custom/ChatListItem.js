'use strict'
/**
 * 私信列表item
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
export default class ChatListItem extends React.Component{
  swipeable = null;
  constructor(props){
    super(props);
  }
  componentDidMount(){

  }
  componentWillUpdate(){

  }
  _onPress = () => {
      this.props.onPressItem(this.props.id,this.props.item);
  };
  _onDel = () => {
    this.swipeable.recenter();
    this.props.onDelItem(this.props.id,this.props.item);
  };
  _onIcon = ()=>{
    this.props.onIconItem(this.props.id,this.props.item);
  }
  render(){
    const item = this.props.item;
    return (
      <Swipeable
        onRef={ref => this.swipeable = ref}
        rightButtons={this._renserRightButtons()}>
      <TouchableOpacity
        {...this.props}
        onPress={this._onPress}
        >
        <View style={[styles.msg]}>
          <TouchableOpacity
            style={styles.msg_icon}
            onPress={this._onIcon}>
            <View>
              <PImage
              style={pstyles.small_head}
              source={this._logicSource(item)}
              />
              {this._renderNum(item)}
            </View>
          </TouchableOpacity>
          <View style={styles.msg_text}>
            <View>
              <Text style={styles.msg_title}>{item.pseudonym}</Text>
              <Text style={styles.msg_content} numberOfLines={1}>{item.msg}</Text>
            </View>
          </View>
          <View style={styles.msg_more}>
            <Text style={styles.msg_time}>{Utils.dateStr(item.time)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
      );
  }
  _logicSource(item){
    var source = ImageConfig.nothead;
    var head = item.head;
    if(head){
      source = {uri:HttpUtil.getHeadurl(head)};
    }
    return source;
  }

  _renderNum(item){
    console.log(item)
    let num  = item.num;
    if(num > 0){
      if(num > 99){
        return(
          <View style={styles.msg_num_bg}>
          <Text style={[styles.msg_num,{fontSize:10}]}>
            ...
          </Text>
          </View>
        )
      }else if(num > 9){
        return(
          <View style={styles.msg_num_bg}>
          <Text style={[styles.msg_num,{fontSize:10}]}>
            {num}
          </Text>
          </View>
        )
      }else{
        return(
          <View style={styles.msg_num_bg}>
          <Text style={[styles.msg_num,{fontSize:12}]}>
            {num}
          </Text>
        </View>
        )
      }
    }else{
      return null;
    }
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
    fontSize:18,
    color:StyleConfig.C_1E8AE8,
  },
  msg_love:{
    fontSize:18,
    color:StyleConfig.C_7B8992,
  },
  msg_info:{
    fontSize:18,
    color:StyleConfig.C_000000,
  },
  msg_time:{
    color:StyleConfig.C_7B8992,
  },
  msg_num_bg:{
      backgroundColor:'#ff4040',
      borderRadius:7,
      position: 'absolute',
      width:14,
      height:14,
      top: 0,
      right: 0,
  },
  msg_num:{
    color:StyleConfig.C_FFFFFF,
    backgroundColor:'transparent',
    textAlign:'center',
    width:14,
    height:14,
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
