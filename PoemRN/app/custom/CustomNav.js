// import React from 'react';
// import {
//       StyleSheet,
//       Platform,
//       Text,
//       View,
//       FlatList,
//       TouchableOpacity,
//      } from 'react-native';
//
// import {StyleConfig,HeaderConfig,StorageConfig} from '../Config';
// import pstyles from '../style/PStyles';
// const isIOS = Platform.OS === 'ios';
// class CustomNav extends React.Component {
//   constructor(props){
//     super(props);
//   }
//   render(){
//     const { state,navigate,goBack } = this.props.navigation;
//     return(
//       <View style={styles.header}>
//           {isIOS?<View style={HeaderConfig.iosNavStyle}></View>:null}
//           <View style={styles.header_bg}>
//             <TouchableOpacity  style={styles.header_left}
//             onPress={()=>navigate('HomeUI')}>
//               <Text style={pstyles.nav_left}>返回</Text>
//             </TouchableOpacity>
//             <Text style={styles.header_title}>{this.props.title}</Text>
//             <View style={styles.header_right}></View>
//           </View>
//       </View>
//     )
//   }
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//   },
//   header:{
//     paddingTop:4,
//     paddingBottom:4,
//     backgroundColor:StyleConfig.C_1E8AE8,
//   },
//   header_bg:{
//     flexDirection:'row',
//     alignItems:'center',
//   },
//   header_left:{
//     width:80,
//   },
//   header_right:{
//     width:80,
//   },
//   header_title:{
//     flex:1,
//     fontSize:StyleConfig.F_22,
//     textAlign:'center',
//     color:StyleConfig.C_FFFFFF,
//   },
// });
// export {CustomNav};
