// 我的
import React from 'react';
import {
        StyleSheet,
        Text,
        View,
        TouchableOpacity,
        DeviceEventEmitter,
        Alert,
      } from 'react-native';
import {connect} from 'react-redux';
import { Icon } from 'react-native-elements';

import{
  StyleConfig,
  HeaderConfig,
  StorageConfig,
  pstyles,
  Utils,
  Global,
  Emitter,
  HttpUtil,
  PImage,
  UIName,
} from '../AppUtil'

import {CustomNav} from '../custom/CustomNav';

const modify = require('../images/modify.png');
const nothead = require('../images/nothead.png');
/**
 * 我的主页
 */
class MyTab extends React.Component {
  static navigationOptions = ({navigation}) => ({
        title: '我的',
        headerTintColor:StyleConfig.C_FFFFFF,
        headerTitleStyle:HeaderConfig.headerTitleStyle,
        headerStyle:HeaderConfig.headerStyle,
        headerLeft:null,
     });
    navigate = this.props.navigation.navigate;
   constructor(props){
     super(props);
     console.log('---MyTab()---')
     let papp = this.props.papp;
     this.papp = papp||{};
     this.state={
       headurl:nothead,
       pseudonym:'',
       userid:Global.user.userid||'',
       myfollow:0,
       followme:0,
     }
     this._onStting = this._onStting.bind(this);
     this._onWorks = this._onWorks.bind(this);
   }
   componentDidMount(){
     this._reloadUserInfo();
   }
   componentWillUnmount(){
   }
   // componentWillReceiveProps(){
   //   console.log('---MyTab() componentWillReceiveProps');
   // }
   shouldComponentUpdate(nextProps, nextState){
     console.log('---MyTab() shouldComponentUpdate');
     console.log('---nextProps');
     console.log(nextProps)
     console.log('---nextState');
     console.log(nextState);
     console.log(this.props.papp);
     console.log(this.papp);
     console.log(Object.is(this.papp,this.props.papp))

     //用户信息更新 或者id
     if(!Object.is(nextProps.papp.user,this.props.papp.user)
       ||!Object.is(nextProps.papp.userid,this.props.papp.userid)){
       console.log('---up papp');
       this.papp = this.props.papp = nextProps.papp;
       this._reloadUserInfo();
     }
     return true;
   }
  render() {
    const { state,navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
      {/* <CustomNav {...this.props} title='我的'/> */}
          <View style={styles.header}>
            <TouchableOpacity onPress={()=>{
              if(this.state.userid){
                navigate(UIName.PerfectUI);
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
                </View>
                <View style={styles.personal_more}>
                    {this._renderMore()}
                </View>
              </View>
            </TouchableOpacity>
            {this._renderFollow()}
          </View>
        <View style={styles.interval}></View>
        {this._renderWorks()}
        {this._renderItem('设置',this._onStting,false)}
      </View>
    );
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

  _renderItem(title,func,rot){
    return(
      <TouchableOpacity onPress={()=>{
          func();
      }}>
      <View>
      <View style={styles.interval}></View>
      <View style={styles.item}>
        <Text style={styles.item_title}>
          {title}
        </Text>
        {this._renderRot(rot)}
        </View>
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
  _renderMore(){
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
  _renderWorks(){
    if(this.state.userid){
      return(this._renderItem('我的作品',this._onWorks,false))
    }
  }

  _onWorks(){
    this.navigate(UIName.WorksUI);
  }
  _onStting(){
    this.navigate(UIName.SettingUI);
  }
  _reloadUserInfo(){
    console.log(this)
    let user = this.papp.user;
    console.log('_reloadUserInfo:'+JSON.stringify(user));
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
  },
  item:{
    alignItems:'center',
    height:40,
    borderTopWidth:1,
    borderTopColor:'#d4d4d4',
    borderBottomWidth:1,
    borderBottomColor:'#d4d4d4',
  },
  item_title:{
    marginTop:10,
    fontSize:18,
    color:StyleConfig.C_7B8992,
  },
  dot:{
    position: 'absolute',
    top: 10,
    left: 90,
  }
});
export default connect(
    state => ({
        papp: state.papp,
    }),
)(MyTab);
