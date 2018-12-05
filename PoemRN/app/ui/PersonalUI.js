'use strict'
/**
 * 个人信息
 * @flow
 */
import React from 'react';
import {
        StyleSheet,
        View,
        TouchableOpacity,
        Text,
        TextInput,
        FlatList,
      } from 'react-native';
import {connect} from 'react-redux';
import { Icon } from 'react-native-elements';
import PersonalListItem from '../custom/PersonalListItem';
import {
        StyleConfig,
        HeaderConfig,
        StorageConfig,
        HttpUtil,
        Utils,
        pstyles,
        PImage,
        UIName,
        showToast,
        Global,
      } from '../AppUtil';

import{
      NavBack,
      }from '../custom/Custom';

const nothead = require('../images/nothead.png');
type Props = {
    navigation:any,
    papp:Object,
};

type State = {
    userid:string,
    myfollow_title:string,
    followme_title:string,
    refreshing:boolean,
    sourceData:Array<Object>,
    selected:Map<string, boolean>,
    user:Object,
    headurl:any,
    pseudonym:string,
    follow:string,
    head:string,
};

class PersonalUI extends React.Component<Props,State>{
  static navigationOptions = ({navigation}) => ({
        title: '个人信息',
        headerTintColor:HeaderConfig.headerTintColor,
        headerTitleStyle:HeaderConfig.headerTitleStyle,
        headerStyle:HeaderConfig.headerStyle,
        headerLeft:(<NavBack navigation={navigation}/>),
        headerRight:(<View style={pstyles.nav_right}/>),
     });
  dataContainer = [];
  _renderHead:Function;
  _renderFollowOP:Function;
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
      selected: (new Map(): Map<string, boolean>),
      refreshing: false,
    }
    this._renderHead = this._renderHead.bind(this);
    this._renderFollowOP = this._renderFollowOP.bind(this);
  }
  componentDidMount(){
    const { navigate } = this.props.navigation;
    this._requestOtherInfo(this.state.userid);
    if(this.state.userid != this.props.papp.userid){
      this.setState({
        myfollow_title:'ta关注的',
        followme_title:'关注ta的',
      });
    }
    this._requestNewestPoem();
  }
  componentWillUnmount(){

  }
  shouldComponentUpdate(nextProps, nextState){
    console.log('------PersonalUI() shouldComponentUpdate')
    return true;
  }
  render(){
    return(
      <View style={pstyles.container}>
        {/* {this._renderHead()} */}
        <FlatList
                  data={ this.state.sourceData }
                  extraData={ this.state.selected }
                  keyExtractor={ this._keyExtractor }
                  renderItem={ this._renderItem }
                  onEndReachedThreshold={0.1}
                  onEndReached={ this._onEndReached }
                  ItemSeparatorComponent={ this._renderItemSeparatorComponent }
                  ListHeaderComponent={ this._renderHead }
                  ListEmptyComponent={ this._renderEmptyView }
                  refreshing={ this.state.refreshing }
                  onRefresh={ this._renderRefresh }
              />
      </View>
    )
  }
  _renderHead(){
    return(
      <View style={styles.header}>
        <View style={styles.personal}>
          <TouchableOpacity
            onPress={()=>{
              this._onPhoto();
            }}
            >
            <PImage
              style={pstyles.big_head}
              source={this.state.headurl}
              // borderRadius={0}
              noborder={true}
              />
            </TouchableOpacity>
            <View style={styles.head_bg}>
              <Text style={styles.name}>
                {this.state.pseudonym}
              </Text>
            </View>
            <View style={styles.personal_more}>
            </View>
          </View>
        {this._renderFollowOP()}
        {this._renderFollow()}
        <View style={pstyles.line}/>
      </View>
    )
  }
  _keyExtractor = (item, index) => index+'';
  _onPressItem = (id: string) => {
      this.setState((state) => {
          const selected = new Map(state.selected);
          selected.set(id, !selected.get(id));
          return {selected}
      });
      this.props.navigation.navigate(UIName.DetailsUI,{id:id});
  };
  _renderItem = ({item}) =>{
      return(
          <PersonalListItem
              id={item.id}
              onPressItem={ this._onPressItem }
              selected={ !!this.state.selected.get(item.id) }
              name= { item.name }
              item={item}
              extend={this._getExtend(item)}
              time={Utils.dateStr(item.time)}
          />
      );
  };
  // 自定义分割线
  _renderItemSeparatorComponent = ({highlighted}) => (
      <View style={pstyles.separator}></View>
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
         showToast(res.errmsg);
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
          <TouchableOpacity onPress={()=>{
            this._onStar();
          }}>
            <View style={styles.follow_item_bg}>
              <Text style={styles.follow_item_num}>{this.state.user.starnum}</Text>
              <Text style={styles.follow_item_font}>{'收藏'}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{
            this._onBadge();
          }}>
            <View style={styles.follow_item_bg}>
              <Text style={styles.follow_item_num}>{this.state.user.badgenum||0}</Text>
              <Text style={styles.follow_item_font}>{'徽章'}</Text>
            </View>
          </TouchableOpacity>
        </View>
      )
  }
  _renderFollowOP(){
    // console.log('------_renderFollowOP')
    return(
    <View style={styles.follow}>
          <TouchableOpacity
            style={[styles.follow_button,{borderColor:this.state.user.fstate == 0?StyleConfig.C_666666:StyleConfig.C_D4D4D4}]}
            onPress={()=>{
              this._onFollow();
            }}>
              <Text style={[styles.follow_font,{color:this.state.user.fstate == 0?StyleConfig.C_333333:StyleConfig.C_D4D4D4}]}>
                {this.state.follow}
              </Text>
          </TouchableOpacity>
          <View style={{width:10,}}></View>
          <TouchableOpacity
            style={styles.follow_button}
            onPress={()=>{
              this._onChat();
            }}>
              <Text style={styles.follow_font}>
                {'私信'}
              </Text>
          </TouchableOpacity>
      </View>
    )
  }
  _onPhoto(){
    this.props.navigation.navigate(UIName.PhotoUI,{photo:this.state.head});
  }
  _onFollow(){
      if(!Utils.isLogin(this.props.navigation))return;
      this._requestFollow();
  }
  _onChat(){
    if(!Utils.isLogin(this.props.navigation))return;
    this.props.navigation.navigate(UIName.ChatUI,{tuserid:this.state.userid,head:this.state.head,pseudonym:this.state.pseudonym});
  }
  _onStar(){
    this.props.navigation.navigate(UIName.StarUI,{userid:this.state.userid})
  }
  _onBadge(){
    this.props.navigation.navigate(UIName.BadgeUI,{userid:this.state.userid})
  }

  _requestOtherInfo(userid){
    var json = JSON.stringify({
      myid:this.props.papp.user.userid,
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
        showToast(res.errmsg);
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
      userid:this.props.papp.userid,
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
        }else if(user.fstate == 1){
            followme += 1;
        }
        temp_user.followme = followme;
        let follow = this._getFollowStr(temp_user);
        console.log(follow)
        this.setState({
            user:temp_user,
            follow:follow,
        })
        let dataContainer = [...this.dataContainer];
        this.setState({
          sourceData: dataContainer,
        });
      }else{
        showToast(res.errmsg);
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
         showToast(res.errmsg);
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
    this.props.navigation.navigate('FollowUI',{userid:this.state.userid,title:this.state.myfollow_title,type:0});
  }
  /**
   * 关注我的
   */
  _onFollowMe(){
    this.props.navigation.navigate('FollowUI',{userid:this.state.userid,title:this.state.followme_title,type:1});
  }
  _getExtend(item:Object):Object{
    let extend = {}
    if(item.extend){
      extend = JSON.parse(item.extend);
    }
    return extend;
  }
}

const styles = StyleSheet.create({
  header:{
    backgroundColor: StyleConfig.C_FFFFFF,
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
    color:StyleConfig.C_333333,
  },
  //关注按钮
  follow:{
    // flex:1,
    flexDirection:'row',
    // paddingBottom:14,
    // alignItems:'flex-end',
    justifyContent:'flex-end',
    paddingRight:10,
  },
  follow_button:{
    width:80,
    height:30,
    backgroundColor:StyleConfig.C_FFFFFF,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:8,
    borderWidth:1,
    borderColor:StyleConfig.C_666666,
  },
  follow_font:{
    fontSize:StyleConfig.F_18,
    color:StyleConfig.C_333333,
    fontWeight:'bold',
  },
  //关注
  follow_bg:{
    flexDirection:'row',
    padding:10,
  },
  follow_item_bg:{
    padding:10,
    width:Global.width/4,
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
  personal_more:{

  },
  line:{
    height:10,
    backgroundColor:StyleConfig.C_EDEDED,
  }
})
export default connect(
    state => ({
        papp: state.papp,
    }),
)(PersonalUI);
