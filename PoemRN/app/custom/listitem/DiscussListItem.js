'use strict'
/**
 * 想法列表item
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
import Hyperlink from 'react-native-hyperlink';
import {
  StyleConfig,
  UIName,
  pstyles,
  PImage,
  Utils,
  Global,
  ImageConfig,
} from '../../AppUtil';
import DiscussPhotos from '../DiscussPhotos';
const boundary = 0;
type Props = {
    onPressItem:Function,
    onLove?:Function,
    onComment?:Function,
    onPersonal?:Function,
    onShowPhotos?:Function,
    id:number,
    item:Object,
    time:string,
    headurl:any,
    photos:Array<Object>,
    hiddenMenu?:boolean,//隐藏menu
    hiddenPerson?:boolean,//个人信息
};
type State = {
      loveani:Animated.Value,
}
class DiscussListItem extends React.PureComponent<Props,State> {
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
      if(this.props.onLove)this.props.onLove(this.props.item);
    }
    render() {
        let item = this.props.item;
        // console.log(item)
        return(
            <TouchableOpacity
                key={item.rid}
                // {...this.props}
                onPress={this._onPress}
            >
            <View style={styles.fitem}>
              {/* 个人信息 */}
              {this._renderPerson(item)}
              {/* 想法*/}
              {this._renderItem(item)}
              {/* menu */}
              {this._renderMenu(item)}
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
      return this.props.item.mylove > 0 ? StyleConfig.C_FF5555:StyleConfig.C_D4D4D4;
    }
    _renderLoveSource(){
      return this.props.item.mylove > 0 ?ImageConfig.favorite:ImageConfig.favorite_border;
    }
    _renderLoveStyle(){
      return {
        tintColor:this._renderLoveColor(),
      }
    }
    _renderPerson(item){
      if(!this.props.hiddenPerson){
        return(
          <View style={styles.fitem_header}>
            <TouchableOpacity
              style={{flexDirection:'row',alignItems:'center'}}
              onPress={()=>{
                if(this.props.onPersonal)this.props.onPersonal(item.userid);
              }}>
            <PImage
              style={pstyles.small_head}
              source={this.props.headurl}
              borderRadius={20}
              padding={0}
              noborder={true}
              />
            <View style={styles.fitem_header_info}>
              <Text style={styles.fitem_name}>
                {item.nickname}
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
          )
      }else{
        return null
      }
    }
    _renderItem(item){
      return(
        <View>
            <Text style={pstyles.discuss_title}>
              {item.title}
            </Text>
            <View style={pstyles.spacing}/>
            <Hyperlink
              linkStyle={pstyles.link}>
              <Text
                style={pstyles.discuss_content}
                numberOfLines={8}
                ellipsizeMode='tail'
              >
                {item.content}
              </Text>
            </Hyperlink>
            {this._renderPhotos()}
       </View>
      )
    }
    _renderMenu(item){
      if(!this.props.hiddenMenu){
        return(
          <View style={styles.menu}>
              <TouchableOpacity
                onPress={()=>{
                  if(this.props.onComment)this.props.onComment(item)
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
          )
      }else{
        return null
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
    _renderPhotos(){
      return(
        <DiscussPhotos
          photos={this.props.photos}
          onShowPhotos={this.props.onShowPhotos}
        />
      )
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
    height:50,
    padding:0,
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
  },
});

export default DiscussListItem;
