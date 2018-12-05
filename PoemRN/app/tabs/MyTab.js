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
        ScrollView,
        RefreshControl,
      } from 'react-native';
import {connect} from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import * as UserActions from '../redux/actions/UserActions';
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
    isRefreshing:boolean,
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
   _onDiscuss:Function;
   _onFont:Function;
   _onStar:Function;
   _onRefresh:Function;
   _onReadSet:Function;
   constructor(props){
     super(props);
     console.log('---MyTab()---')
     this.state={
     //   headurl:nothead,
     //   pseudonym:'',
     //   userid:this.props.papp.userid,
     //   myfollow:0,
     //   followme:0,
       isRefreshing:false,
     }
     this._onStting = this._onStting.bind(this);
     this._onWorks = this._onWorks.bind(this);
     this._onDiscuss = this._onDiscuss.bind(this);
     this._onFont = this._onFont.bind(this);
     this._onStar = this._onStar.bind(this);
     this._onRefresh = this._onRefresh.bind(this);
     this._onReadSet = this._onReadSet.bind(this);
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
      <SafeAreaView
        style={pstyles.safearea}>
        <ScrollView style={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh}
              tintColor={StyleConfig.C_FFFFFF}
              title=""
              titleColor={StyleConfig.C_FFFFFF}
              colors={[StyleConfig.C_FFFFFF]}
              progressBackgroundColor={StyleConfig.C_FFFFFF}
            />
          }>
          {this._renderUserInfo()}
          <View style={styles.interval}></View>
          {this._renderWorks()}
          {this._renderDiscuss()}
          {this._renderStar()}
          {this._renderItem('read','material-community','阅读设置',this._onReadSet,false)}
          {this._renderItem('settings-applications','MaterialIcons','设置',this._onStting,false)}
        </ScrollView>
      </SafeAreaView>
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
                noborder={true}
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
                noborder={true}
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
          <TouchableOpacity onPress={()=>{
            this._onBadge();
          }}>
            <View style={styles.follow_item_bg}>
              <Text style={styles.follow_item_num}>{this.props.papp.user.badgenum||0}</Text>
              <Text style={styles.follow_item_font}>徽章</Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    }else{
      return(<View></View>)
    }
  }

  _renderItem(icon,type,title,func,rot){
    return(
      <TouchableOpacity onPress={()=>{
          func();
      }}>
      <View>
      <View style={styles.item}>
        <Icon
          name={icon}
          size={28}
          type={type}
          color={StyleConfig.C_333333}
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
      return(this._renderItem('inbox','MaterialIcons','我的作品',this._onWorks,false))
    }
  }
  _renderDiscuss(){
    if(this.props.papp.userid){
      return(this._renderItem('bubbles','simple-line-icon','我的想法',this._onDiscuss,false))
    }
  }
  _renderStar(){
    if(this.props.papp.userid){
      return(this._renderItem('star','MaterialIcons','我的收藏',this._onStar,false))
    }
  }
  _onWorks(){
    this.props.navigation.navigate(UIName.WorksUI);
  }
  _onDiscuss(){
    this.props.navigation.navigate(UIName.MyDiscussUI,{userid:this.props.papp.userid});
  }
  _onStar(){
    this.props.navigation.navigate(UIName.StarUI,{userid:this.props.papp.userid});
  }
  _onFont(){
    this.props.navigation.navigate(UIName.FontUI);
  }
  _onReadSet(){
    this.props.navigation.navigate(UIName.ReadSetUI);
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
  /**
   * 徽章
   * @return {[type]} [description]
   */
  _onBadge(){
    this.props.navigation.navigate(UIName.BadgeUI,{userid:this.props.papp.userid});
  }
  _onRefresh(){
    if(this.props.papp.userid){
      this.setState({isRefreshing: true});
      let { dispatch } = this.props.navigation;
      dispatch(UserActions.raAutoLogin(this.props.papp.userid));
      this.setState({isRefreshing: false,});
    }
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: StyleConfig.C_EDEDED,
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
    color:StyleConfig.C_333333,
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
    alignItems:'center',
  },
  follow_item_num:{
    fontSize:StyleConfig.F_14,
    color:StyleConfig.C_333333,
  },
  follow_item_font:{
    marginTop:6,
    fontSize:StyleConfig.F_12,
    color:StyleConfig.C_333333,
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
    color:StyleConfig.C_333333,
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
