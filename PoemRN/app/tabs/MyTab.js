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
        Alert,
      } from 'react-native';
import { Icon } from 'react-native-elements';

import {StyleConfig,HeaderConfig,StorageConfig} from '../Config';
import Utils from '../utils/Utils';
import Global from '../Global';
import Emitter from '../utils/Emitter';
import HttpUtil from '../utils/HttpUtil';

const modify = require('../images/ic_border_color_black.png');
const nothead = require('../images/ic_account_circle_black.png');
/**
 * 我的主页
 */
class MyTab extends React.Component {
  static navigationOptions = ({navigation}) => ({
        headerTintColor:StyleConfig.C_FFFFFF,
        headerTitleStyle:HeaderConfig.headerTitleStyle,
        headerStyle:HeaderConfig.headerStyle,
     });
    navigate = this.props.navigation.navigate;
   constructor(props){
     super(props);
     this.state={
       headurl:nothead,
       pseudonym:'',
       userid:'',
       myfollow:0,
       followme:0,
     }
   }
   componentDidMount(){
     this._eventUserInfo();
     DeviceEventEmitter.addListener(Emitter.OBSERVER,obj=>{
        this._analysisObserver(obj);
     });
   }
   componentWillUnMount(){
     DeviceEventEmitter.remove();
   }
  render() {
    const { state,navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={()=>{
              if(this.state.userid){
                navigate('PerfectUI',{go_back_key:state.key});
              }else{
                navigate('LoginUI',{go_back_key:state.key});
              }
            }}>
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
            </TouchableOpacity>
            {this._renderFollow()}
          </View>
        <View style={styles.interval}></View>
        {this._renderLogout()}
      </View>
    );
  }
  _renderEdit(){
    if(this.state.userid){
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
  /**
   * 关注
   */
  _renderFollow(){
    if(this.state.userid){
      return(
        <View style={styles.follow_bg}>
          <TouchableOpacity onPress={()=>{
            this._onMeFollow();
          }}>
            <View style={styles.follow_item_bg}>
              <Text style={styles.follow_item_num}>{this.state.myfollow}</Text>
              <Text style={styles.follow_item_font}>我关注的人</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{
            this._onFollowMe();
          }}>
            <View style={styles.follow_item_bg}>
              <Text style={styles.follow_item_num}>{this.state.followme}</Text>
              <Text style={styles.follow_item_font}>关注我的人</Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    }else{
      return(<View></View>)
    }
  }
  /**
   * 退出登录
   */
  _renderLogout(){
    if(this.state.userid){
      return(
          <TouchableOpacity onPress={()=>{
            AsyncStorage.setItem(StorageConfig.USERID,'',(error,result)=>{
              if (!error) {
                Global.user.userid = result;
                Emitter.emit(Emitter.LOGOUT,'');
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
    console.log('_eventUserInfo:'+JSON.stringify(user));
    if(user.userid){
      let headurl = user.head?{uri:HttpUtil.getHeadurl(user.head)}:nothead;
      let pseudonym = user.pseudonym;
      this.setState({
        headurl:headurl,
        pseudonym:pseudonym,
        userid:user.userid,
        myfollow:user.myfollow,
        followme:user.followme,
      })
    }else{
      this.setState({
        headurl:nothead,
        pseudonym:'未登录',
        userid:'',
      })
    }
  }
  /**
   * 解析观察者
   */
  _analysisObserver(obj){
      var action = obj.action;
      var param = obj.param;
      switch (action) {
        case Emitter.LOGIN:
        case Emitter.LOGOUT:
        case Emitter.UPINFO:
          this._eventUserInfo();
          break;
        default:
          break;
      }
  }
  /**
   * 我的关注
   */
  _onMeFollow(){
    this.navigate('FollowUI',{title:'我的关注',type:0});
  }
  /**
   * 关注我的
   */
  _onFollowMe(){
    this.navigate('FollowUI',{title:'关注我的',type:1});
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
    color:StyleConfig.C_FFFFFF,
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
  //关注
  follow_bg:{
    flexDirection:'row',
    padding:10,
  },
  follow_item_bg:{
    padding:10,
  },
  follow_item_num:{
    fontSize:StyleConfig.F_14,
    color:StyleConfig.C_000000,
  },
  follow_item_font:{
    marginTop:10,
    fontSize:StyleConfig.F_12,
    color:StyleConfig.C_D4D4D4,
  }
});

export {MyTab};
