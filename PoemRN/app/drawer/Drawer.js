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
      Image,
     } from 'react-native';
import { Icon } from 'react-native-elements';

import {
    StyleConfig,
    HeaderConfig,
    StorageConfig,
    pstyles,
    Utils,
    Global,
    Emitter,
    HttpUtil,
    MessageDao,
    Storage,
    ImageConfig,
    PImage,
    UIName,
  } from '../AppUtil';
const nothead = require('../images/nothead.png');

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
      unread:0,
    }
  }
  componentDidMount(){
    DeviceEventEmitter.addListener(Emitter.OBSERVER,obj=>{
       this._analysisObserver(obj);
    });
    let userid = Storage.getUserid();
    if(userid){
      Global.user.userid = userid;
    }
    this._eventUserInfo();
    this._onHome = this._onHome.bind(this);
    this._onPerson = this._onPerson.bind(this);
    this._onWorks = this._onWorks.bind(this);
    this._onStting = this._onStting.bind(this);
    this._onMessage = this._onMessage.bind(this);
    var unread = MessageDao.getUnreadNum();
    this.setState({
      unread:unread,
    });
    // console.log('@@@Drawer()componentDidMount');
  }
  componentWillUnmount(){
    DeviceEventEmitter.removeAllListeners();
    this.timer && clearTimeout(this.timer);
    // console.log('@@@Drawer()componentWillUnmount')
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
            navigate('DrawerClose');
            if(this.state.userid){
              navigate('MyUI');
            }else{
              navigate(UIName.LoginUI);
            }
          }}>
          <View style={styles.personal}>
            <PImage
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
        {this._renderMessage()}
        {this._renderItem('设置','settings',this._onStting,false)}
      </View>
    )
  }
  _renderNavOS(){
    return(Platform.OS === 'ios'?<View style={HeaderConfig.iosNavStyle }></View>:null)
  }

  _renderItem(title,icon,func,rot){
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
        {this._renderRot(rot)}
        </View>
      </TouchableOpacity>
    )
  }
  _renderRot(rot){
    if(rot){
      return(
        <Icon
          name="brightness-1"
          style={styles.dot}
          size={6}
          type="MaterialIcons"
          color={"#ff4040"}
        />
      )
    }else{
      return null
    }
  }
  _renderPerson(){
    if(this.state.userid){
      return(this._renderItem('作品','call-to-action',this._onWorks,false))
    }
  }
  _renderMessage(){
    if(this.state.userid){
      return(this._renderItem('消息','message',this._onMessage,this.state.unread > 0))
    }
  }
  navigate(routeName){
      this.props.navigation.navigate(routeName);
  }
  _onHome(){
    navigate('DrawerClose');
    navigate('HomeUI')
  }
  _onPerson(){
    navigate('DrawerClose');
    navigate('MyUI');
    // Emitter.emit(Emitter.DRAWER_CLOSE,'');
    // this.timer = setTimeout(
    //   () => {this.props.navigation.navigate('MyUI'); },
    //   0
    // );
    // this.props.navigation.navigate('MyUI')
  }
  _onWorks(){
    this.navigate('DrawerClose');
    this.navigate('WorksUI');
  }
  _onMessage(){
    this.navigate('DrawerClose');
    this.navigate('MessageUI');
  }
  _onStting(){
    this.navigate('DrawerClose');
    this.navigate('SettingUI');
  }
  _eventUserInfo(){
    console.log('----_eventUserInfo----')
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
    console.log('@@@Drawer()action:'+action);
    switch (action) {
      case Emitter.UPINFO:
      case Emitter.LOGOUT:
        this.setState({
          userid:Global.user.userid,
        })
        this._eventUserInfo();
        break;
      case Emitter.READMSG:
        var unread = MessageDao.getUnreadNum();
        this.setState({
          unread:unread,
        });
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
  },
  dot:{
    position: 'absolute',
    top: 10,
    left: 90,
  }
});

export {Drawer};
