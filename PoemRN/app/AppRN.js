import React, { Component } from 'react';
import {
  Platform,
  AsyncStorage,
  DeviceEventEmitter,
} from 'react-native';

import SplashScreen from 'react-native-splash-screen';
import SQLite from './db/Sqlite';
const sqlite = new SQLite();
import HttpUtil from './utils/HttpUtil';
import {StyleConfig,HeaderConfig,StorageConfig} from './Config';
import Global from './Global';

import {App} from './App';

/**
 * 程序入口
 */
export default class AppRN extends Component {
  ishide = false;
  componentDidMount() {
    sqlite.initDB().then(()=>{
      AsyncStorage.getItem(StorageConfig.USERID,(error,userid)=>{
        if(!error){
          if(userid){
            this._requestUserInfo(userid);
          }else{
            this._goHide();
          }
        }else{
          console.error(err);
        }
      })
    }).catch(err=>{
      console.error(err);
    })
    this.timer = setTimeout(
            () => {
                this._goHide();
            },
            3000
        );
    // SplashScreen.hide();
  }
  componentWillUnMount(){
      sqlite.close();
  }
  render() {
        if(Platform.OS == 'ios'){
            return(<App uriPrefix={'poem://'}/>);
        }else if(Platform.OS == 'android'){
            return(<App uriPrefix={'poem://poem/'}/>);
        }else{
            return(<View></View>);
        }
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
