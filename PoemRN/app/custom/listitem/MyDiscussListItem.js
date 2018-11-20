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
    onShowPhotos:Function,
    id:number,
    item:Object,
    time:string,
    headurl:any,
    photos:Array<Object>,
};
type State = {
      loveani:Animated.Value,
}
class MyDiscussListItem extends React.PureComponent<Props,State> {
    state = {
      loveani:new Animated.Value(1),
    }
    _onPress = () => {
        this.props.onPressItem(this.props.id);
    };
    render() {
        let item = this.props.item;
        console.log(item)
        return(
            <TouchableOpacity
                key={item.rid}
                // {...this.props}
                onPress={this._onPress}
            >
            <View style={styles.fitem}>
              {/* 配方*/}
              {this._renderItem(item)}
              {/* menu */}
              <View style={styles.menu}>
                  <View style={[styles.menu_item,{height:26}]}>

                  </View>
                  <Text style={styles.fitem_time}>
                    {this.props.time}
                  </Text>
              </View>
            </View>
            </TouchableOpacity>
        );
    }

    _renderItem(item){
      return(
        <View style={pstyles.discuss}>
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

export default MyDiscussListItem;
