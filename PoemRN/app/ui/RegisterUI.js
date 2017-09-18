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
} from 'react-native';

class RegisterUI extends React.Component {
 static navigationOptions = ({navigation}) => ({
       header:null,
    });

  render() {
    const { navigate,goBack } = this.props.navigation;
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
            placeholder={'用户名'}
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
          />
          <Button
            buttonStyle={{backgroundColor: '#1e8ae8', borderRadius: 5,margin:0}}
            textStyle={{textAlign: 'center',fontSize:18,}}
            title={'发送验证码'}
            onPress={this.onVerify}
          />
        </View>
        <View style={styles.interval}></View>
        <Button
          buttonStyle={{backgroundColor: '#1e8ae8', borderRadius: 5,margin:0}}
          textStyle={{textAlign: 'center',fontSize:18,}}
          title={'注册'}
          onPress={()=>{

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
  onLogin(){
    Alert.alert('onLogin')
  }

  onRegister(){
    Alert.alert('onRegister')
  }
  onVerify(){
    Alert.alert('onVerify')
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
