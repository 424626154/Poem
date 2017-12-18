'use strict'
/**
 * 登录
 * @flow
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
  Platform,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import * as UserActions from '../redux/actions/UserActions';

import{
      StyleConfig,
      HeaderConfig,
      StorageConfig,
      HttpUtil,
      pstyles,
      Storage,
      UIName,
    } from '../AppUtil';
import{
      NavBack,
      }from '../custom/Custom';
import AnalyticsUtil from '../umeng/AnalyticsUtil';

type Props = {
    navigation:any,
};

type State = {
    phone:string,
    password:string,
    phone_clear:boolean,
    password_clear:boolean,
    pwd_visibility:boolean,
    animating:boolean,
};
class LoginUI extends React.Component<Props,State> {
  static navigationOptions = ({navigation}) => ({
        title:'登录',
        headerTintColor:HeaderConfig.headerTintColor,
        headerTitleStyle:HeaderConfig.headerTitleStyle,
        headerStyle:HeaderConfig.headerStyle,
        headerLeft:(<NavBack navigation={navigation}/>),
     });
     state={
       phone:'',
       password:'',
       phone_clear:false,
       password_clear:false,
       pwd_visibility:true,
       animating:false,
     }
    componentDidMount(){
      let phone = Storage.getLastPhone();
      // console.log(phone)
      this.setState({
        phone:phone||'',
        animating:false,
      });
    }
    componentWillUnmount(){

    }
  render() {
    const { state,navigate,goBack } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.login}>
        <View style={styles.interval}></View>
        <View style={styles.input_bg}>
          <Icon
            name='phone'
            size={28}
            type="MaterialIcons"
            color={StyleConfig.C_333333}
          />
          <TextInput
            ref='phone'
            style={styles.input}
            underlineColorAndroid={'transparent'}
            placeholder={'手机号'}
            onChangeText={(text) =>{
               this.setState({phone:text});
               if(text){
                   if(!this.state.phone_clear){
                     this.setState({phone_clear:true});
                   }
               }else{
                   if(this.state.phone_clear){
                     this.setState({phone_clear:false});
                   }
               }
            }}
            value={this.state.phone}
            keyboardType={'phone-pad'}
            returnKeyType={'next'}
            blurOnSubmit={false}
            onSubmitEditing={() => this._focusNextField('password')}
            onFocus={()=>{
              this._reloadFocus()
            }}
          />
          {this._renderPhoneClear()}
        </View>
        <View style={styles.line}></View>
        <View style={styles.input_bg}>
          <Icon
            name='keyboard'
            size={28}
            type="MaterialIcons"
            color={StyleConfig.C_333333}
          />
          <TextInput
            ref='password'
            style={styles.input}
            underlineColorAndroid={'transparent'}
            placeholder={'密码'}
            secureTextEntry = {this.state.pwd_visibility}
            onChangeText={(text) =>{
              this.setState({password:text})
              if(text){
                  if(!this.state.password_clear){
                    this.setState({password_clear:true});
                  }
              }else{
                  if(this.state.password_clear){
                    this.setState({password_clear:false});
                  }
              }
            }}
            value={this.state.password}
            returnKeyType={'done'}
            onFocus={()=>{
              this._reloadFocus()
            }}
          />
          {this._renderPasswordClear()}
          <TouchableOpacity
              onPress={()=>{
                this._onVsibility()
              }}
              >
            <Icon
              name={this._renderVName()}
              size={28}
              type="MaterialIcons"
              color={this._renderVColor()}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.line}></View>
        <View style={styles.interval}></View>
        <Button
          buttonStyle={styles.login_but}
          textStyle={styles.login_text}
          title={'登录'}
          onPress={()=>{
            // alert(this.state.phone+'_'+this.state.password)
            this._onLogin();
          }}
        />
        <View style={styles.other}>
          <TouchableOpacity onPress={()=>{
            let {state} = this.props.navigation;
            navigate(UIName.RegisterUI,{fui:state.key})
          }}>
            <Text style={styles.register}>注册</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{
            navigate(UIName.ForgetUI)
          }}>
            <Text style={styles.forget}>忘记密码</Text>
          </TouchableOpacity>
        </View>
        </View>
        {this._renderLoading()}
      </View>
    );
  }
  _renderLoading(){
    if(this.state.animating){
      return(
        <View style={pstyles.loading}>
          <ActivityIndicator
           animating={this.state.animating}
           style={pstyles.centering}
           color="white"
           size="large"/>
        </View>
      )
    }else{
      return null;
    }
  }
  _reloadFocus(){
    if(this.refs.phone.isFocused()){
        var phone_clear = true;
        if(!this.state.phone){
          phone_clear = false;
        }
        this.setState({
          phone_clear:phone_clear,
          password_clear:false,
        })
    }else if(this.refs.password.isFocused()){
      var password_clear = true;
      if(!this.state.password){
        password_clear = false;
      }
      this.setState({
        phone_clear:false,
        password_clear:password_clear,
      })
    }else{
      this.setState({
        phone_clear:false,
        password_clear:false,
      })
    }
  }
  _renderPhoneClear(){
      if(this.state.phone_clear){
        return(
          <TouchableOpacity
              onPress={()=>{
                  this.setState({phone:'',phone_clear:false,});
              }}
              >
            <Icon
              name='clear'
              size={28}
              type="MaterialIcons"
              color={StyleConfig.C_D4D4D4}
            />
          </TouchableOpacity>
        )
    }else{
        return null;
    }
  }

  _renderPasswordClear(){
    if(this.state.password_clear){
      return(
        <TouchableOpacity
            onPress={()=>{
                this.setState({password:'',password_clear:false,});
            }}
            >
          <Icon
            name='clear'
            size={28}
            type="MaterialIcons"
            color={StyleConfig.C_D4D4D4}
          />
        </TouchableOpacity>
      )
    }else{
      return null;
    }
  }

  _renderVName(){
    return this.state.pwd_visibility?'visibility-off':'visibility';
  }
  _renderVColor(){
    return this.state.pwd_visibility?StyleConfig.C_D4D4D4:StyleConfig.C_333333;
  }
  _onVsibility(){
    var isVis = true;
    if(this.state.pwd_visibility){
      isVis = false;
    }
    this.setState({
      pwd_visibility:isVis,
    })
  }
  _focusNextField(nextField){
    if(nextField == 'password'){
      this.refs.password.focus()
    }
  }
  _onLogin(){
    if(!this.state.phone){
      Alert.alert('请输入手机号');
      return;
    }
    if(!this.state.password){
      Alert.alert('请输入密码');
      return;
    }
    this.setState({animating:true});
    var json = JSON.stringify({
      phone:this.state.phone,
      password:this.state.password,
      os:Platform.OS,
    });
    HttpUtil.post(HttpUtil.USER_LOGIN,json)
    .then((res) => {
      if(res.code == 0){
          let user = res.data;
          let userid = user.userid;
          let { dispatch } = this.props.navigation;
          dispatch(UserActions.raAutoLogin(userid));
          AnalyticsUtil.profileSignInWithPUID(userid);
          Storage.saveUserid(userid);
          Storage.saveLastPhone(this.state.phone);
          this.props.navigation.goBack();
      }else{
        Alert.alert(res.errmsg);
      }
      this.setState({animating:false});
    })
    .catch((error) => {
      this.setState({animating:false});
      console.error(error);
        Alert.alert(error);
    });
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:StyleConfig.C_FFFFFF,
    // alignItems:'center',
    justifyContent:'center',
    padding:10,
  },
  login:{
    backgroundColor: StyleConfig.C_FFFFFF,
    borderRadius:10,
    borderColor:StyleConfig.C_D4D4D4,
    borderWidth:1,
  },
  login_but:{
     backgroundColor:StyleConfig.C_FFFFFF,
     borderColor:StyleConfig.C_666666,
     borderRadius: 5,
     borderWidth:1,
     margin:0
   },
   login_text:{
     textAlign: 'center',
     fontSize:18,
     color:StyleConfig.C_333333
   },
  interval:{
    height:10,
  },
  other:{
    flexDirection:'row',
    justifyContent:'space-between',
    padding:14,
  },
  register:{
    color:StyleConfig.C_333333,
    fontSize:18,
  },
  forget:{
    color:StyleConfig.C_7B8992,
    fontSize:18,
  },
  input_bg:{
    flexDirection:'row',
    paddingLeft:14,
    paddingRight:14,
  },
  input:{
    flex:1,
    height:30,
    marginLeft:6,
    padding:0,
  },
  line:{
    backgroundColor:StyleConfig.C_D4D4D4,
    height:1,
    marginLeft:14,
    marginRight:14,
    marginTop:10,
    marginBottom:10,
  },
});
export default connect(
    state => ({
        papp: state.papp,
    }),
)(LoginUI);
