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
 } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {StyleConfig,HeaderConfig,StorageConfig} from '../Config';
import HttpUtil from '../utils/HttpUtil';
import Emitter from '../utils/Emitter';
import Global from '../Global';
import pstyles from '../style/PStyles';

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
        })
     }
     componentWillUnMount(){

     }
   render() {
     const { state,navigate,goBack } = this.props.navigation;
     return (
       <View style={styles.container}>
        <View style={styles.interval}></View>
        {this._renderVersion()}
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

       }}>
         <View style={styles.label}>
             <Text style={styles.version}>{this.state.version}</Text>
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
     fontSize:22,
     color:StyleConfig.C_7B8992,
   },
   logout:{
     marginTop:10,
     fontSize:22,
     color:'#ff4040',
   },
 });

 export {SettingUI};
