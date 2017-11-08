'use strict'
/**
 * 注册
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
  AsyncStorage,
  DeviceEventEmitter,
  Platform,
} from 'react-native';

import{
  StyleConfig,
  HeaderConfig,
  StorageConfig,
  HttpUtil,
  Emitter,
  Global,
  pstyles,
  Storage,
} from '../AppUtil'
/**
 * 注册
 */
class RegisterUI extends React.Component {
  static navigationOptions = ({navigation}) => ({
        title:'注册',
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
        phone:'',
        password:'',
        code:'',
        time:0,
        code_tips:'发送验证码',
        code_color:StyleConfig.C_1E8AE8,
      }
      this._timer = null;
    }
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
            size={30}
            type="MaterialIcons"
            color={'#1e8ae8'}
          />
          <TextInput
            style={styles.input}
            underlineColorAndroid={'transparent'}
            placeholder={'手机号'}
            onChangeText={(text) => this.setState({phone:text})}
            value={this.state.phone}
          />
        </View>
        <View style={styles.line}></View>
        <View style={styles.input_bg}>
          <Icon
            name='keyboard'
            size={30}
            type="MaterialIcons"
            color={'#1e8ae8'}
          />
          <TextInput
            style={styles.input}
            underlineColorAndroid={'transparent'}
            placeholder={'密码'}
            onChangeText={(text) => this.setState({password:text})}
            value={this.state.password}
          />
        </View>
        <View style={styles.line}></View>
        <View style={styles.input_bg}>
          <Icon
            name='verified-user'
            size={30}
            type="MaterialIcons"
            color={'#1e8ae8'}
          />
          <TextInput
            style={styles.input}
            underlineColorAndroid={'transparent'}
            placeholder={'验证码'}
            onChangeText={(text) => this.setState({code:text})}
            value={this.state.code}
          />
          <Button
            buttonStyle={{backgroundColor: this.state.code_color, borderRadius: 5,margin:0}}
            textStyle={{textAlign: 'center',fontSize:18,}}
            title={this.state.code_tips}
            onPress={()=>{
              this.onVerify()
            }}
          />
        </View>
        <View style={styles.interval}></View>
        <Button
          buttonStyle={{backgroundColor: '#1e8ae8', borderRadius: 5,margin:0}}
          textStyle={{textAlign: 'center',fontSize:18,}}
          title={'注册'}
          onPress={()=>{
              this.onRegister();
          }}
        />
        <View style={styles.other}>
          <TouchableOpacity onPress={()=>{
            goBack()
          }}>
            <Text style={styles.register}>登录</Text>
          </TouchableOpacity>
        </View>
        </View>
      </View>
    );
  }

  onRegister(){
    if(!this.state.phone){
      Alert.alert('请输入手机号');
      return;
    }
    if(!this.state.password){
      Alert.alert('请输入密码');
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
    HttpUtil.post(HttpUtil.USER_REGISTER,json).then((res) => {
        if(res.code == 0){
            var user = res.data;
            Global.user = user;
            var userid = user.userid;
            Storage.saveUserid(userid);
            Emitter.emit(Emitter.LOGIN,user);
            this.props.navigation.navigate('PerfectUI');
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
  countTime(tiem){
    if(tiem <= 0){
      return;
    }
    this.setState({time:tiem,
      code_tips:tiem+'秒后可发送',
      code_color:StyleConfig.C_7B8992,
    });
    this._timer=setInterval(()=>{
      var cur_time = this.state.time - 1;
      this.setState({time:cur_time});
      if(this.state.time<=0){
        var tips = '发送验证码';
        this.setState({code_tips:tips,
        code_color:StyleConfig.C_1E8AE8
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
  register:{
    color:'#1e8ae8',
    fontSize:18,
  },
  forget:{
    color:'#7b8992',
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

export {RegisterUI};
