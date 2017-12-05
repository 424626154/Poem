'use strict'
/**
 * 全局style
 * @flow
 */
import{
      StyleSheet,
      Dimensions,
    } from 'react-native';
import {StyleConfig} from '../Config';
const {width, height} = Dimensions.get('window');

const ptyles = StyleSheet.create({
    nav_left:{
      // fontSize:18,
      // color:StyleConfig.C_000000,
      alignItems:'flex-start',
      marginLeft:10,
      width:40,
    },
    nav_right:{
      fontSize:18,
      color:StyleConfig.C_000000,
      marginRight:10,
    },
    // 公共背景
    container: {
      flex: 1,
      backgroundColor: StyleConfig.C_FFFFFF,
    },
    //空白布局
    empty:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    empty_font:{
      marginTop:160,
      fontSize:18,
      color:StyleConfig.C_D4D4D4,
    },
    middle_head:{
      height:40,
      width:40,
      // 设置图片填充模式
     resizeMode:'cover',
     // 设置圆角
     borderRadius:5,
   },
   small_head:{
     height:30,
     width:30,
     // 设置图片填充模式
    resizeMode:'cover',
    // 设置圆角
    borderRadius:5,
  },
   big_head:{
     height:80,
     width:80,
     // 设置图片填充模式
    resizeMode:'cover',
    // 设置圆角
    borderRadius:10,
  },
  htmlview_bg:{
    padding:10,
  },
  htmlview:{

  },
  text_align_center:{
    textAlign:'center',
  },
  poem:{//作品样式
    padding:10,
    // elevation: 20,
    // shadowOffset: {width: 0, height: 0},
    // shadowColor: 'black',
    // shadowOpacity: 1,
    // shadowRadius: 5
  },
  poem_title:{
    fontSize:24,
    textAlign:'center',
    // fontWeight:'bold',
  },
  poem_content:{
    fontSize:18,
    textAlign:'center',
    padding:10,
  },
  line:{
    height:1,
    backgroundColor:StyleConfig.C_D4D4D4,
  },
  loading:{
    backgroundColor:'#00000055',
    position: 'absolute',
    flex:1,
    width:width,
    height:height,
    alignItems:'center',
    justifyContent: 'center',
  },
  centering: {
   alignItems: 'center',
   justifyContent: 'center',
   padding: 8,
 },
  flatlist:{
    backgroundColor:StyleConfig.C_E7E7E7,
  },
  separator:{
    height:1,
    backgroundColor:StyleConfig.C_D4D4D4,
  },
  separator_not:{
    height:1,
  },
  separator_transparent:{
    height:6,
    backgroundColor:'transparent'
  },
  photo:{
    padding:10,
    alignItems:'center',
    justifyContent:'center',
  }
});

export {ptyles as default};
