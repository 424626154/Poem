'use strict'
/**
 *广告
 *@flow
 */
import React from 'react';
import {
      StyleSheet,
      Platform,
      Text,
      View,
      TouchableOpacity,
      Alert,
     } from 'react-native';
import Swiper from 'react-native-swiper';

import {
    StyleConfig,
    Global,
    } from '../AppUtil';

type Props = {
    banners:Array<Object>,
    onBannerItem:Function,
}

type State = {

}

export default class Banner extends React.Component<Props,State>{
  render(){
      if(this.props.banners.length > 0){
        return(
          <View style={styles.banner}>
            <Swiper
               height={40}
               loop={true}
               index={0}
               showsButtons={false}
               autoplay={true}
               autoplayTimeout={10}
               onIndexChanged={(index)=>{
                 // console.log(index)
               }}
               showsPagination={false}
               // dot={<View style={{backgroundColor:StyleConfig.C_E7E7E7, width: 8 ,height: 8 ,borderRadius: 4, marginLeft: 3, marginRight: 3}} />}
               // activeDot={<View style={{backgroundColor: StyleConfig.C_D4D4D4, width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3}} />}
               // paginationStyle={{position: 'absolute', bottom: 5,height: 13}}
               // autoplayDirection={false}
              >
              {this.props.banners.map((item, i) =>
                  this._renderSwiperItem(item, i)
                )}
            </Swiper>
          </View>
        )
      }else{
        return null;
      }
  }

  _renderSwiperItem(item, key) {
    // console.log('-----_renderSwiperItem')
    // console.log(key)
    // console.log(item)
   return (
     <TouchableOpacity
       style={styles.banner_item_bg}
     onPress={()=>{
       this.props.onBannerItem(item)
     }}
     key={'banner_'+key}>
     <View  style={styles.banner_item}>
       <Text
         style={styles.banner_item_title}
         numberOfLines={1}
         ellipsizeMode='tail'
         >
         {item.title}
       </Text>
       <View style={{height:6,}}></View>
       <Text
         style={styles.banner_item_content}
         numberOfLines={1}
         ellipsizeMode='tail'
         >
         {item.content}
       </Text>
     </View>
     </TouchableOpacity>
   );
 }
}

const styles = StyleSheet.create({
  banner:{
    height:70
  },
  banner_item_bg:{
    // paddingTo
    height:70,
    justifyContent:'center',
    alignItems:'center',
  },
  banner_item:{
    width:Global.width-10,
    height:62,
    paddingLeft:10,
    paddingRight:10,
    justifyContent:'center',
    alignItems:'flex-start',
    backgroundColor:StyleConfig.C_FFFFFF,
    borderRadius:5,
    borderWidth:1,
    borderColor:StyleConfig.C_D4D4D4,
  },
  banner_item_title:{
      fontSize:18,
      color:StyleConfig.C_000000,
  },
  banner_item_content:{
    fontSize:16,
    color:StyleConfig.C_D4D4D4,
  }
});
