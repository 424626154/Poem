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
import {StyleConfig,UIName,pstyles,PImage} from '../AppUtil';
class HomeListItem extends React.PureComponent {
    _onPress = () => {
        this.props.onPressItem(this.props.id);
    };
    render() {
      let item = this.props.item;
        return(
            <TouchableOpacity
                key={item.rid}
                // {...this.props}
                onPress={this._onPress}
            >
            <View style={styles.fitem}>
              {/* 个人信息 */}
              <View style={styles.fitem_header}>
                <TouchableOpacity
                  style={{flexDirection:'row',alignItems:'center'}}
                  onPress={()=>{
                    this.props.onPersonal(item.userid);
                  }}>
                <PImage
                  style={styles.small_head}
                  source={this.props.headurl}
                  />
                <View style={styles.fitem_header_info}>
                  <Text style={styles.fitem_name}>
                    {item.pseudonym}
                  </Text>
                </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.more}
                  onPress={this._onPress}>
                  <Icon
                    name='more-horiz'
                    size={26}
                    type="MaterialIcons"
                    color={StyleConfig.C_D4D4D4}
                    />
                </TouchableOpacity>
              </View>
              {/* 诗歌 */}
              <View style={pstyles.poem}>
                <Text style={pstyles.poem_title}>
                  {item.title}
                </Text>
                <Text
                  style={pstyles.poem_content}
                  numberOfLines={8}
                  ellipsizeMode='tail'
                >
                  {item.content}
                </Text>
              </View>
              {/* menu */}
              <View style={styles.menu}>
                  <TouchableOpacity
                    onPress={()=>{
                      this.props.onComment(item)
                    }}>
                    <View style={styles.menu_item}>
                      <Icon
                        name='sms'
                        size={26}
                        type="MaterialIcons"
                        color={StyleConfig.C_D4D4D4}
                        />
                        <Text style={styles.menu_font}>
                          {this.renderCommentnum(item.commentnum)}
                        </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={()=>{
                      this.props.onLove(item);
                    }}>
                    <View style={styles.menu_item}>
                      <Icon
                        name='thumb-up'
                        size={26}
                        type="MaterialIcons"
                        color={this._renderLoveColor()}
                        />
                        <Text style={styles.menu_font}>
                          {this.renderLivenum(item.lovenum)}
                        </Text>
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.fitem_time}>
                    {this.props.time}
                  </Text>
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
      return this.props.item.mylove > 0 ? StyleConfig.C_1E8AE8:StyleConfig.C_D4D4D4;
    }
}
const styles = StyleSheet.create({
  fitem:{
      flex:1,
      padding:10,
      backgroundColor:StyleConfig.C_FFFFFF,
  },
  fitem_header:{
    flex:1,
    flexDirection:'row',
  },
  small_head:{
    height:30,
    width:30,
    // 设置图片填充模式
   resizeMode:'cover',
   // 设置圆角
   borderRadius:15,
 },
  fitem_header_info:{
    paddingLeft:4,
  },
  fitem_name:{
    marginLeft:6,
    fontSize:16,
    color:StyleConfig.C_D4D4D4,
  },
  fitem_time:{
    fontSize:14,
    color:'#d4d4d4',
    position: 'absolute',
    right:0,
    bottom:10,
  },
  more:{
    position: 'absolute',
    right:0,
  },
  menu:{
    // paddingLeft:60,
    flexDirection:'row',
    justifyContent:'flex-start',
  },
  menu_item:{
    flexDirection:'row',
    padding:10,
  },
  menu_font:{
    fontSize:18,
    color:StyleConfig.C_D4D4D4,
    marginLeft:4,
  },
});

export default HomeListItem;
