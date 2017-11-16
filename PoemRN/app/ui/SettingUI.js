/**
 * 设置
 */
 import React from 'react';
 import { Button,Icon } from 'react-native-elements';
 import {
   StyleSheet,
   Text,
   View ,
   Alert,
   TouchableOpacity,
   TextInput,
   DeviceEventEmitter,
   Platform,
   ActivityIndicator,
   Linking,
 } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import {
  StyleConfig,
  HeaderConfig,
  Storage,
  UIName,
  HttpUtil,
  Emitter,
  Global,
  pstyles,
  HomePoemDao,
  MessageDao,
  ChatDao,
} from '../AppUtil';

import FirIm from '../utils/FirIm';

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
          version:'版本信息',
          animating:false,
       }
     }
     componentDidMount(){
        let user = Global.user;
        let type = ''
        if(AppConf.DNV = AppConf.DEBUG){
            type = 'Debug_';
        }else if(AppConf.DNV = AppConf.ALI){
            type = 'Bate_';
        }
        var version = '版本信息:'+type+DeviceInfo.getVersion()
        this.setState({
          userid:user.userid,
          version:version,
          update:false,
        });
        FirIm.queryVersion().then((ver)=>{
          if(ver.versionShort != DeviceInfo.getVersion()
          || ver.build != DeviceInfo.getBuildNumber()){
            this.setState({update:true});
          }else{
            this.setState({update:false});
          }
          // console.log(ver.versionShort)
          // console.log(ver.build );
          // console.log(DeviceInfo.getVersion());
          // console.log(DeviceInfo.getBuildNumber());
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
        {this._renderLoading()}
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
             {this._renderRot(this.state.update)}
         </View>
       </TouchableOpacity>
     )
   }
   _renderRot(rot){
       if(rot){
         return(
           <View style={styles.dot}>
             <Icon
               name="brightness-1"
               size={6}
               type="MaterialIcons"
               color={"#ff4040"}
             />
           </View>
         )
       }else{
         return null;
       }
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
             this._requestLogout();
           }}>
             <View style={styles.label}>
                 <Text style={styles.logout}>退出登录</Text>
             </View>
           </TouchableOpacity>
       )
     }
   }

   _renderLoading(){
     if(this.state.animating){
       return(
         <View style={styles.loading}>
           <ActivityIndicator
            animating={this.state.animating}
            style={styles.centering}
            color="white"
            size="large"/>
         </View>
       )
     }else{
       return null;
     }
   }
   _checkUpdate(){
     if(Platform.OS == 'ios'&&//appstore 关闭版本更新
       AppConf.IOS_CHANNEL == AppConf.APPSTORE){
         return;
       }
     if(Platform.OS == 'android'&&//应用宝 关闭版本更新
       AppConf.ANDROID_CHANNEL == AppConf.YIYONGBAO){
         return;
       }
     FirIm.queryVersion().then(ver=>{
       if(ver.versionShort != DeviceInfo.getVersion()
       || ver.build != DeviceInfo.getBuildNumber()){
         this.setState({update:true});
         let fsize = ver.binary.fsize;
         let size = Math.floor((fsize/(1024*1024))*100)/100;
         console.log(size)
         let alertMsg = '检测到有新版本,是否升级？\n'+
         '更新日志:\n'+
         ver.changelog+'\n'+
         '版本号:'+ver.versionShort+'\n'+
         '包大小:'+size+'M';
         Alert.alert(
         '版本检测',
         alertMsg,
         [
           {text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
           {text: '升级', onPress: () => {
             Linking.openURL(ver.update_url).catch(err => console.error('An error occurred', err));
           }},
         ]
        );
       }else{
         this.setState({update:false});
         Alert.alert('当前已是最新版本');
       }
     })
  };
   _onFeedback(){
     this.props.navigation.navigate(UIName.FeedbackUI);
   }
   /**
    * 清空缓存
    */
   _onClear(){
     this.setState({
       animating:true,
     });
     HomePoemDao.deleteAll();
     MessageDao.deleteAll();
     ChatDao.deleteAllChat();
     ChatDao.deleteAllChatList();
     Emitter.emit(Emitter.CLEAR,'');
     this.setState({
       animating:false,
     });
     Alert.alert(
           '清除缓存',
           '操作完成',
           [
             {text: '确定', onPress: () =>{}},
           ]
         )
   }
   _requestLogout(){
     this.setState({animating:true});
     if(!Global.user.userid){
        this.props.navigation.goBack();
        this.setState({animating:false});
        return;
     }
     var json = JSON.stringify({
       userid:Global.user.userid,
     })
     HttpUtil.post(HttpUtil.USER_LOGOUT,json).then(res=>{
       if(res.code == 0){
         Global.user.userid = '';
         this.setState({
           userid:'',
         });
         console.log(Storage)
         Storage.saveUserid('');
         this.props.navigation.goBack();
         Emitter.emit(Emitter.LOGOUT,'');
       }else{
         Alert.alert(res.errmsg);
       }
       this.setState({animating:false});
     }).catch(err=>{
       this.setState({animating:false});
       console.error(err);
     })
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
   loading:{
     backgroundColor:'#00000055',
     position: 'absolute',
     flex:1,
     width:Global.width,
     height:Global.height,
     alignItems:'center',
     justifyContent: 'center',
   },
   centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  dot:{
    position: 'absolute',
    top: 20,
    right:80,
    height:12,
    width:12,
  }
 });

 export {SettingUI};
