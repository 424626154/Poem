'use strict'
/**
 * HomeUI
 * @flow
 */
import React, { Component } from 'react';
import {
        View ,
        Text,
        StyleSheet,
        WebView,
        TouchableOpacity,
        ActivityIndicator,
        Share,
      } from 'react-native';
import { Icon } from 'react-native-elements'
import {connect} from 'react-redux';
// import WebViewBridge from 'react-native-webview-bridge';
import {
        pstyles,
        HeaderConfig,
        StyleConfig,
        Global,
      } from '../AppUtil';
import {
        NavBack
      }from '../custom/Custom';
type Props = {
    navigation:any,
}
type State = {
    animating:boolean,
    canGoBack:boolean,
    canGoForward:boolean,
    url:string,
    curl:string,
    title:string,
    result:string,
}
class WebUI extends React.Component<Props,State> {
  static navigationOptions = ({navigation}) => ({
        title: navigation.state.params.nav_title,
        headerTintColor:HeaderConfig.headerTintColor,
        headerTitleStyle:HeaderConfig.headerTitleStyle,
        headerStyle:HeaderConfig.headerStyle,
        headerLeft:(<NavBack navigation={navigation}/>),
        headerRight:(<View style={pstyles.nav_right}/>),
     });
     _onNavigationStateChange:Function;
     _renderError:Function;
     _renderLoading:Function;
     _shareText:Function;
     _showResult:Function;
     constructor(props){
       super(props);
       let params = this.props.navigation.state.params;
       let url = params.url||'';
       let title = params.title||'WebUI';
       this.props.navigation.setParams({nav_title:title});
       this.state = {
          animating:true,
          canGoBack:false,
          canGoForward:false,
          url:url,
          curl:'',
          title:'',
          result:'',
        }
        this._renderError = this._renderError.bind(this);
        this._renderLoading = this._renderLoading.bind(this);
        this._onNavigationStateChange = this._onNavigationStateChange.bind(this);
        this._shareText = this._shareText.bind(this);
        this._showResult = this._showResult.bind(this);
     }
    render(){
      return(
        <View style={pstyles.container}>
          {/* {this._renderError()}
          {this._renderLoading()} */}
          <WebView
            ref='WebView'
            style={styles.webview}
            source={{uri:this.state.url}}
            onError={(err)=>{
              console.log(err);
            }}
            onLoad={() =>{
              console.log('onLoad')
              // console.log(this.refs.WebView)
            }}
            onLoadEnd={() =>{
              console.log('onLoadEnd')
              // console.log(this.refs.WebView)
              // console.log(this.refs.WebView.canGoBack)
            }}
            onLoadStart={() =>{
              console.log('onLoadStart')
              // console.log(this.refs.WebView)
            }}
            renderError={this._renderError}
            renderLoading={this._renderLoading}
            onNavigationStateChange={this._onNavigationStateChange}
          />
          {this._renderMenu()}
        </View>
      )
    }
    _onNavigationStateChange = (navState) => {
      console.log(navState);
      this.setState({
        canGoBack: navState.canGoBack,
        canGoForward: navState.canGoForward,
        curl: navState.url,
        title: navState.title,
        // loading: navState.loading,
        // scalesPageToFit: true
      });
    };
    _renderError(){
        return(
          <View style={styles.error}>
            <Text style={styles.error_tips}>网络加载失败</Text>
            <TouchableOpacity
              onPress={()=>{
                  this.refs.WebView.reload()
              }}
              >
              <Text style={styles.error_refresh}>刷新重试</Text>
            </TouchableOpacity>
          </View>
        )
    }
    _renderLoading(){
      return(
        <View style={styles.loading}>
          <ActivityIndicator
            animating={this.state.animating}
            style={styles.centering}
            color={StyleConfig.C_232323}
            size="large"
          />
        </View>
      )
    }
    _renderMenu(){
      return(
        <View style={styles.menu}>
          <TouchableOpacity
            onPress={()=>{
                this.refs.WebView.goBack()
            }}
            >
          <Icon
            name={'chevron-left'}
            type={'evilicon'}
            color={this.state.canGoBack?StyleConfig.C_232323:StyleConfig.C_D4D4D4}
            size={50}/>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={()=>{
                this.refs.WebView.goForward()
            }}
            >
          <Icon
            name={'chevron-right'}
            type={'evilicon'}
            color={this.state.canGoForward?StyleConfig.C_232323:StyleConfig.C_D4D4D4}
            size={50}/>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={()=>{
                console.log('---reload')
                  this.refs.WebView.reload()
              }}
              >
                <Icon
                  name={'redo'}
                  type={'evilicon'}
                  color={StyleConfig.C_232323}
                  size={50}/>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={()=>{
                // console.log('---reload')
                this._shareText();
              }}
              >
              <Icon
                name={'share-apple'}
                type={'evilicon'}
                color={StyleConfig.C_232323}
                size={50}/>
            </TouchableOpacity>
        </View>
      )
    }
    _shareText() {
      var title = '';
      var url = this.state.curl;
      var message = '';
       Share.share({
         // message: this.state.title,
         // url: this.state.curl,
         // title: 'React Native'
          message:message,
          url: url,
          title: title
       }, {
         dialogTitle: '推比特',
         excludedActivityTypes: [
           'com.apple.UIKit.activity.PostToTwitter'
         ],
         tintColor: 'green'
       })
       .then(this._showResult)
       .catch((error) => this.setState({result: 'error: ' + error.message}));
     }
     _showResult(result) {
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          this.setState({result: 'shared with an activityType: ' + result.activityType});
        } else {
          this.setState({result: 'shared'});
        }
      } else if (result.action === Share.dismissedAction) {
        this.setState({result: 'dismissed'});
      }
    }
}

const styles = StyleSheet.create({
    menu:{
      width:Global.width,
      height:55,
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'space-around',
      position:'absolute',
      bottom:0,
      backgroundColor:StyleConfig.C_FFFFFF,
      // borderTopColor:StyleConfig.C_9E9E9E,
      // borderTopWidth:1,
    },
    webview:{
      width:Global.width,
      height:Global.height-55,
    },
    centering:{
        width:80,
        height:80,
    },
    error:{
      flex:1,
      alignItems:'center',
      justifyContent:'center',
    },
    error_tips:{
      fontSize:22,
      color:StyleConfig.C_D4D4D4,
    },
    error_refresh:{
      marginTop:10,
      fontSize:20,
      padding:10,
      color:StyleConfig.C_FFFFFF,
      backgroundColor:StyleConfig.C_232323,
    },
    loading:{
      flex:1,
      alignItems:'center',
      justifyContent:'center',
    },
});

export default connect(
    state => ({

    }),
)(WebUI);
