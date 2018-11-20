'use strict'
/**
 * 想法缩略图
 * @flow
 */
import React from 'react';
import {
   StyleSheet,
   View,
   Image,
   TouchableOpacity,
} from 'react-native';
import {
      StyleConfig,
      ImageConfig,
      Utils,
      pstyles,
      HttpUtil,
      Global,
    } from '../AppUtil';
const photow = (Global.width-50)/3;

type Props = {
  onShowPhotos:Function,
  photos:Array<Object>,
}
export default class DiscussPhotos extends React.Component<Props>{
  render(){
    const photos = this.props.photos;
    // console.log('------DiscussPhotos')
    // console.log(photos)
    if(photos&&photos.length > 0){
      if(photos.length == 1){
        return(
          <View
            style={styles.photo_itmes}
            >
            <TouchableOpacity
              onPress={()=>{
                this.props.onShowPhotos(0,photos);
              }}>
            <Image
              style={styles.thumbnail}
              source={{uri:photos[0].photourl}}
            />
          </TouchableOpacity>
          </View>
        )
      }else if(photos.length == 2){
        return(
          <View
            style={styles.photo_itmes}
            >
            <TouchableOpacity
              onPress={()=>{
                this.props.onShowPhotos(0,photos);
              }}>
              <Image
                style={styles.thumbnail}
                source={{uri:photos[0].photourl}}
              />
            </TouchableOpacity>
            <View style={styles.interval}/>
            <TouchableOpacity
              onPress={()=>{
                this.props.onShowPhotos(1,photos);
              }}>
              <Image
                style={styles.thumbnail}
                source={{uri:photos[1].photourl}}
              />
            </TouchableOpacity>
          </View>
        )
      }else{
        return(
          <View
            style={styles.photo_itmes}
            >
            <TouchableOpacity
              onPress={()=>{
                this.props.onShowPhotos(0,photos);
              }}>
              <Image
                style={styles.thumbnail}
                source={{uri:photos[0].photourl}}
              />
            </TouchableOpacity>
            <View style={styles.interval}/>
            <TouchableOpacity
              onPress={()=>{
                this.props.onShowPhotos(1,photos);
              }}>
              <Image
                style={styles.thumbnail}
                source={{uri:photos[1].photourl}}
              />
            </TouchableOpacity>
            <View style={styles.interval}/>
            <TouchableOpacity
              onPress={()=>{
                this.props.onShowPhotos(2,photos);
              }}>
              <View
                style={styles.more}>
                <Image
                  style={styles.more_photos}
                  source={ImageConfig.more_photos}
                />
              </View>
            </TouchableOpacity>
          </View>
        )
      }
    }else{
      return null;
    }
  }
}
const styles =StyleSheet.create({
  thumbnail:{
    width:photow,
    height:photow,
  },
  more:{
    width:photow,
    height:photow,
    alignItems:'center',
    justifyContent:'center',
    borderColor:StyleConfig.C_D4D4D4,
    borderWidth:1,
  },
  more_photos:{
    width:photow-60,
    height:photow-60,
    tintColor:StyleConfig.C_D4D4D4,
  },
  photo_itmes:{
    flexDirection:'row',
    paddingTop:10,
  },
  interval:{
    width:10,
  },
})
