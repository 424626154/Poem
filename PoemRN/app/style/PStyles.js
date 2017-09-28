import{
      StyleSheet,
    } from 'react-native';
import {StyleConfig} from '../Config';

const ptyles = StyleSheet.create({
    nav_left:{
      fontSize:18,
      color:'#ffffff',
      marginLeft:10,
    },
    nav_right:{
      fontSize:18,
      color:'#ffffff',
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
    }
});

export {ptyles as default};
