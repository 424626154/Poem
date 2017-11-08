'use strict'
/**
 * 主页列表item
 */
import React from 'react';
import {
      StyleSheet,
      Text,
      View,
      TouchableOpacity,
     } from 'react-native';
import { Icon } from 'react-native-elements';
import {UIName,pstyles,PImage} from '../AppUtil';
class HomeListItem extends React.PureComponent {
    _onPress = () => {
        this.props.onPressItem(this.props.id);
    };
    render() {
        return(
            <TouchableOpacity
                {...this.props}
                onPress={this._onPress}
            >
            <View style={styles.fitem}>
              {/* 个人信息 */}
              <TouchableOpacity
                onPress={()=>{
                  this.props.onPersonal(this.props.item.userid);
                }}>
              <View style={styles.fitem_header}>
                <PImage
                  style={pstyles.small_head}
                  source={this.props.headurl}
                  />
                <View style={styles.fitem_header_info}>
                  <Text style={styles.fitem_name}>
                    {this.props.pseudonym}
                  </Text>
                  <Text style={styles.fitem_time}>
                    {this.props.time}
                  </Text>
                </View>
              </View>
              </TouchableOpacity>
              {/* 诗歌 */}
              <View style={pstyles.poem}>
                <Text style={pstyles.poem_title}>{this.props.title}</Text>
                <Text
                  style={pstyles.poem_content}
                  numberOfLines={8}
                  ellipsizeMode='tail'
                >
                  {this.props.content}
                </Text>
              </View>
              {/* menu */}
              <View style={styles.menu}>
                  <TouchableOpacity
                    onPress={()=>{
                      this.props.onComment(this.props.item)
                    }}>
                    <View style={styles.menu_item}>
                      <Icon
                        name='sms'
                        size={30}
                        type="MaterialIcons"
                        color={'#7b8992'}
                        />
                        <Text style={styles.menu_font}>
                          {this.renderCommentnum(this.props.commentnum)}
                        </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={()=>{
                      this.props.onLove(this.props.item);
                    }}>
                    <View style={styles.menu_item}>
                      <Icon
                        name='thumb-up'
                        size={30}
                        type="MaterialIcons"
                        color={this._renderLoveColor()}
                        />
                        <Text style={styles.menu_font}>
                          {this.renderLivenum(this.props.lovenum)}
                        </Text>
                    </View>
                  </TouchableOpacity>
              </View>
            </View>
            </TouchableOpacity>
        );
    }

    renderCommentnum(commentnum){
      return commentnum > 0 ? commentnum:'';
    }
    renderLivenum(lovenum){
      return lovenum > 0 ? lovenum:'';
    }
    _renderLoveColor(){
      return this.props.item.mylove > 0 ? '#1e8ae8':'#7b8992';
    }
}
const styles = StyleSheet.create({
  fitem:{
      flex:1,
      padding:10,
  },
  fitem_header:{
    flex:1,
    flexDirection:'row',
  },
  fitem_header_info:{
    paddingLeft:4,
  },
  fitem_name:{
    fontSize:20,
    color:'#000000'
  },
  fitem_time:{
    fontSize:14,
    color:'#d4d4d4',
    marginTop:4,
  },
  menu:{
    paddingLeft:60,
    flexDirection:'row',
  },
  menu_item:{
    flexDirection:'row',
    padding:10,
  },
  menu_font:{
    fontSize:18,
    color:'#7b8992',
    marginLeft:4,
  },
});

export default HomeListItem;
