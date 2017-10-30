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
import {
      StyleConfig,
      ImageConfig,
      Utils,
      pstyles
    } from '../AppUtil';

export default class MessageListItem extends React.Component{
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
  render(){
    const message = this.props.message
    return (
      <TouchableOpacity
        {...this.props}
        onPress={this._onPress}
        >
        <View style={styles.msg}>
          <View style={styles.msg_icon}>
            <CachedImage
              style={pstyles.small_head}
              source={this._logicSource(message)}
              />
          </View>
          <View style={styles.msg_text}>
            <Text style={styles.msg_title}>{message.title}</Text>
            <Text style={styles.msg_content}>{message.content}</Text>
          </View>
          <View style={styles.msg_more}>
            <Text style={styles.msg_time}>{Utils.dateStr(message.time)}</Text>
          </View>
        </View>
      </TouchableOpacity>
      );
  }

  _logicSource(message){
    var source ;
      if(message.type == 0){
        source = ImageConfig.official;
      }
    return source;
  }
}

const styles = StyleSheet.create({
  msg:{
    flexDirection:'row',
    padding:10,
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

  }
});
