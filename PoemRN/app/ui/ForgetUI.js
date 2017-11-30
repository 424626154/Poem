'use strict'
/**
 * 忘记密码
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
  Keyboard,
} from 'react-native';

import{
      StyleConfig,
      HeaderConfig,
      StorageConfig,
      HttpUtil,
      pstyles,
      Storage,
    } from '../AppUtil'
import{
      NavBack,
      }from '../custom/Custom';
type Props = {
  navigation:any,
};

type State = {
  phone:string,
  password:string,
  code:string,
  time:number,
  code_tips:string,
  code_color:string,
  phone_clear:boolean,
  password_clear:boolean,
  pwd_visibility:boolean,
};
export default class ForgetUI extends React.Component<Props,State> {
  static navigationOptions = ({navigation}) => ({
        title:'忘记密码',
        headerTintColor:HeaderConfig.headerTintColor,
        headerTitleStyle:HeaderConfig.headerTitleStyle,
        headerStyle:HeaderConfig.headerStyle,
        headerLeft:(<NavBack navigation={navigation}/>),
     });
     state={
       phone:'',
       password:'',
       code:'',
       time:0,
       code_tips:'发送验证码',
       code_color:StyleConfig.C_FFFFFF,
       phone_clear:false,
       password_clear:false,
       pwd_visibility:false,
     }
     _timer:number;

    componentDidMount(){

    }
    componentWillUnmount(){
        this._timer&&clearInterval(this._timer)
    }
  render() {
    const { state,navigate,goBack } = this.props.navigation;
    const params = state.params || {};
    return (
      <View style={styles.container}>
        <View style={styles.login}>
        <View style={styles.interval}></View>
        <View style={styles.input_bg}>
          <Icon
            name='phone'
            size={28}
            type="MaterialIcons"
            color={StyleConfig.C_000000}
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
            color={StyleConfig.C_000000}
          />
          <TextInput
            ref='password'
            style={styles.input}
            underlineColorAndroid={'transparent'}
            placeholder={'新密码'}
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
            returnKeyType={'next'}
            blurOnSubmit={false}
            secureTextEntry = {this.state.pwd_visibility}
            onSubmitEditing={() => this._focusNextField('code')}
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
        <View style={styles.input_bg}>
          <Icon
            name='verified-user'
            size={28}
            type="MaterialIcons"
            color={StyleConfig.C_000000}
          />
          <TextInput
            ref='code'
            style={styles.input}
            underlineColorAndroid={'transparent'}
            placeholder={'验证码'}
            keyboardType={'numeric'}
            returnKeyType={'done'}
            onChangeText={(text) => this.setState({code:text})}
            value={this.state.code}
            onFocus={()=>{
              this._reloadFocus()
            }}
          />
          <Button
            buttonStyle={[styles.register_but,{marginRight:-14,backgroundColor: this.state.code_color}]}
            textStyle={styles.register_text}
            title={this.state.code_tips}
            onPress={()=>{
              this.onVerify()
            }}
          />
        </View>
        <View style={styles.line}></View>
        <View style={styles.interval}></View>
        <Button
          buttonStyle={styles.register_but}
          textStyle={styles.register_text}
          title={'修改'}
          onPress={()=>{
              this._onForget();
          }}
        />
        <View style={styles.interval}></View>
        </View>
      </View>
    );
  }
  _focusNextField(nextField){
    if(nextField == 'password'){
      this.refs.password.focus()
    }
    if(nextField == 'code'){
      this.refs.code.focus()
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
    return this.state.pwd_visibility?StyleConfig.C_D4D4D4:StyleConfig.C_000000;
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
  _onForget(){
    if(!this.state.phone){
      Alert.alert('请输入手机号');
      return;
    }
    if(!this.state.password){
      Alert.alert('请输入新密码');
      return;
    }
    if(!this.state.code){
      Alert.alert('请输入验证码');
      return;
    }
    var json = JSON.stringify({
      phone:this.state.phone,
      password:this.state.password,
      code:this.state.code,
      os:Platform.OS ,
    });
    HttpUtil.post(HttpUtil.USER_FORGET,json).then((res) => {
        if(res.code == 0){
            var user = res.data;
            Alert.alert('密码修改成功');
            Storage.saveLastPhone(this.state.phone);
            this.props.navigation.goBack();
        }else{
          Alert.alert(res.errmsg);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  onVerify(){
    if(this.state.time > 0 ){
      return;
    }
    if(!this.state.phone){
      Alert.alert('请输入手机号');
      return;
    }
    var json = JSON.stringify({
      phone:this.state.phone,
      type:2,
    });
    HttpUtil.post(HttpUtil.USER_VALIDATE,json).then((res) => {
        if(res.code == 0){
            var validate = res.data;
            var time = validate.time;
            console.log(time);
            this.countTime(time);
            // Alert.alert(validate.code);
        }else{
          alert(res.errmsg);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  countTime(tiem:number){
    if(tiem <= 0){
      return;
    }
    this.setState({time:tiem,
      code_tips:tiem+'秒后可发送',
      code_color:StyleConfig.C_D4D4D4,
    });
    this._timer=setInterval(()=>{
      var cur_time = this.state.time - 1;
      this.setState({time:cur_time});
      if(this.state.time<=0){
        var tips = '发送验证码';
        this.setState({code_tips:tips,
        code_color:StyleConfig.C_FFFFFF,
        });
        this._timer && clearInterval(this._timer);
      }else{
        var tips = cur_time+'秒后可发送'
        this.setState({code_tips:tips});
      }
    },1000);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
  interval:{
    height:10,
  },
  other:{
    flexDirection:'row',
    justifyContent:'space-between',
    padding:14,
  },
  register_but:{
     backgroundColor:StyleConfig.C_FFFFFF,
     borderColor:StyleConfig.C_000000,
     borderRadius: 5,
     borderWidth:1,
     margin:0
   },
   register_text:{
     textAlign: 'center',
     fontSize:18,
     color:StyleConfig.C_000000,
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
    padding:1,
  },
  line:{
    backgroundColor:StyleConfig.C_D4D4D4,
    height:1,
    marginLeft:14,
    marginRight:14,
    marginTop:10,
    marginBottom:10,
  }
});
