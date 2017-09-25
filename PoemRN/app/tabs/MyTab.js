// 我的
import React from 'react';
import {
        StyleSheet,
        Text,
        View,
        Image,
        TouchableOpacity,
        DeviceEventEmitter,
        AsyncStorage,
      } from 'react-native';
import { Icon } from 'react-native-elements';

import Utils from '../utils/Utils';
import Global from '../Global';
import Emitter from '../utils/Emitter';
import HttpUtil from '../utils/HttpUtil';

const modify = require('../images/ic_border_color_black.png');
const nothead = require('../images/ic_account_circle_black.png');

class MyTab extends React.Component {
  static navigationOptions = ({navigation}) => ({
        title: '我的',
        headerTintColor:'#ffffff',
        headerTitleStyle:{fontSize:20},
        headerStyle:{
          backgroundColor:'#1e8ae8',
        },
     });
   constructor(props){
     super(props);
     this.state={
       headurl:nothead,
       pseudonym:'',
       islogin:false,
     }
   }
   componentDidMount(){
     this.reloadLogin();
     DeviceEventEmitter.addListener('Login', (obj)=>{
       this.reloadLogin();
     });
     DeviceEventEmitter.addListener(Emitter.UPINFO,obj=>{
       this._eventUserInfo();
     })
   }
   componentWillUnMount(){
     DeviceEventEmitter.remove();
   }
  render() {
    const { state,navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={()=>{
          if(this.state.islogin){
            navigate('PerfectUI',{go_back_key:state.key});
          }else{
            navigate('LoginUI',{go_back_key:state.key});
          }
        }}>
          <View style={styles.header}>
            <View style={styles.personal}>
              <Image
                style={styles.head}
                source={this.state.headurl}
                />
              <View style={styles.head_bg}>
                <Text style={styles.name}>
                  {this.state.pseudonym}
                </Text>
              </View>
              <View style={styles.personal_more}>
                {this._renderEdit()}
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.interval}></View>
        {this.renderLogout()}
      </View>
    );
  }
  _renderEdit(){
    if(this.state.islogin){
      return(
        <Icon
          name='create'
          size={30}
          type="MaterialIcons"
          color={'#ffffff'}
        />
      )
    }else{
      return(
        <View></View>
      )
    }
  }
  reloadLogin(){
    AsyncStorage.getItem('userid',(error,result)=>{
      if(!error){
        var islogin = false;
        if(result){
          islogin = true;
        }
        var name = '未登录';
        if(islogin){
          name = result;
        }
        console.log('islogin:'+islogin+'name:'+name)
        this.setState({
          islogin:islogin,
          name:name,
        })
      }
    })
  }
  /**
   * 退出登录
   */
  renderLogout(){
    if(this.state.islogin){
      return(
          <TouchableOpacity onPress={()=>{
            AsyncStorage.setItem('userid','',(error,result)=>{
              if (!error) {
                this.reloadLogin();
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
  _eventUserInfo(){
    let user = Global.user;
    let headurl = user.head?{uri:HttpUtil.getHeadurl(user.head)}:nothead;
    Utils.log('_eventUserInfo @@@@@@',headurl);
    let pseudonym = user.pseudonym;
    this.setState({
      headurl:headurl,
      pseudonym:pseudonym,
    })
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  nav:{
    height:26,
  },
  header:{
    backgroundColor: '#1e8ae8',
  },
  header_title:{
    fontSize:20,
    color:'#ffffff',
    textAlign:'center',
  },
  personal:{
    flexDirection:'row',
    padding:10,
  },
  head_bg:{
    flex:1,
    padding:10,
  },
  head:{
    height:80,
    width:80,
  },
  name:{
    fontSize:20,
    color:'#ffffff',
  },
  personal_more:{
    justifyContent:'center',
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
  logout:{
    marginTop:10,
    fontSize:22,
    color:'#d4d4d4',
  },
});

export {MyTab};
