'use strict'
/**
 * 个人信息
 */
import React from 'react';
import {
        StyleSheet,
        View,
        TouchableOpacity,
        Alert,
        Text,
        TextInput,
        FlatList,
} from 'react-native';
import { Icon,SocialIcon } from 'react-native-elements';
import PersonalListItem from '../custom/PersonalListItem';
import {
  StyleConfig,
  HeaderConfig,
  StorageConfig,
  HttpUtil,
  Global,
  Utils,
  pstyles,
  PImage,
  UIName,
} from '../AppUtil';

const nothead = require('../images/ic_account_circle_black.png');


class PersonalUI extends React.Component{
  static navigationOptions = ({navigation}) => ({
        title: '个人信息',
        headerTintColor:StyleConfig.C_FFFFFF,
        headerTitleStyle:HeaderConfig.headerTitleStyle,
        headerStyle:HeaderConfig.headerStyle,
        headerLeft:(
          <TouchableOpacity  onPress={()=>navigation.goBack()}>
            <Text style={pstyles.nav_left}>返回</Text>
          </TouchableOpacity>
        ),
     });
  navigate = this.props.navigation.navigate;
  dataContainer = [];
  constructor(props){
    super(props)
    let params = this.props.navigation.state.params;
    let userid = params.userid;
    this.state = {
      headurl:nothead,
      head:'',
      pseudonym:'',
      userid:userid,
      follow:'已关注',
      user:{myfollow:0,followme:0},
      myfollow_title:'我关注的',
      followme_title:'关注我的',
      sourceData : [],
      selected: (new Map(): Map<String, boolean>),
      refreshing: false,
    }
  }
  componentDidMount(){
    const { navigate } = this.props.navigation;
    this._requestOtherInfo(this.state.userid);
    if(this.state.userid != Global.user.userid){
      this.setState({
        myfollow_title:'ta关注的',
        followme_title:'关注ta的',
      });
    }
    this._requestNewestPoem();
  }
  componentWillUnmount(){

  }
  render(){
    return(
      <View style={styles.container}>
        <View style={styles.header}>
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
              </View>
            </View>
          {this._renderFollow()}
          {this._renderFollowOP()}
        </View>
        <FlatList
                  data={ this.state.sourceData }
                  extraData={ this.state.selected }
                  keyExtractor={ this._keyExtractor }
                  renderItem={ this._renderItem }
                  onEndReachedThreshold={0.1}
                  onEndReached={ this._onEndReached }
                  ItemSeparatorComponent={ this._renderItemSeparatorComponent }
                  ListEmptyComponent={ this._renderEmptyView }
                  refreshing={ this.state.refreshing }
                  onRefresh={ this._renderRefresh }
              />
      </View>
    )
  }
  _keyExtractor = (item, index) => index;
  _onPressItem = (id: string) => {
      this.setState((state) => {
          const selected = new Map(state.selected);
          selected.set(id, !selected.get(id));
          return {selected}
      });
      this.props.navigation.navigate(UIName.DetailsUI,{id:this.props.id});
  };
  _renderItem = ({item}) =>{
      return(
          <PersonalListItem
              id={item.id}
              onPressItem={ this._onPressItem }
              selected={ !!this.state.selected.get(item.id) }
              name= { item.name }
              poem={item}
              time={Utils.dateStr(item.time)}
          />
      );
  };
  // 自定义分割线
  _renderItemSeparatorComponent = ({highlighted}) => (
      <View style={{ height:1, backgroundColor:'#d4d4d4' }}></View>
  );

