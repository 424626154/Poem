/**
 * 设置
 */
 // 登录
 import React from 'react';
 import { Button,Icon } from 'react-native-elements';
 import {
   StyleSheet,
   Text,
   View ,
   Alert,
   TouchableOpacity,
   TextInput,
   AsyncStorage,
   DeviceEventEmitter,
   Platform,
 } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import {
  isFirstTime,
  isRolledBack,
  packageVersion,
  currentVersion,
  checkUpdate,
  downloadUpdate,
  switchVersion,
  switchVersionLater,
  markSuccess,
} from 'react-native-update';

import _updateConfig from '../../update.json';
const {appKey} = _updateConfig[Platform.OS];


import {
  StyleConfig,
  HeaderConfig,
  StorageConfig,
  UIName,
  HttpUtil,
  Emitter,
  Global,
  pstyles,
  HomePoemDao,
  MessageDao,
} from '../AppUtil';

 class SettingUI extends React.Component {
   static navigationOptions = ({navigation}) => ({
         title:'设置',
         headerTintColor:StyleConfig.C_FFFFFF,
         headerTitleStyle:HeaderConfig.headerTitleStyle,
         headerStyle:HeaderConfig.headerStyle,
         headerLeft:(
           <TouchableOpacity  onPress={()=>navigation.goBack()}>
             <Text style={pstyles.nav_left}>返回</Text>
           </TouchableOpacity>
         ),
      });
     constructor(props){
       super(props);
       this.state={
          userid:'',
          version:'版本信息'
       }
     }
     componentDidMount(){
        let user = Global.user;
        var version = '版本信息:'+'Bate_'+DeviceInfo.getVersion()
        this.setState({
          userid:user.userid,
          version:version,
        });
     }
     componentWillUnmount(){

     }
   render() {
     const { state,navigate,goBack } = this.props.navigation;
     return (
       <View style={styles.container}>
        <View style={styles.interval}></View>
        {this._renderVersion()}
        <View style={styles.interval}></View>
        {this._renderFeedback()}
        <View style={styles.interval}></View>
        {this._renderClear()}
        <View style={styles.interval}></View>
        {this._renderLogout()}
       </View>
     );
   }
   /**
    * 版本
    */
   _renderVersion(){
     return(
       <TouchableOpacity onPress={()=>{
            this._checkUpdate();
       }}>
         <View style={styles.label}>
             <Text style={styles.version}>{this.state.version}</Text>
         </View>
       </TouchableOpacity>
     )
   }
   _renderFeedback(){
     return(
       <TouchableOpacity onPress={()=>{
         this._onFeedback();
       }}>
         <View style={styles.label}>
             <Text style={styles.version}>意见反馈</Text>
         </View>
       </TouchableOpacity>
     )
   }
   _renderClear(){
     return(
       <TouchableOpacity onPress={()=>{
         this._onClear();
       }}>
         <View style={styles.label}>
             <Text style={styles.version}>清空缓存</Text>
         </View>
       </TouchableOpacity>
     )
   }
   /**
    * 退出登录
    */
   _renderLogout(){
     if(this.state.userid){
       return(
           <TouchableOpacity onPress={()=>{
             AsyncStorage.setItem(StorageConfig.USERID,'',(error,result)=>{
               if (!error) {
                 Global.user.userid = result;
                 Emitter.emit(Emitter.LOGOUT,'');
                 this.setState({
                   userid:'',
                 })
                 this.props.navigation.goBack();
               }
             });
           }}>
             <View style={styles.label}>
                 <Text style={styles.logout}>退出登录</Text>
             </View>
           </TouchableOpacity>
       )
     }
   }
   _checkUpdate(){
     checkUpdate(appKey).then(info => {
       console.log('---checkUpdate---')
       console.log(info)
      if (info.expired) {
        Alert.alert('提示', '您的应用版本已更新,请前往应用商店下载新的版本', [
          {text: '确定', onPress: ()=>{info.downloadUrl && Linking.openURL(info.downloadUrl)}},
        ]);
      } else if (info.upToDate) {
        Alert.alert('提示', '您的应用版本已是最新.');
      } else {
        Alert.alert('提示', '检查到新的版本'+info.name+',是否下载?\n'+ info.description, [
          {text: '是', onPress: ()=>{this.doUpdate(info)}},
          {text: '否',},
        ]);
      }
    }).catch(err => {
      Alert.alert('提示', '更新失败.');
    });
   }
   doUpdate = info => {
    downloadUpdate(info).then(hash => {
      Alert.alert('提示', '下载完毕,是否重启应用?', [
        {text: '是', onPress: ()=>{switchVersion(hash);}},
        {text: '否',},
        {text: '下次启动时', onPress: ()=>{switchVersionLater(hash);}},
      ]);
    }).catch(err => {
      Alert.alert('提示', '更新失败.');
    });
  };
   _onFeedback(){
     this.props.navigation.navigate(UIName.FeedbackUI);
   }
   /**
    * 清空缓存
    */
   _onClear(){
     HomePoemDao.deleteAll();
     MessageDao.deleteAll();
     Emitter.emit(Emitter.CLEAR,'');
     Alert.alert(
           '清除缓存',
           '操作完成',
           [
             {text: '确定', onPress: () =>{}},
           ]
         )
   }

 }

 const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#ffffff',
   },
   interval:{
     height:10,
   },
   label:{
     alignItems:'center',
     height:40,
     borderTopWidth:1,
     borderTopColor:'#d4d4d4',
     borderBottomWidth:1,
     borderBottomColor:'#d4d4d4',
   },
   version:{
     marginTop:10,
     fontSize:18,
     color:StyleConfig.C_7B8992,
   },
   logout:{
     marginTop:10,
     fontSize:18,
     color:'#ff4040',
   },
 });

 export {SettingUI};
