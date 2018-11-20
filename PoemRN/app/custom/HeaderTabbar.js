'use strict'
/**
 * TabBarIcon
 * @flow
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import {
    pstyles,
    StyleConfig,
  } from '../AppUtil';
import NavMore from './NavMore';
type Props = {
    title:string,
    navigation:any,
    navMore:any
};
export default class HeaderTabbar extends React.Component<Props>{
  componentDidMount(){
    // console.log('---HeaderTabbar')
    // console.log(this.props.navMore)
  }
  render(){
    return(
      <View style={styles.header} >
        <View></View>
        <View>
          <Text style={styles.title}>{this.props.title}</Text>
        </View>
        <View style={styles.nav_move}>
          {this._renderMore()}
        </View>
      </View>
    )
  }
  _renderMore(){
    if(this.props.navMore){
      return (
        this.props.navMore
      )
    }else{
      return null
    }
  }
}

const styles = StyleSheet.create({
    header:{
      ...Platform.select({
        ios: {
          height: 60,
          paddingTop:20,
        },
        android: {
          height: 40,
        },
      }),
      backgroundColor:StyleConfig.C_FFFFFF,
      borderBottomWidth:1,
      borderBottomColor:StyleConfig.C_BFBFBF,
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'center'
    },
    title:{
      fontSize:StyleConfig.F_18,
      fontWeight:'bold',
    },
    nav_move:{
      justifyContent:'flex-end',
    }
})
