import{
      StyleSheet,
    } from 'react-native';
import {StyleConfig} from '../Config';

const ptyles = StyleSheet.create({
    nav_left:{
      fontSize:18,
      color:StyleConfig.C_FFFFFF,
      marginLeft:10,
    },
    nav_right:{
      fontSize:18,
      color:StyleConfig.C_FFFFFF,
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
      color:'#d4d4d4',
    },
    small_head:{
      height:40,
      width:40,
      // 设置图片填充模式
     resizeMode:'cover',
     // 设置圆角
     borderRadius:20,
   },
   big_head:{
     height:80,
     width:80,
     // 设置图片填充模式
    resizeMode:'cover',
    // 设置圆角
    borderRadius:40,
  },
  htmlview_bg:{
    padding:10,
  },
  htmlview:{

  },
  text_align_center:{
    textAlign:'center',
  }
});

export {ptyles as default};
