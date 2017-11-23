import React, { Component } from 'react';
// import {
  // NetInfo,
  // BackHandler,
  // Platform,
// } from 'react-native';
import {Provider } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import AppRoot from './AppRoot';
import store from './redux/store/ConfigureStore';

/**
 * 程序入口
 */
export default class App extends Component {
  constructor(props){
    super(props);
  }
  componentDidMount() {
    // //检测网络是否连接
    // NetInfo.isConnected.fetch().done((isConnected)=>{
    //   console.log('---检测网络是否连接---');
    //     console.log(isConnected);
    // });
    // //    检测网络连接信息
    // NetInfo.fetch().done((connectionInfo)=>{
    //     console.log('---检测网络连接信息---');
    //     console.log(connectionInfo);
    // });
    // //监听网络状态改变
    // NetInfo.addEventListener('change', this.handleConnectivityChange);
    SplashScreen.hide();
  }
  componentWillUnmount(){
    // NetInfo.removeEventListener('change', this.handleConnectivityChange);
  }
  render() {
      return(
        <Provider store={store}>
            <AppRoot/>
        </Provider>
        )
  }
}
