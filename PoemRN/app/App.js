import React, { Component } from 'react';
import {
  Platform,
  AsyncStorage,
  DeviceEventEmitter,
} from 'react-native';
// import { connect,Provider } from 'react-redux';
// import {addNavigationHelpers} from 'react-navigation';
import SplashScreen from 'react-native-splash-screen';
// import SQLite from './db/Sqlite';
// const sqlite = new SQLite();
import HttpUtil from './utils/HttpUtil';
import {StyleConfig,HeaderConfig,StorageConfig} from './Config';
import Global from './Global';

import {AppNavigator} from './AppNavigator';

const uriPrefix = Platform.OS == 'ios'?'poem://':'poem://poem/';

// import getStore from './redux/store/ConfigureStore';

// let store = configureStore();
// const navReducer = (state, action) => {
//     const newState = AppNavigator.router.getStateForAction(action, state);
//     return newState || state;
// };

// const mapStateToProps = (state) => ({
//     nav: state.nav
// });

// class AppRoot extends Component {
//     render() {
//         return (
//             <AppNavigator
//                 navigation={addNavigationHelpers({
//                     dispatch: this.props.dispatch,
//                     state: this.props.nav
//                 })}
//             />
//         );
//     }
// }

// const AppWithNavigationState = connect(mapStateToProps)(AppRoot);
// const store = getStore(navReducer);
/**
 * 程序入口
 */
export default class App extends Component {
  ishide = false;
  constructor(props){
    super(props);
  }
  componentDidMount() {
    // sqlite.initDB().then(()=>{
    // }).catch(err=>{
    //   console.error(err);
    // })
      // AsyncStorage.getItem(StorageConfig.USERID,(error,userid)=>{
      //   if(!error){
      //     if(userid){
      //       this._requestUserInfo(userid);
      //     }else{
      //       this._goHide();
      //     }
      //   }else{
      //     console.error(err);
      //   }
      // })
    // this.timer = setTimeout(
    //         () => {
    //             this._goHide();
    //         },
    //         3000
    //     );
    SplashScreen.hide();
  }
  componentWillUnmount(){
      // sqlite.close();
  }
  render() {
      return(
        // <Provider store={store}>
        //     <AppWithNavigationState/>
        // </Provider>
        <AppNavigator/>
        )
  }
  /**
   * 请求个人信息
   */
  _requestUserInfo(userid){
    Global.user.userid = userid;
    var json = JSON.stringify({
      userid:userid,
    })
    HttpUtil.post(HttpUtil.USER_INFO,json).then(res=>{
      if(res.code == 0){
        Global.user = res.data ;
        this._goHide();
      }else{
        Alert.alert(res.errmsg);
      }
    }).catch(err=>{
      console.error(err);
    })
  }

  _goHide(){
    if(!this.ishide){
      this.ishide = true;
      SplashScreen.hide();
    }
  }
}
