'use strict'
/**
 * 评论组件
 * @flow
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
type Props = {
    onPressItem:Function,
    onPersonal:Function,
    onDelComment:Function,//删除
    id:number,
    comment:Object,
    time:string,
    headurl:any,
    userid:string,
    fromType?:number,//1 想法 回复
};

type State = {

};
class CommentListItem extends React.PureComponent<Props> {
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
                      style={pstyles.small_head}
                      source={this.props.headurl}
                      noborder={true}
                      />
                  </TouchableOpacity>
                    <View style={styles.bg1}>
                      <Text style={styles.name}>{comment.pseudonym}</Text>
                      <Text style={styles.time}>{this.props.time}</Text>
                      {this._loadComment(comment)}
                      <View style={styles.line}></View>
                    </View>
                    <View style={styles.more}>
                      <TouchableOpacity
                        style={styles.more_item}
                        onPress={this._onPress}>
                        <Icon
                          name='sms'
                          size={18}
                          type="MaterialIcons"
                          color={StyleConfig.C_D4D4D4}
                          />
                      </TouchableOpacity>
                      {this._renderDel(comment,this.props.userid)}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
    _renderDel(comment,userid){
      if(comment.userid === userid){
        return(
          <TouchableOpacity
            style={styles.more_item}
            onPress={()=>{
              this.props.onDelComment(comment);
            }}>
            <Icon
              name='delete'
              size={18}
              type="MaterialIcons"
              color={StyleConfig.C_D4D4D4}
              />
          </TouchableOpacity>
        )
      }else{
        return null;
      }
    }
    _loadComment(comment){
      var comment_html = '';
      if(comment.cid > 0){
          let nickname = '';
          if(this.props.fromType && this.props.fromType == 1){
            nickname = comment.nickname
          }else{
            nickname = comment.cpseudonym
          }
          comment_html ='<div><span><comment_font1>回复</comment_font1></span>&nbsp;<span><comment_name1>'+nickname+'</comment_name1></span><span><comment_font1>&nbsp;:&nbsp;'+comment.comment+'</comment_font1></span></div>';
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
    color:StyleConfig.C_333333,
  },
  comment_font1:{
    fontSize:14,
    color:StyleConfig.C_7B8992,
  },
  comment_name1:{
    fontSize:14,
    color:StyleConfig.C_333333,
  },
  name:{
    fontSize:14,
    color:StyleConfig.C_333333,
  },
  time:{
    fontSize:12,
    color:StyleConfig.C_D4D4D4,
  },
  more:{
    flexDirection:'row',
    position: 'absolute',
    right:4,
  },
  more_item:{
    padding:4,
  },
  line:{
    flex:1,
    height:1,
    marginTop:6,
    backgroundColor:StyleConfig.C_D4D4D4,
  }
});
export default CommentListItem;
