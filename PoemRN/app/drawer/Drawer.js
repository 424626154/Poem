import React from 'react';
import {
      StyleSheet,
      Platform,
      Text,
      View,
      TouchableOpacity,
      DeviceEventEmitter,
      AsyncStorage,
      Alert,
     } from 'react-native';
import { Icon } from 'react-native-elements';
import {CachedImage} from "react-native-img-cache";

import {StyleConfig,HeaderConfig,StorageConfig} from '../Config';
import pstyles from '../style/PStyles';
import Utils from '../utils/Utils';
import Global from '../Global';
import Emitter from '../utils/Emitter';
import HttpUtil from '../utils/HttpUtil';

const nothead = require('../images/ic_account_circle_black.png');

class Drawer extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      headurl:nothead,
      pseudonym:'',
      userid:'',
      tips:'',
      myfollow:0,
      followme:0,
    }
  }
  componentDidMount(){
    DeviceEventEmitter.addListener(Emitter.OBSERVER,obj=>{
       this._analysisObserver(obj);
    });
    this._eventUserInfo();
    this._onHome = this._onHome.bind(this);
    this._onPerson = this._onPerson.bind(this);
    this._onWorks = this._onWorks.bind(this);
    this._onStting = this._onStting.bind(this);


  }
  componentWillUnMount(){
    DeviceEventEmitter.remove();
    this.timer && clearTimeout(this.timer);
  }
  render(){
    const { state,navigate } = this.props.navigation;
    return(
      <View style={styles.container}>
        {this._renderNavOS()}
        <TouchableOpacity style={styles.drwaer_close} onPress={()=>{
            navigate('DrawerClose');
        }}>
        {/* <View style={styles.close}> */}
          <Icon
            name='close'
            size={26}
            type="MaterialIcons"
            color={StyleConfig.C_FFFFFF}
          />
        {/* </View> */}
        </TouchableOpacity>
        <View style={styles.header}>
          <TouchableOpacity onPress={()=>{
            if(this.state.userid){
              navigate('MyUI',{go_back_key:state.key});
            }else{
              navigate('LoginUI',{go_back_key:state.key});
            }
          }}>
          <View style={styles.personal}>
              <CachedImage
                style={pstyles.big_head}
                source={this.state.headurl}
                />
              <View style={styles.head_bg}>
                <Text style={styles.name}>
                  {this.state.pseudonym}
                </Text>
                <Text style={styles.tips}>
                  {this.state.tips}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        {/* {this._renderItem('首页','apps',this._onHome)} */}
        {this._renderPerson()}
        {this._renderItem('设置','settings',this._onStting)}
      </View>
    )
  }
  _renderNavOS(){
    return(Platform.OS === 'ios'?<View style={HeaderConfig.iosNavStyle }></View>:null)
  }
  _renderItem(title,icon,func){
    return(
      <TouchableOpacity onPress={()=>{
          func();
      }}>
      <View style={styles.item}>
        <Icon
          name={icon}
          size={26}
          type="MaterialIcons"
          color={StyleConfig.C_FFFFFF}
        />
        <Text style={styles.item_title}>
          {title}
        </Text>
        </View>
      </TouchableOpacity>
    )
  }
  _renderPerson(){
    if(this.state.userid){
      return(this._renderItem('作品','call-to-action',this._onWorks))
    }
  }
  _onHome(){
    this.props.navigation.navigate('HomeUI')
  }
  _onPerson(){
    // this.props.navigation.navigate('DrawerClose');
    // Emitter.emit(Emitter.DRAWER_CLOSE,'');
    // this.timer = setTimeout(
    //   () => {this.props.navigation.navigate('MyUI'); },
    //   0
    // );
    this.props.navigation.navigate('MyUI')
  }
  _onWorks(){
    this.props.navigation.navigate('WorksUI');
  }
  _onStting(){
    this.props.navigation.navigate('SettingUI');
  }
  _eventUserInfo(){
    let user = Global.user;
    if(user.userid){
      let headurl = user.head?{uri:HttpUtil.getHeadurl(user.head)}:nothead;
      let pseudonym = user.pseudonym;
      this.setState({
        headurl:headurl,
        pseudonym:pseudonym,
        userid:user.userid,
        myfollow:user.myfollow,
        followme:user.followme,
        tips:'',
      })
    }else{
      this.setState({
        headurl:nothead,
        pseudonym:'未登录',
        userid:'',
        tips:'点击头像登录'
      })
    }
  }
  /**
   * 解析广播数据
   */
  _analysisObserver(obj){
    var action = obj.action;
    var param = obj.param;
    switch (action) {
      case Emitter.UPINFO:
        this._eventUserInfo();
        break;
      case Emitter.LOGOUT:
        this.setState({
          userid:Global.user.userid,
        })
        this._eventUserInfo();
        break;
      default:
        break;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:StyleConfig.C_1E8AE8 ,
  },
  drwaer_close:{
    // flex: 1,
    flexDirection: 'row',
    justifyContent:'flex-end',
    padding:10,
  },
  header:{
    alignItems:'center',
  },
  header_title:{
    fontSize:20,
    color:'#ffffff',
    textAlign:'center',
  },
  personal:{
    padding:10,
  },
  head_bg:{
    padding:10,
  },
  name:{
    fontSize:20,
    color:StyleConfig.C_FFFFFF,
  },
  tips:{
    marginTop:10,
    fontSize:14,
    textAlign:'center',
    color:StyleConfig.C_D4D4D4,
  },
  item:{
    paddingLeft:20,
    paddingTop:10,
    flexDirection:'row',
  },
  item_title:{
    marginLeft:6,
    fontSize:StyleConfig.F_22,
    color:StyleConfig.C_FFFFFF,
  }
});

export {Drawer};
