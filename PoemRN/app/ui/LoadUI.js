// import React from 'react';
// import { Icon } from 'react-native-elements';
// import {
//       StyleSheet,
//       Text,
//       View,
//       FlatList,
//       TouchableOpacity,
//       Alert,
//       AsyncStorage,
//       DeviceEventEmitter,
//      } from 'react-native';
//
// import Utils from '../utils/Utils';
// import HttpUtil from '../utils/HttpUtil';
// import Emitter from '../utils/Emitter';
// import Global from '../Global';
// import pstyles from '../style/PStyles';
// import {StyleConfig,HeaderConfig,StorageConfig} from '../Config';
// import SQLite from '../db/Sqlite';
// const sqlite = new SQLite();
//
// import { App } from '../App.js';
//
// class LoadUI extends React.Component {
//     constructor(props){
//       super(props);
//     }
//     componentDidMount(){
//       sqlite.initDB().then(()=>{
//         AsyncStorage.getItem(StorageConfig.USERID,(error,userid)=>{
//           if(!error){
//             if(userid){
//               this._requestUserInfo(userid);
//             }else{
//               this._goMain();
//             }
//           }else{
//             console.error(err);
//           }
//         })
//       }).catch(err=>{
//         console.error(err);
//       })
//     }
//     componentWillUnmount(){
//       sqlite.close()
//     }
//     render(){
//       return(
//         <View style={styles.container}>
//           <Text style={styles.font01}>
//             Poem
//           </Text >
//           <Text style={styles.font02}>
//             每一段文字都有它背后的故事!
//           </Text>
//         </View>
//       )
//     }
//     /**
//      * 请求个人信息
//      */
//     _requestUserInfo(userid){
//       Global.user.userid = userid;
//       var json = JSON.stringify({
//         userid:userid,
//       })
//       HttpUtil.post(HttpUtil.USER_INFO,json).then(res=>{
//         if(res.code == 0){
//           Global.user = res.data ;
//           this._goMain();
//         }else{
//           Alert.alert(res.errmsg);
//         }
//       }).catch(err=>{
//         console.error(err);
//       })
//     }
//
//     _goMain(){
//       const { navigate,goBack } = this.props.navigation;
//       navigate('Main');
//     }
// }
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//     alignItems:'center',
//     justifyContent:'center',
//     padding:10,
//   },
//   font01:{
//     fontSize:StyleConfig.F_22
//   },
//   font02:{
//     marginTop:40,
//     fontSize:StyleConfig.F_14
//   }
// });
// export {LoadUI}
