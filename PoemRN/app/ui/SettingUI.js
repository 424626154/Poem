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
 });

 export {SettingUI};
