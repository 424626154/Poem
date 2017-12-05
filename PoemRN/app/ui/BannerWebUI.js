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
      WebView,
      TouchableOpacity,
      Alert,
     } from 'react-native';
import {connect} from 'react-redux';
import {
   pstyles,
   HeaderConfig,
   StyleConfig,
   Global,
   showToast,
   } from '../AppUtil';
import{
     NavBack,
     }from '../custom/Custom';
type Props = {
    navigation:any,
}

type State = {
    url:string,
}

class BannerWebUI extends React.Component<Props,State>{
   static navigationOptions = ({navigation}) => ({
         title: navigation.state.params.nav_title,
         headerTintColor:HeaderConfig.headerTintColor,
         headerTitleStyle:HeaderConfig.headerTitleStyle,
         headerStyle:HeaderConfig.headerStyle,
         headerLeft:(<NavBack navigation={navigation}/>),
      });
    constructor(props) {
        super(props);
        let params = this.props.navigation.state.params;
        let banner = params.banner;
        let nav_title = 'banner';
        let url = '';
        if(banner){
          nav_title = banner.title;
          url = banner.url;
        }
        this.props.navigation.setParams({nav_title:nav_title});
        this.state = {
          url:url,
        }
    }
    render(){
      return(
        <View style={pstyles.container}>
          <WebView
          source={{uri: this.state.url}}
          onError={()=>{
            showToast('加载失败...')
          }}/>
        </View>
      )
    }
 }

 const styles = StyleSheet.create({

 });
 export default connect(
     state => ({
         papp: state.papp,
     }),
 )(BannerWebUI);
