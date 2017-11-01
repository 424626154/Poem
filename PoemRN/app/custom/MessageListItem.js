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
import {CachedImage} from "react-native-img-cache";
import Swipeable from 'react-native-swipeable';
import {
      StyleConfig,
      ImageConfig,
      Utils,
      pstyles
    } from '../AppUtil';
export default class MessageListItem extends React.Component{
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
        <View style={[styles.msg,{backgroundColor:message.state == 1?StyleConfig.C_FFFFFF:StyleConfig.C_D4D4D4}]}>
          <View style={styles.msg_icon}>
            <CachedImage
              style={pstyles.small_head}
              source={this._logicSource(message)}
              />
          </View>
          <View style={styles.msg_text}>
            <Text style={styles.msg_title}>{message.id}_{message.title}</Text>
            <Text style={styles.msg_content} numberOfLines={1}>{message.content}</Text>
          </View>
          <View style={styles.msg_more}>
            <Text style={styles.msg_time}>{Utils.dateStr(message.time)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
      );
  }

  _logicSource(message){
    var source ;
      if(message.type == 0){
        source = ImageConfig.official;
      }
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
