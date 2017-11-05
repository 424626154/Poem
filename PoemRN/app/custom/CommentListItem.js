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
      Utils,
      pstyles
    } from '../AppUtil';

class CommentListItem extends React.PureComponent {
    _onPress = () => {
        this.props.onPressItem(this.props.id);
        if(Utils.isLogin(this.props.navigate)){
            this.props.navigate('CommentUI',{id:this.props.comment.pid,cid:this.props.comment.id,cpseudonym:this.props.comment.pseudonym});
        }
    };

    render() {
        return(
            <TouchableOpacity
                {...this.props}
                onPress={this._onPress}
                >
                <View >
                    {this._loadComment(this.props.comment)}
                </View>
            </TouchableOpacity>
        );
    }
    _loadComment(comment){
      var comment_html = '';
      if(comment.cid > 0){
          comment_html =  '<div><span><comment_font0>'+comment.pseudonym+'</comment_font0></span>&nbsp;<span><comment_font1>回复</comment_font1></span>&nbsp;<span><comment_font0>'+comment.cpseudonym+'</comment_font0></span><span><comment_font1>&nbsp;:&nbsp;'+comment.comment+'</comment_font1></span></div>';
      }else{
          comment_html =  '<div><span><comment_font0>'+comment.pseudonym+'</comment_font0></span><span><comment_font1>&nbsp;:&nbsp;'+comment.comment+'</comment_font1></span></div>';
      }
      return(
        <View style={styles.comment}>
          <HTMLView
              style={{flex:1,margin:0,}}
              value={comment_html}
              stylesheet={styles}
              />
        </View>
      )
    }
}

const styles = StyleSheet.create({
  comment:{
    flexDirection:'row',
    padding:4,
  },
  comment_font0:{
    fontSize:16,
    color:'#000000',
  },
  comment_font1:{
    fontSize:18,
    color:'#d4d4d4',
  },
});
export default CommentListItem;
