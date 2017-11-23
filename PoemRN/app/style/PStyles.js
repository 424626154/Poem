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
   small1_head:{
     height:30,
     width:30,
     // 设置图片填充模式
    resizeMode:'cover',
    // 设置圆角
    borderRadius:15,
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
  },
  poem:{//作品样式

  },
  poem_title:{
    fontSize:24,
    textAlign:'center',
    fontWeight:'bold',
  },
  poem_content:{
    fontSize:18,
    textAlign:'center',
    padding:10,
  },
});

export {ptyles as default};
