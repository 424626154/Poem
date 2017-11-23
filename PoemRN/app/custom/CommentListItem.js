'use strict'
/**
 * 评论组件
 */
import React from 'react';
import {
   StyleSheet,
   Text,
   View,
   TouchableOpacity,
} from 'react-native';
import HTMLView from 'react-native-htmlview';
import {
      StyleConfig,
      UIName,
      Utils,
      pstyles,
      PImage,
    } from '../AppUtil';
import { Icon } from 'react-native-elements';

class CommentListItem extends React.PureComponent {
    _onPress = () => {
        this.props.onPressItem(this.props.id,this.props.comment);
    };

    render() {
      const comment = this.props.comment;
      // console.log(comment)
        return(
            <TouchableOpacity
                {...this.props}
                onPress={this._onPress}
                >
                <View style={styles.bg}>
                  <TouchableOpacity
                    onPress={()=>{
                      this.props.onPersonal(comment.userid)
                    }}>
                    <PImage
                      style={pstyles.small1_head}
                      source={this.props.headurl}
                      />
                  </TouchableOpacity>
                    <View style={styles.bg1}>
                      <Text style={styles.name}>{comment.pseudonym}</Text>
                      <Text style={styles.time}>{this.props.time}</Text>
                      {this._loadComment(comment)}
                      <View style={styles.line}></View>
                    </View>
                    <TouchableOpacity
                      style={styles.comment_but}
                      onPress={this._onPress}>
                      <Icon
                        name='sms'
                        size={18}
                        type="MaterialIcons"
                        color={StyleConfig.C_D4D4D4}
                        />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    }
    _loadComment(comment){
      var comment_html = '';
      if(comment.cid > 0){
          comment_html ='<div><span><comment_font1>回复</comment_font1></span>&nbsp;<span><comment_name1>'+comment.cpseudonym+'</comment_name1></span><span><comment_font1>&nbsp;:&nbsp;'+comment.comment+'</comment_font1></span></div>';
          return(
            <TouchableOpacity
              style={styles.comment}
              onPress={()=>{
                this.props.onPersonal(comment.cuserid)
              }}>
              <HTMLView
                  style={{flex:1,margin:0,}}
                  value={comment_html}
                  stylesheet={styles}
                  />
            </TouchableOpacity>
          )
      }else{
          comment_html = '<div><span><comment_font1>'+comment.comment+'</comment_font1></span></div>';
          return(
            <View
              style={styles.comment}>
              <HTMLView
                  style={{flex:1,margin:0,}}
                  value={comment_html}
                  stylesheet={styles}
                  />
            </View>
          )
      }
    }
}

const styles = StyleSheet.create({
  bg:{
    flexDirection:'row',
    padding:6,
  },
  bg1:{
    flex:1,
    paddingLeft:10,
  },
  comment:{
    flexDirection:'row',
    paddingTop:10,
  },
  comment_font0:{
    fontSize:16,
    color:'#000000',
  },
  comment_font1:{
    fontSize:14,
    color:StyleConfig.C_7B8992,
  },
  comment_name1:{
    fontSize:14,
    color:StyleConfig.C_1E8AE8,
  },
  name:{
    fontSize:14,
    color:StyleConfig.C_000000,
  },
  time:{
    fontSize:12,
    color:StyleConfig.C_D4D4D4,
  },
  comment_but:{
    position: 'absolute',
    right:0,
  },
  line:{
    flex:1,
    height:1,
    marginTop:6,
    backgroundColor:StyleConfig.C_D4D4D4,
  }
});
export default CommentListItem;