  // 空布局
  _renderEmptyView = () => (
      <View style={pstyles.empty}>
       <Text style={pstyles.empty_font}>暂无作品
       </Text>
      </View>
  );
  _renderRefresh = () => {
    if(!this.state.userid){
      return;
    }
    this._requestNewestPoem();
  };
  // 上拉加载更多
  _onEndReached = () => {
    console.log('-----------WorksTab_onEndReached--------------');
      if(!this.state.userid){
        return;
      }
     this.setState({refreshing: true})
     var fromid = 0;
     if(this.state.sourceData.length > 0 ){
       fromid = this.state.sourceData[this.state.sourceData.length-1].id;
     }
     var json = JSON.stringify({
       id:fromid,
       userid:this.state.userid,
     });
     HttpUtil.post(HttpUtil.POEM_HISTORY_POEM,json).then(res=>{
       if(res.code == 0){
           var poems = res.data;
            if(poems.length > 0){
              this.dataContainer = this.dataContainer.concat(poems);
              this.setState({
                sourceData: this.dataContainer
              });
            }
       }else{
         Alert.alert(res.errmsg);
       }
       this.setState({refreshing: false});
     }).catch(err=>{
       console.log(err);
     })
  };
  /**
   * 关注
   */
  _renderFollow(){
      return(
        <View style={styles.follow_bg}>
          <TouchableOpacity onPress={()=>{
            this._onMeFollow();
          }}>
            <View style={styles.follow_item_bg}>
              <Text style={styles.follow_item_num}>{this.state.user.myfollow}</Text>
              <Text style={styles.follow_item_font}>{this.state.myfollow_title}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{
            this._onFollowMe();
          }}>
            <View style={styles.follow_item_bg}>
              <Text style={styles.follow_item_num}>{this.state.user.followme}</Text>
              <Text style={styles.follow_item_font}>{this.state.followme_title}</Text>
            </View>
          </TouchableOpacity>
        </View>
      )
  }
  _renderFollowOP(){
    return(
    <View style={styles.follow}>
        <SocialIcon
          title={this.state.follow}
          button={true}
          onPress={()=>{
            this._onFollow();
          }}
          fontStyle={styles.follow_font}
          light
          style={styles.follow_button}
          />
          <SocialIcon
            title={'私信'}
            button={true}
            onPress={()=>{
              this._onChat();
            }}
            fontStyle={styles.follow_font}
            light
            style={styles.follow_button}
            />
      </View>
    )
  }
  _onFollow(){
      if(!Utils.isLogin(this.props.navigation.navigate))return;
      this._requestFollow();
  }
  _onChat(){
    if(!Utils.isLogin(this.props.navigation.navigate))return;
    this.props.navigation.navigate(UIName.ChatUI,{tuserid:this.state.userid,head:this.state.head,pseudonym:this.state.pseudonym});
  }
  _requestOtherInfo(userid){
    var json = JSON.stringify({
      myid:Global.user.userid,
      userid:userid,
    })
    HttpUtil.post(HttpUtil.USER_OTHERINFO,json).then(res=>{
      if(res.code == 0 ){
        let user = res.data;
        let headurl = user.head?{uri:HttpUtil.getHeadurl(user.head)}:nothead;
        let pseudonym = user.pseudonym;
        this.setState({
          headurl:headurl,
          pseudonym:pseudonym,
          user:user,
          head:user.head,
          follow:this._getFollowStr(user),
        })
      }else{
        Alert.alert(res.errmsg);
      }
    }).catch(err=>{
      console.log(err);
    })
  }
  _getFollowStr(user){
    var follow = '关注';
    if(user.fstate == 1&&user.state == 1){
      follow = '互相关注'
    }else if(user.fstate == 1){
      follow = '已关注'
    }else if(user.state == 1){
      follow = '关注我的'
    }
    return follow;
  }
  _requestFollow(){
    var json = JSON.stringify({
      userid:Global.user.userid,
      fansid:this.state.user.userid,
      op:this.state.user.fstate == 0?1:0,
    })
    HttpUtil.post(HttpUtil.USER_FOLLOW,json).then(res=>{
      if(res.code == 0 ){
        let user = res.data;
        let temp_user = this.state.user;
        temp_user.fstate = user.fstate;
        temp_user.tstate = user.tstate;
        let followme = temp_user.followme;
        if(user.fstate == 0&&followme > 0){
            followme -= 1;
        }
        temp_user.followme = followme;
        this.setState({
            user:temp_user,
            follow:this._getFollowStr(temp_user),
        })
      }else{
        Alert.alert(res.errmsg);
      }
    }).catch(err=>{
      console.log(err);
    })
  }
  _requestNewestPoem(){
    if(!this.state.userid){
      return;
    }
     this.setState({refreshing: true});
     var fromid = 0;
     if(this.state.sourceData.length > 0 ){
       fromid = this.state.sourceData[0].id;
     }
     var json = JSON.stringify({
       id:fromid,
       userid:this.state.userid,
     });
     HttpUtil.post(HttpUtil.POEM_NEWEST_POEM,json).then(res=>{
       if(res.code == 0 ){
         var poems = res.data;
          if(poems.length > 0){
            this.dataContainer = poems.concat(this.dataContainer);
            this.setState({
              sourceData: this.dataContainer
            });
          }
       }else{
         Alert.alert(res.errmsg);
       }
       this.setState({refreshing: false});
     }).catch(err=>{
       console.error(err);
     });
  }
  /**
   * 我的关注
   */
  _onMeFollow(){
    this.navigate('FollowUI',{userid:this.state.userid,title:this.state.myfollow_title,type:0});
  }
  /**
   * 关注我的
   */
  _onFollowMe(){
    this.navigate('FollowUI',{userid:this.state.userid,title:this.state.followme_title,type:1});
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  nav_left:{
    fontSize:18,
    color:'#ffffff',
    marginLeft:10,
  },
  nav_right:{
    fontSize:18,
    color:'#ffffff',
    marginRight:10,
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
  //关注按钮
  follow:{
    flex:1,
    flexDirection:'row',
    padding:5,
    alignItems:'flex-end',
    justifyContent:'flex-end',
  },
  follow_button:{
    width:80,
    height:30,
  },
  follow_font:{
    fontSize:StyleConfig.F_18,
    color:StyleConfig.C_1E8AE8,
    marginLeft:-2,
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
})
export {PersonalUI};
