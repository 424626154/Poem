'use strict'
/**
 * 用户协议
 */
import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView ,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import * as UserActions from '../redux/actions/UserActions';

import{
  StyleConfig,
  HeaderConfig,
  pstyles,
  Permission,
  Utils,
  HttpUtil,
} from '../AppUtil';

const agreement =
`1、本条所述内容是指用户使用本app的过程中所制作、上载、复制、发布、传播的任何内容，包括但不限于账号、名称、用户说明等注册信息及认证资料，或文字、语音、图片、视频、图文等发送、回复或自动回复消息和相关链接页面，以及其他使用账号或本服务所产生的内容。

2、用户不得利用账号或本服务制作、上载、复制、发布、传播如下法律、法规和政策禁止的内容：

(1) 反对宪法所确定的基本原则的；

(2) 危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；

(3) 损害国家荣誉和利益的；

(4) 煽动民族仇恨、民族歧视，破坏民族团结的；

(5) 破坏国家宗教政策，宣扬邪教和封建迷信的；

(6) 散布谣言，扰乱社会秩序，破坏社会稳定的；

(7) 散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；

(8) 侮辱或者诽谤他人，侵害他人合法权益的；

(9) 含有法律、行政法规禁止的其他内容的信息。

3、用户不得利用账号或本服务制作、上载、复制、发布、传播如下干扰正常运营，以及侵犯其他用户或第三方合法权益的内容：

(1) 含有任何性或性暗示的；

(2) 含有辱骂、恐吓、威胁内容的；

(3) 含有骚扰、垃圾广告、恶意信息、诱骗信息的；

(4) 涉及他人隐私、个人信息或资料的；

(5) 侵害他人名誉权、肖像权、知识产权、商业秘密等合法权利的；

(6) 含有其他干扰本服务正常运营和侵犯其他用户或第三方合法权益内容的信息。`
class AgreementUI extends React.Component{
  static navigationOptions = ({navigation}) => ({
        title:'用户协议',
        headerTintColor:StyleConfig.C_FFFFFF,
        headerTitleStyle:HeaderConfig.headerTitleStyle,
        headerStyle:HeaderConfig.headerStyle,
        headerLeft:(
          <TouchableOpacity  onPress={()=>{
            navigation.goBack()
          }}>
            <Text style={pstyles.nav_left}>返回</Text>
          </TouchableOpacity>
        ),
     });
     constructor(props){
       super(props);
       let papp = this.props.papp;
       this.papp = papp;
       let params = this.props.navigation.state.params;
       let toui = params.toui;
       this.state = {
         toui:toui
       }
     }
    render(){
      return(
        <View style={pstyles.container}>
        <ScrollView >
          <Text style={styles.agreement}>{agreement}</Text>
        </ScrollView>
        <View style={styles.button}>
          <TouchableOpacity
            style={styles.but_bg}
            onPress={()=>{
              this._requestPer();
          }}>
            <Text style={styles.but_text}>同意并继续</Text>
          </TouchableOpacity>
        </View>
        </View>
      )
    }

    _requestPer(){
      console.log(this.papp.user.per)
      let per = Utils.setPermission(Permission.WRITE,true,this.papp.user.per);
      console.log(per)
      let json = JSON.stringify({
        userid:this.papp.userid,
        per:per,
      });
      HttpUtil.post(HttpUtil.USER_PER,json).then(res=>{
          if(res.code == 0){
            let user = res.data;
            let { dispatch } = this.props.navigation;
            dispatch(UserActions.rePermission(user.userid,user.per));
            if(this.state.toui){
              this.props.navigation.goBack();
              this.props.navigation.navigate(this.state.toui);
            }else{
              this.props.navigation.goBack();
            }
          }else{
            Alert.alert(res.code);
          }
      }).catch(err=>{
        console.error(err);
      })
    }
}
const styles = StyleSheet.create({
      agreement:{
        padding:10,
        fontSize:20,
      },
      but_text:{
          fontSize:20,
          color:StyleConfig.C_FFFFFF,
      },
      but_bg:{
          height:40,
          borderRadius:10,
          alignItems:'center',
          justifyContent:'center',
          backgroundColor:StyleConfig.C_1E8AE8,
      },
      button:{
          height:80,
          paddingLeft:40,
          paddingRight:40,
      }
});
export default connect(
    state => ({
        papp: state.papp,
    }),
)(AgreementUI);
