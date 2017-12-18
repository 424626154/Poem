'use strict'
/**
 * 主页列表item
 * @flow
 */
import React from 'react';
import {
      StyleSheet,
      Text,
      View,
      TouchableOpacity,
      Image,
      Animated,
     } from 'react-native';
import { Icon } from 'react-native-elements';
import {
  StyleConfig,
  UIName,
  pstyles,
  PImage,
  Utils,
  Global,
  ImageConfig,
} from '../AppUtil';
const boundary = 0;
type Props = {
    onPressItem:Function,
    onLove:Function,
    onComment:Function,
    onPersonal:Function,
    id:number,
    extend:Object,
    item:Object,
    time:string,
    headurl:any,
};
type State = {
      loveani:Animated.Value,
}
class HomeListItem extends React.PureComponent<Props,State> {
    state = {
      loveani:new Animated.Value(1),
    }
    _onPress = () => {
        this.props.onPressItem(this.props.id);
    };
    _onLove(){
      if(this.props.item.mylove == 0){
        console.log('_onLoveAni')
        this._onLoveAni()
      }
      this.props.onLove(this.props.item);
    }
    render() {
        let item = this.props.item;
        let extend = this.props.extend;
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
                  style={pstyles.small_head}
                  source={this.props.headurl}
                  // borderRadius={5}
                  noborder={true}
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
              {this._renderPoem(item,extend)}
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
                      this._onLove();
                    }}>
                    <View style={styles.menu_item}>
                      {/* <Icon
                        name='thumb-up'
                        size={26}
                        type="MaterialIcons"
                        color={this._renderLoveColor()}
                        /> */}
                        <Animated.Image
                          source={this._renderLoveSource()}
                          style={[styles.love,
                            this._renderLoveStyle(),
                            {transform: [{scale: this.state.loveani}]}
                          ]}/>
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

    renderCommentnum(commentnum:number){
      return commentnum > 0 ? commentnum:'';
    }
    renderLivenum(lovenum:number){
      return lovenum > 0 ? lovenum:'';
    }
    _renderLoveColor(){
      return this.props.item.mylove > 0 ? StyleConfig.C_333333:StyleConfig.C_D4D4D4;
    }
    _renderLoveSource(){
      return this.props.item.mylove > 0 ?ImageConfig.favorite:ImageConfig.favorite_border;
    }
    _renderLoveStyle(){
      return {
        tintColor:this._renderLoveColor(),
      }
    }
    _renderAlign(extend){
      let align = 'center';
      if(extend){
        if(extend.align)align = extend.align
      }
      return align;
    }
    _renderPoem(item,extend){
      if(this._isPhoto(extend)){
        return(
          <View style={pstyles.poem}>
            <View style={pstyles.photo}>
            <PImage
              style={this._getStyle(extend)}
              source={Utils.getPhoto(extend.photo)}
              noborder={true}
              />
            </View>
              <Text style={[pstyles.poem_title,{fontFamily:Global.font}]}>
                {item.title}
              </Text>
              <Text
                style={[pstyles.poem_content,{fontFamily:Global.font,textAlign:this._renderAlign(extend)}]}
                numberOfLines={1}
                ellipsizeMode='tail'
              >
                {item.content}
              </Text>
          </View>
        )
      }else{
        return(
          <View style={pstyles.poem}>
            <Text style={[pstyles.poem_title,{fontFamily:Global.font}]}>
              {item.title}
            </Text>
            <Text
              style={[pstyles.poem_content,{fontFamily:Global.font,textAlign:this._renderAlign(extend)}]}
              numberOfLines={8}
              ellipsizeMode='tail'
            >
              {item.content}
            </Text>
          </View>
        )
      }
    }
    _onLoveAni(){
        this.state.loveani.setValue(0.6);
        Animated.spring(
          this.state.loveani,
          {
            toValue: 1,
            friction: 7,//摩擦力值  默认为7
            tension:40,//弹跳的速度值  默认为40
          }
        ).start()
    }
    _isPhoto(extend){
      let isphoto = false;
      if(extend&&extend.photo&&extend.pw&&extend.ph){
        isphoto = true;
      }
      return isphoto;
    }
    _getStyle(extend){
        // let style = {resizeMode:'cover',width:Global.width-boundary,height:Global.width-boundary};
        // if(extend.pw > extend.ph){
        //   let style1 = {width:Global.width-boundary,height:(Global.width-boundary)*extend.ph/extend.pw}
        //   style = Object.assign({},style,style1)
        // }
        // if(extend.pw < extend.ph){
        //   let style2 = {resizeMode:'cover'}
        //   style = Object.assign({},style,style2)
        // }
        let width = Global.width;
        let height = Global.width*9/16;
        let style = {resizeMode:'cover',width:width,height:height};
        return style;
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
  love:{
    width:26,
    height:26,
  }
});

export default HomeListItem;
