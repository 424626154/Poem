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

import {StyleConfig,HeaderConfig,StorageConfig} from '../Config';
import HttpUtil from '../utils/HttpUtil';
import Emitter from '../utils/Emitter';
import Global from '../Global';
import pstyles from '../style/PStyles';

class LoginUI extends React.Component {
  static navigationOptions = ({navigation}) => ({
        title:'登录',
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
      }
    }
    componentDidMount(){

    }
    componentWillUnMount(){

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
            secureTextEntry = {true}
            onChangeText={(text) => this.setState({password:text})}
            value={this.state.password}
          />
        </View>
        <View style={styles.interval}></View>
        <Button
          buttonStyle={{backgroundColor: '#1e8ae8', borderRadius: 5,margin:0}}
          textStyle={{textAlign: 'center',fontSize:18,}}
          title={'登录'}
          onPress={()=>{
            // alert(this.state.phone+'_'+this.state.password)
            this._onLogin();
          }}
        />
        <View style={styles.other}>
          <TouchableOpacity onPress={()=>{
            navigate('RegisterUI')
          }}>
            <Text style={styles.register}>注册</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onForget}>
            <Text style={styles.forget}>忘记密码</Text>
          </TouchableOpacity>
        </View>
        </View>
      </View>
    );
  }
  onRegister(){
    Alert.alert('onRegister')
  }

  onForget(){
    Alert.alert('onForget')
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
    var json = JSON.stringify({
      phone:this.state.phone,
      password:this.state.password,
    });
    HttpUtil.post(HttpUtil.USER_LOGIN,json)
    .then((res) => {
      if(res.code == 0){
          var user = res.data;
          var userid = user.userid;
          Global.user = user;
          Emitter.emit(Emitter.LOGIN,user);
          AsyncStorage.setItem(StorageConfig.USERID,userid,(error,result)=>{
            if (error) {
              console.error(error);
            }
          });
          this.props.navigation.goBack();
      }else{
        Alert.alert(res.errmsg);
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
    padding:0,
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

export {LoginUI};
