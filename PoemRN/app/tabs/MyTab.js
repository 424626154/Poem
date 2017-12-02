'use strict'
/**
 * 我的
 * @flow
 */
import React from 'react';
import {
        StyleSheet,
        Text,
        View,
        TouchableOpacity,
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
  HttpUtil,
  PImage,
  UIName,
} from '../AppUtil'

const modify = require('../images/modify.png');
const nothead = require('../images/nothead.png');

type Props = {
    papp:Object,
    navigation:any,
};

type State = {
    // userid:string,
    // pseudonym:string,
    // headurl:any,
    // myfollow:number,
    // followme:number,
};

class MyTab extends React.Component<Props,State> {
  static navigationOptions = ({navigation}) => ({
        title: '我的',
        headerTintColor:HeaderConfig.headerTintColor,
        headerTitleStyle:HeaderConfig.headerTitleStyle,
        headerStyle:HeaderConfig.headerStyle,
        headerLeft:null,
     });

     _onStting:Function;
     _onWorks:Function;
   constructor(props){
     super(props);
     console.log('---MyTab()---')
     // this.state={
     //   headurl:nothead,
     //   pseudonym:'',
     //   userid:this.props.papp.userid,
     //   myfollow:0,
     //   followme:0,
     // }
     this._onStting = this._onStting.bind(this);
     this._onWorks = this._onWorks.bind(this);
   }
   componentDidMount(){
     // this._reloadUserInfo();
   }
   componentWillUnmount(){
     
   }

   shouldComponentUpdate(nextProps, nextState){
     return true;
   }
  render() {
    const { state,navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        {this._renderUserInfo()}
        <View style={styles.interval}></View>
        {this._renderWorks()}
        {this._renderItem('settings-applications','设置',this._onStting,false)}
      </View>
    );
  }
  _renderUserInfo(){
    if(this.props.papp.userid){
      return(
        <View style={styles.header}>
          <TouchableOpacity onPress={()=>{
            this.props.navigation.navigate(UIName.PerfectUI);
          }}>
          <View style={styles.personal}>
            <TouchableOpacity
              onPress={()=>{
                Alert.alert(
                    '设置头像',
                    null,
                    [
                      {text: '查看大图', onPress: () =>{
                        this.props.navigation.navigate(UIName.PhotoUI,{photo:this.props.papp.user.head})
                      }},
                      {text: '设置头像', onPress: () =>{
                        this.props.navigation.navigate(UIName.PerfectUI)
                      }},
                    ]
                  )
              }}>
              <PImage
                style={pstyles.big_head}
                source={this._getHeadurl()}
                />
              </TouchableOpacity>
              <View style={styles.head_bg}>
                <Text style={styles.name}>
                  {this.props.papp.user.pseudonym}
                </Text>
              </View>
              <View style={styles.personal_more}>
                  {this._renderMore()}
              </View>
            </View>
          </TouchableOpacity>
          {this._renderFollow()}
        </View>
      )
    }else{
      return(
        <View style={styles.header}>
          <TouchableOpacity onPress={()=>{
            this.props.navigation.navigate(UIName.LoginUI);
          }}>
          <View style={styles.personal}>
              <PImage
                style={pstyles.big_head}
                source={nothead}
                />
              <View style={styles.head_bg}>
                <Text style={styles.name}>
                  未登录
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )
    }
  }
  /**
   * 关注
   */
  _renderFollow(){
    if(this.props.papp.userid){
      return(
        <View style={styles.follow_bg}>
          <TouchableOpacity onPress={()=>{
            this._onMeFollow();
          }}>
            <View style={styles.follow_item_bg}>
              <Text style={styles.follow_item_num}>{this.props.papp.user.myfollow}</Text>
              <Text style={styles.follow_item_font}>我关注的人</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{
            this._onFollowMe();
          }}>
            <View style={styles.follow_item_bg}>
              <Text style={styles.follow_item_num}>{this.props.papp.user.followme}</Text>
              <Text style={styles.follow_item_font}>关注我的人</Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    }else{
      return(<View></View>)
    }
  }

  _renderItem(icon,title,func,rot){
    return(
      <TouchableOpacity onPress={()=>{
          func();
      }}>
      <View>
      <View style={styles.item}>
        <Icon
          name={icon}
          size={28}
          type="MaterialIcons"
          color={StyleConfig.C_000000}
        />
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
        <View style={styles.dot}>
          <Icon
            name="brightness-1"
            size={6}
            type="MaterialIcons"
            color={"#ff4040"}
          />
        </View>
      )
    }else{
      return null
    }
  }
  _renderMore(){
    if(this.props.papp.userid){
      return(
        <Icon
          name='create'
          size={30}
          type="MaterialIcons"
          color={StyleConfig.C_D4D4D4}
        />
      )
    }else{
      return(
        <View></View>
      )
    }
  }
  _renderWorks(){
    if(this.props.papp.userid){
      return(this._renderItem('inbox','我的作品',this._onWorks,false))
    }
  }

  _onWorks(){
    this.props.navigation.navigate(UIName.WorksUI);
  }
  _onStting(){
    this.props.navigation.navigate(UIName.SettingUI);
  }
  // _reloadUserInfo(){
  //   // console.log(this)
  //   // let user = this.props.papp.user;
  //   // console.log('_reloadUserInfo:'+JSON.stringify(user));
  //   if(this.props.papp.userid){
  //     let user = this.props.papp.user;
  //     let headurl = user.head?{uri:HttpUtil.getHeadurl(user.head)}:nothead;
  //     let pseudonym = user.pseudonym;
  //     // this.setState({
  //     //   headurl:headurl,
  //     //   pseudonym:pseudonym,
  //     //   myfollow:user.myfollow,
  //     //   followme:user.followme,
  //     //   userid:this.props.papp.userid,
  //     // })
  //   }else{
  //     this.setState({
  //       headurl:nothead,
  //       pseudonym:'未登录',
  //       userid:'',
  //     })
  //   }
  // }
  _getHeadurl(){
    if(this.props.papp.userid){
      let user = this.props.papp.user;
      let headurl = user.head?{uri:HttpUtil.getHeadurl(user.head)}:nothead;
      return headurl;
    }else{
      return nothead
    }
  }
  /**
   * 我的关注
   */
  _onMeFollow(){
    this.props.navigation.navigate(UIName.FollowUI,{userid:this.props.papp.userid,title:'我的关注',type:0});
  }
  /**
   * 关注我的
   */
  _onFollowMe(){
    this.props.navigation.navigate(UIName.FollowUI,{userid:this.props.papp.userid,title:'关注我的',type:1});
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebebeb',
  },
  header:{
    backgroundColor:StyleConfig.C_FFFFFF,
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
    color:StyleConfig.C_000000,
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
    marginTop:6,
    fontSize:StyleConfig.F_12,
    color:StyleConfig.C_000000,
  },
  item:{
    // flex:1,
    flexDirection:'row',
    alignItems:'center',
    height:40,
    backgroundColor:StyleConfig.C_FFFFFF,
    // borderTopWidth:1,
    // borderTopColor:'#d4d4d4',
    // borderBottomWidth:1,
    // borderBottomColor:'#d4d4d4',
    marginTop:10,
    paddingLeft:10,
  },
  item_title:{
    // marginTop:10,
    paddingLeft:10,
    fontSize:16,
    color:StyleConfig.C_000000,
  },
  dot:{
    position: 'absolute',
    left:30,
    top:8,
  }
});
export default connect(
    state => ({
        papp: state.papp,
    }),
)(MyTab);
