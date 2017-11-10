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
