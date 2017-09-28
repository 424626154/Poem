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

import {StorageConfig} from '../Config';
import HttpUtil from '../utils/HttpUtil';
import Emitter from '../utils/Emitter';
import Global from '../Global';

/**
 * 注册
 */
class RegisterUI extends React.Component {
 static navigationOptions = ({navigation}) => ({
       header:null,
    });
    constructor(props){
      super(props);
      this.state={
        phone:'',
        password:'',
        code:'',
      }
    }
    componentDidMount(){

    }
    componentWillUnMount(){

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
            name='home'
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
            name='home'
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
            name='home'
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
            buttonStyle={{backgroundColor: '#1e8ae8', borderRadius: 5,margin:0}}
            textStyle={{textAlign: 'center',fontSize:18,}}
            title={'发送验证码'}
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
    });
    HttpUtil.post(HttpUtil.USER_REGISTER,json).then((res) => {
        if(res.code == 0){
            var user = res.data;
            Global.user = user;
            var userid = user.userid;
            AsyncStorage.setItem(StorageConfig.USERID,userid,(error,result)=>{
              if (!error) {
                Emitter.emit(Emitter.LOGIN,user);
                this.props.navigation.navigate('PerfectUI');
              }
            });
        }else{
          Alert.alert(res.errmsg);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  onVerify(){
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
            Alert.alert(validate.code);
        }else{
          alert(res.errmsg);
        }
      })
      .catch((error) => {
        console.error(error);
      });
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
    backgroundColor: '#d4d4d4',
    borderRadius:10,
    borderColor:'#7b8992',
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
    backgroundColor:'#7b8992',
    height:1,
    marginLeft:14,
    marginRight:14,
    marginTop:10,
    marginBottom:10,
  }
});

export {RegisterUI};
