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
   Dimensions,
 } from 'react-native';
import {connect} from 'react-redux';
import * as UserActions from '../redux/actions/UserActions';

import DeviceInfo from 'react-native-device-info';

import {
  StyleConfig,
  HeaderConfig,
  Storage,
  UIName,
  HttpUtil,
  Emitter,
  pstyles,
  HomePoemDao,
  MessageDao,
  ChatDao,
  showToast,
} from '../AppUtil';

const {width, height} = Dimensions.get('window');
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
       let papp = this.props.papp;
       this.papp = papp;
       this.state={
          version:'版本信息',
          animating:false,
       }
       this._checkUpdate = this._checkUpdate.bind(this);
       this._onFeedback = this._onFeedback.bind(this);
       this._onClear = this._onClear.bind(this);
     }
     componentDidMount(){
        let type = ''
        if(AppConf.DNV = AppConf.DEBUG){
            type = 'Debug_';
        }else if(AppConf.DNV = AppConf.ALI){
            type = 'Bate_';
        }
        var version = '版本信息:'+type+DeviceInfo.getVersion()
        this.setState({
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
        {this._renderItem(this.state.version,this._checkUpdate,this.state.update,false)}
        {this._renderItem('意见反馈',this._onFeedback,false,true)}
        {this._renderItem('清空缓存',this._onClear,false,false)}
        <View style={styles.interval}></View>
        {this._renderLogout()}
        {this._renderLoading()}
       </View>
     );
   }
   _renderItem(title,func,rot,arrow){
     return(
       <TouchableOpacity onPress={()=>{
           func();
       }}>
       <View>
       <View style={styles.item}>
         <Text style={styles.item_title}>
           {title}
         </Text>
         {this._renderArrow(arrow)}
         {this._renderRot(rot)}
         </View>
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
   _renderArrow(arrow){
     if(arrow){
       return(
         <View style={styles.arrow}>
           <Icon
             name='navigate-next'
             size={28}
             type="MaterialIcons"
             color={StyleConfig.C_D4D4D4}
           />
         </View>
       )
     }else{
       return null;
     }
   }

   /**
    * 退出登录
    */
   _renderLogout(){
     if(this.papp.userid){
       return(
           <TouchableOpacity onPress={()=>{
             Alert.alert(
               '退出登录',
               '是否退出登录?',
               [
                 {text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                 {text: '确定', onPress: () =>{
                    this._requestLogout();
                 }},
               ]
             )
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
     console.log('------_checkUpdate')
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
     Alert.alert(
           '清除缓存',
           '是否清除缓存数据？',
           [
             {text: '取消', onPress: () =>{}},
             {text: '确定', onPress: () =>{
               this.setState({
                 animating:true,
               });
               HomePoemDao.deleteAll();
               MessageDao.deleteAll();
               ChatDao.deleteAllChat();
               ChatDao.deleteAllChatList();
               this.setState({
                 animating:false,
               });
               showToast('清除缓存完成');
             }},
           ]
         )
   }
   _requestLogout(){
     this.setState({animating:true});
     if(!this.papp.userid){
        this.props.navigation.goBack();
        this.setState({animating:false});
        return;
     }
     var json = JSON.stringify({
       userid:this.papp.userid,
     })
     HttpUtil.post(HttpUtil.USER_LOGOUT,json).then(res=>{
       if(res.code == 0){
         let { dispatch } = this.props.navigation;
         dispatch(UserActions.raLogout());
         Storage.saveUserid('');
         this.props.navigation.goBack();
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
     backgroundColor: '#ebebeb',
   },
   interval:{
     height:10,
   },
   label:{
     alignItems:'center',
     height:40,
     backgroundColor:StyleConfig.C_FFFFFF,
     // borderTopWidth:1,
     // borderTopColor:'#d4d4d4',
     // borderBottomWidth:1,
     // borderBottomColor:'#d4d4d4',
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
     width:width,
     height:height,
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
    right:20,
    height:12,
    width:12,
  },
  item:{
    // flex:1,
    flexDirection:'row',
    alignItems:'center',
    height:40,
    backgroundColor:StyleConfig.C_FFFFFF,
    // borderTopWidth:1,
    // borderTopColor:'#d4d4d4',
    // borderBottomWidth:1,
    // borderBottomColor:'#d4d4d4',
    marginTop:10,
    paddingLeft:10,
  },
  arrow:{
    position: 'absolute',
    right:10,
  }
 });
 export default connect(
     state => ({
         papp: state.papp,
     }),
 )(SettingUI);
